from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from drf_yasg.utils import swagger_auto_schema

from .models import ChatMessage, Conversation
from .serializers import ChatMessageSerializer, ConversationSerializer
from .embedding import create_embeddings
from rest_framework.decorators import action

import requests


def call_mistral(prompt):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False,
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.RequestException as e:
        return f"Error contacting Mistral model: {str(e)}"




class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        prompt = serializer.validated_data['message']
        response = call_mistral(prompt)

        if serializer.validated_data.get('anonymous', False) or self.request.user.is_anonymous:
            serializer.save(response=response, user=None)
        else:
            serializer.save(response=response, user=self.request.user)


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
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

    @swagger_auto_schema(operation_description="Retrieve a conversation")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Update a conversation")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Delete a conversation")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)