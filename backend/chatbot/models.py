from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models

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
    location = gis_models.PointField(null=True, blank=True)

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    messages = models.ManyToManyField(ChatMessage)
    timestamp = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
