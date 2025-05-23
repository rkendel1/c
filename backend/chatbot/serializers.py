from rest_framework import serializers
from .models import ChatMessage, UserProfile, Conversation, Notification, Subscription

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'message', 'timestamp', 'anonymous']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'address', 'city', 'otp_code', 'status', 'location']

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'messages', 'timestamp']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'timestamp', 'read']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'topic', 'timestamp']

class EmbeddingSerializer(serializers.Serializer):
    data = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )
    data_type = serializers.ChoiceField(choices=['text', 'image', 'audio'])
