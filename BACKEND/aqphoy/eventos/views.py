from rest_framework import viewsets, filters, generics, permissions
from .models import Evento
from .serializers import EventoSerializer, UserSerializer, LugarSerializer, OrganizadorSerializer
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from django.http import HttpResponse
from django.views.generic import View
from django.template.loader import get_template
from xhtml2pdf import pisa
from .permissions import IsOwnerOrReadOnly
from .models import Categoria, Lugar, Organizador  # Importa el modelo Categoria
from .serializers import CategoriaSerializer # Importa el serializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'descripcion']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    def perform_create(self, serializer):
        # Asigna automáticamente el usuario logueado como el creador
        serializer.save(creador=self.request.user)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] # Cualquiera se puede registrar
    serializer_class = UserSerializer

class LugarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lugar.objects.all()
    serializer_class = LugarSerializer
    permission_classes = [permissions.AllowAny]

class OrganizadorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Organizador.objects.all()
    serializer_class = OrganizadorSerializer
    permission_classes = [permissions.AllowAny]

class EventoPDFView(View):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        evento = Evento.objects.get(pk=pk)

        template = get_template('eventos/evento_pdf.html')
        context = {'evento': evento}
        html = template.render(context)
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="evento_{evento.id}.pdf"'

        pisa_status = pisa.CreatePDF(
           html, dest=response
        )

        if pisa_status.err:
           return HttpResponse('Ocurrió un error al generar el PDF <pre>' + html + '</pre>')
        return response
    
# Vista para ver detalles, editar o borrar un evento
class EventoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    # Aplicamos los permisos. El usuario debe estar logueado Y ser el dueño para editar/borrar.
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint que permite ver las categorías.
    No se permite crear, editar o borrar desde aquí, solo leer.
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny] # Cualquiera puede ver las categorías

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def enviar_correo(request, evento_id):
    destino = request.data.get('destinatario')

    if not destino:
        return Response({'error': 'Falta el campo destinatario'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        evento = Evento.objects.get(pk=evento_id)
    except Evento.DoesNotExist:
        return Response({'error': 'Evento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Construimos el correo con los detalles del evento
    asunto = f"Detalles del evento: {evento.titulo}"
    mensaje = f"""
            Hola,

            Aquí están los detalles del evento:

            Título: {evento.titulo}
            Descripción: {evento.descripcion}
            Fecha: {evento.fecha}
            Hora: {evento.hora}
            Lugar: {evento.lugar}

            ¡Esperamos verte allí!
            """

    try:
        send_mail(
            subject=asunto,
            message=mensaje,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[destino],
            fail_silently=False
        )
        return Response({'mensaje': f'Correo enviado con los detalles del evento {evento_id}.'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)