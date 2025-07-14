# backend/eventos/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los dueños de un objeto editarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Los permisos de lectura (GET, HEAD, OPTIONS) están permitidos para cualquiera.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Los permisos de escritura solo están permitidos para el dueño del evento.
        return obj.creador == request.user