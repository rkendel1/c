from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from .models import ChatMessage, UserProfile, Conversation, Notification, Subscription
from .serializers import ChatMessageSerializer, UserProfileSerializer, ConversationSerializer, NotificationSerializer, SubscriptionSerializer
from ollama import Mistral
from .embedding import create_embeddings

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Integrate ollama mistral for processing chat messages
        mistral = Mistral()
        response = mistral.process_message(serializer.validated_data['message'])
        if serializer.validated_data.get('anonymous', False):
            serializer.save(response=response, user=None)
        else:
            serializer.save(response=response)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        user_location = self.request.query_params.get('location', None)
        if user_location:
            lat, lon = map(float, user_location.split(','))
            user_point = Point(lon, lat, srid=4326)
            queryset = queryset.annotate(distance=Distance('location', user_point)).order_by('distance')
        return queryset

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class EmbeddingViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.get('data')
        data_type = request.data.get('data_type')
        if not data or not data_type:
            return Response({"error": "Data and data_type are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            embeddings = create_embeddings(data, data_type)
            return Response({"message": "Embeddings created successfully."}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
