from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventoViewSet, EventoPDFView

router = DefaultRouter()
router.register(r'eventos', EventoViewSet, basename='evento')

urlpatterns = [
    path('', include(router.urls)),
    path('eventos/<int:pk>/pdf/', EventoPDFView.as_view(), name='evento-pdf-detail'),
]