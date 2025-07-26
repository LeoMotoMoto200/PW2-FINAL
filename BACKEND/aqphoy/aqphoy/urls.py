# backend/aqphoy/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Importamos las vistas necesarias
from eventos.views import MyTokenObtainPairView, RegisterView, enviar_correo
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- URLs DE AUTENTICACIÓN CENTRALIZADAS ---
    # Todas las peticiones a estas rutas se manejarán aquí directamente.
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/eventos/<int:evento_id>/enviar-correo/', enviar_correo),

    # --- URLs ESPECÍFICAS DE LA APP EVENTOS ---
    # Esto incluye /api/eventos/, /api/categorias/, etc.
    path('api/', include('eventos.urls')),
]

# Configuración para servir archivos multimedia en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)