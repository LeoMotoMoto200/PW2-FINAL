from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import EventoViewSet, RegisterView, EventoPDFView, CategoriaViewSet

router = DefaultRouter()
router.register(r'eventos', EventoViewSet, basename='evento')
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('eventos/<int:pk>/pdf/', EventoPDFView.as_view(), name='evento-pdf-detail'),
    path('register/', RegisterView.as_view(), name='auth_register'), # <-- ¡AÑADE ESTA LÍNEA!
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Esta es tu URL de LOGIN
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]