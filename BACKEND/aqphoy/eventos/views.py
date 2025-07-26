# eventos/views.py

from django.conf import settings
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.template.loader import get_template
from django.views.generic import View
from django.core.mail import send_mail

from rest_framework import viewsets, generics, permissions, status, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend

from .models import Evento, Categoria, Lugar, Organizador
from .serializers import (
    EventoSerializer, UserSerializer, CategoriaSerializer, 
    LugarSerializer, OrganizadorSerializer, MyTokenObtainPairSerializer
)
from .permissions import IsOwnerOrReadOnly
from xhtml2pdf import pisa


# --- Vistas para los modelos de apoyo (solo lectura) ---
class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint para listar todas las categorías disponibles."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]

class LugarViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint para listar todos los lugares disponibles."""
    queryset = Lugar.objects.all()
    serializer_class = LugarSerializer
    permission_classes = [permissions.AllowAny]

class OrganizadorViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint para listar todos los organizadores disponibles."""
    queryset = Organizador.objects.all()
    serializer_class = OrganizadorSerializer
    permission_classes = [permissions.AllowAny]

# --- Vista principal para el CRUD de Eventos ---
class EventoViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet completo para ver y editar eventos.
    Maneja GET (lista y detalle), POST, PUT, y DELETE.
    """
    queryset = Evento.objects.all().select_related('categoria', 'lugar', 'organizador', 'creador')
    serializer_class = EventoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    # --- Filtros Potenciados ---
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'lugar', 'organizador']
    search_fields = ['titulo', 'descripcion']
    ordering_fields = ['fecha', 'creado_en', 'titulo']

    def perform_create(self, serializer):
        """Asigna automáticamente el usuario logueado como el creador del evento."""
        serializer.save(creador=self.request.user)


# --- Vistas de Autenticación ---
class RegisterView(generics.CreateAPIView):
    """Endpoint para registrar nuevos usuarios."""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    """Endpoint para el login, devuelve un token con datos extra (rol)."""
    serializer_class = MyTokenObtainPairSerializer


# --- Vistas de Funcionalidades Extra (Conservadas) ---
class EventoPDFView(View):
    """Genera un PDF con los detalles de un evento específico."""
    def get(self, request, *args, **kwargs):
        try:
            pk = self.kwargs.get('pk')
            evento = Evento.objects.get(pk=pk)
        except Evento.DoesNotExist:
            return HttpResponse("Evento no encontrado.", status=404)

        template = get_template('eventos/evento_pdf.html') # Asegúrate que este sea el nombre de tu template
        context = {'evento': evento}
        html = template.render(context)
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="evento_{evento.id}_{evento.titulo}.pdf"'

        pisa_status = pisa.CreatePDF(html, dest=response)

        if pisa_status.err:
           return HttpResponse(f'Ocurrió un error al generar el PDF: <pre>{html}</pre>')
        return response

@api_view(['POST'])
def enviar_correo_evento(request, evento_id):
    """
    Endpoint para enviar los detalles de un evento por correo electrónico.
    Espera un JSON con: {"destinatario": "correo@ejemplo.com"}
    """
    destinatario = request.data.get('destinatario')

    if not destinatario:
        return Response({'error': 'Falta el campo "destinatario"'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        evento = Evento.objects.get(pk=evento_id)
    except Evento.DoesNotExist:
        return Response({'error': 'Evento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    asunto = f"Invitación al evento: {evento.titulo}"
    mensaje = f"""
    Hola,

    Estás invitado al siguiente evento:

    Título: {evento.titulo}
    Descripción: {evento.descripcion}
    Fecha: {evento.fecha.strftime('%d de %B de %Y')}
    Hora: {evento.hora.strftime('%I:%M %p')}
    Lugar: {evento.lugar.nombre if evento.lugar else 'Por confirmar'}
    Dirección: {evento.lugar.direccion if evento.lugar else 'Por confirmar'}

    ¡Esperamos verte allí!
    El equipo de {evento.organizador.nombre if evento.organizador else 'Arequipa Hoy'}
    """
    remitente = settings.EMAIL_HOST_USER

    try:
        send_mail(
            subject=asunto,
            message=mensaje,
            from_email=remitente,
            recipient_list=[destinatario],
            fail_silently=False,
        )
        return Response({'mensaje': f'Correo sobre el evento "{evento.titulo}" enviado a {destinatario}.'})
    except Exception as e:
        return Response({'error': f'Error al enviar el correo: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)