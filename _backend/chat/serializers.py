from rest_framework import serializers
from .models import ChatMessage, Conversation

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'message', 'timestamp', 'anonymous']



class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'messages', 'timestamp']



class EmbeddingSerializer(serializers.Serializer):
    data = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )
    data_type = serializers.ChoiceField(choices=['text', 'image', 'audio'])
