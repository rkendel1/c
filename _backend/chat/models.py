from django.db import models
from users.models import UserProfile
from django.utils import timezone

class ChatMessage(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    anonymous = models.BooleanField(default=False)

class Conversation(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    messages = models.ManyToManyField(ChatMessage)
    timestamp = models.DateTimeField(auto_now_add=True)

