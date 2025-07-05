from django.contrib import admin
from .models import Categoria, Organizador, Lugar, Evento

admin.site.register(Categoria)
admin.site.register(Organizador)
admin.site.register(Lugar)
admin.site.register(Evento)
