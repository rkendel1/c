from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SearchQueryViewSet

router = DefaultRouter()
router.register(r'search', SearchQueryViewSet, basename='searchquery')

urlpatterns = [
    path('', include(router.urls)),
]
