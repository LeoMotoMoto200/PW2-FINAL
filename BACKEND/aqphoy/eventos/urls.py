# backend/eventos/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventoViewSet, EventoPDFView, CategoriaViewSet, LugarViewSet, OrganizadorViewSet

router = DefaultRouter()
# Registra las rutas para /api/eventos/ y /api/categorias/
router.register(r'eventos', EventoViewSet, basename='evento')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'lugares', LugarViewSet, basename='lugar')
router.register(r'organizadores', OrganizadorViewSet, basename='organizador')

urlpatterns = [
    # Incluye las URLs generadas por el router
    path('', include(router.urls)),
    
    # Mantenemos solo las URLs que son específicas de la app "eventos"
    path('eventos/<int:pk>/pdf/', EventoPDFView.as_view(), name='evento-pdf-detail'),
]