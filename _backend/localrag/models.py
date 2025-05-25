from django.db import models

# Create your models here.
from django.db import models

class SearchQuery(models.Model):
    query = models.CharField(max_length=255)
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.query
