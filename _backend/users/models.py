# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    otp_code = models.CharField(max_length=6)
    status = models.CharField(max_length=50)
    location = gis_models.PointField(null=True, blank=True)
    user_type = models.CharField(max_length=50, default='citizen') 

    def __str__(self):
        return f"{self.user.username} Profile"
