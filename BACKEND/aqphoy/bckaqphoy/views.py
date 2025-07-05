from rest_framework import viewsets, filters
from .models import Evento
from .serializers import EventoSerializer

from django.http import HttpResponse
from django.views.generic import View
from django.template.loader import get_template
from xhtml2pdf import pisa


class EventoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint que permite ver y listar eventos.
    Soporta filtros por:
    - ?categoria__nombre=Musical
    - ?fecha=2024-12-31
    - ?search=concierto
    """
    queryset = Evento.objects.all().select_related('categoria', 'organizador', 'lugar')
    serializer_class = EventoSerializer
    
    filterset_fields = {
        'fecha': ['exact', 'gte', 'lte'], 
        'categoria__nombre': ['exact', 'icontains'],
    }
    search_fields = ['titulo', 'descripcion', 'lugar__nombre', 'organizador__nombre']
    filter_backends = (filters.SearchFilter, 'django_filters.rest_framework.DjangoFilterBackend')


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