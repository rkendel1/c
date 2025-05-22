from django.db import models
from django.contrib.auth.models import User

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    otp_code = models.CharField(max_length=6)
    status = models.CharField(max_length=50)

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    messages = models.ManyToManyField(ChatMessage)
    timestamp = models.DateTimeField(auto_now_add=True)
