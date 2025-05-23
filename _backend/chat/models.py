from django.db import models
from users.models import UserProfile
from django.utils import timezone
from django.conf import settings

class ChatMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    message = models.TextField()
    response = models.TextField(blank=True, null=True)  # <-- REQUIRED
    anonymous = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[:50]
class Conversation(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    messages = models.ManyToManyField(ChatMessage)
    timestamp = models.DateTimeField(auto_now_add=True)

