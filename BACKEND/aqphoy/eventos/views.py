from rest_framework import viewsets, filters
from .models import Evento
from .serializers import EventoSerializer

from django.http import HttpResponse
from django.views.generic import View
from django.template.loader import get_template
from xhtml2pdf import pisa


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'descripcion']

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