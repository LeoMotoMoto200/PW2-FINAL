from rest_framework import viewsets, filters, generics, permissions
from .models import Evento
from .serializers import EventoSerializer, UserSerializer
from django.contrib.auth.models import User

from django.http import HttpResponse
from django.views.generic import View
from django.template.loader import get_template
from xhtml2pdf import pisa
from .permissions import IsOwnerOrReadOnly
from .models import Categoria  # Importa el modelo Categoria
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