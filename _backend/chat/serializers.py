from rest_framework import serializers
from .models import ChatMessage, Conversation


from rest_framework import serializers
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'
        read_only_fields = ['user', 'response']



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
