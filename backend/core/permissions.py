from rest_framework import permissions

class IsSelfOrAdmin(permissions.BasePermission):
    """
    Allows access only to the user themselves or admins.
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user