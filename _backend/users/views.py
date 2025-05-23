from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.utils import swagger_auto_schema
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from .serializers import RegisterSerializer
from django.contrib.auth.models import User

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        # Create user with required fields
        user = User.objects.create_user(
            username=data['username'],  # Ensure 'username' is in frontend payload
            email=data.get('email', ''),
            password=data['password'],
            first_name=data.get('name', '')
        )

        # Create user profile
        profile = UserProfile.objects.create(
            user=user,
            address=data.get('address', ''),
            city=data.get('city', ''),
            otp_code='000000',
            status='active'
        )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        # Serialize user data
        user_data = BasicUserSerializer(user).data

        return Response({
            'message': 'User registered successfully.',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)






class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        user_location = self.request.query_params.get('location', None)
        if user_location:
            lat, lon = map(float, user_location.split(','))
            user_point = Point(lon, lat, srid=4326)
            queryset = queryset.annotate(distance=Distance('location', user_point)).order_by('distance')
        return queryset

    @swagger_auto_schema(operation_description="Retrieve a user profile")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Update a user profile")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_description="Delete a user profile")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


# ✅ Registration View
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(operation_description="Register a new user")
    def post(self, request):
        data = request.data
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=data['username'],
            email=data.get('email', ''),
            password=make_password(data['password'])
        )

        profile = UserProfile.objects.create(
            user=user,
            address=data.get('address', ''),
            city=data.get('city', ''),
            otp_code=data.get('otp_code', ''),
            status=data.get('status', ''),
            location=Point(float(data.get('lon', 0)), float(data.get('lat', 0)), srid=4326)
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully.',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'name': user.get_full_name(),
                'email': user.email,
                'user_type': profile.user_type
            }
        })


# ✅ Login View
from rest_framework.serializers import ModelSerializer

class BasicUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_data = BasicUserSerializer(user).data
            return Response({
                'message': 'Login successful.',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'name': user.get_full_name(),
                    'email': user.email,
                    'user_type': user.userprofile.user_type
                }
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
