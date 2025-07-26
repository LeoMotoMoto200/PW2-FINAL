# eventos/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventoViewSet, 
    RegisterView,
    MyTokenObtainPairView,
    EventoPDFView, 
    CategoriaViewSet, 
    LugarViewSet, 
    OrganizadorViewSet,
    enviar_correo
)

# Creamos un router para manejar automáticamente las URLs de los ViewSets.
router = DefaultRouter()
router.register(r'eventos', EventoViewSet, basename='evento')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'lugares', LugarViewSet, basename='lugar')
router.register(r'organizadores', OrganizadorViewSet, basename='organizador')

# Tu lista de URLs, ahora con todo centralizado y ordenado.
urlpatterns = [
    # --- RUTAS DE AUTENTICACIÓN ---
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # --- RUTAS DE FUNCIONALIDADES EXTRA (LAS TUYAS) ---
    path('eventos/<int:pk>/pdf/', EventoPDFView.as_view(), name='evento-pdf-detail'),
    path('eventos/<int:evento_id>/enviar-correo/', enviar_correo, name='enviar-correo'),

    # Incluimos todas las URLs del router (CRUDs) al final.
    path('', include(router.urls)),
]