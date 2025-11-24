from rest_framework.permissions import BasePermission
from accounts.models import User

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Roles.ADMIN)

class IsProfesor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Roles.PROFESOR)
