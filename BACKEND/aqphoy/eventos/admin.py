from django.contrib import admin
from .models import Categoria, Organizador, Lugar, Evento

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'color')
    search_fields = ('nombre',) 

@admin.register(Organizador)
class OrganizadorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'contacto')
    search_fields = ('nombre',)

@admin.register(Lugar)
class LugarAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion')
    search_fields = ('nombre', 'direccion')

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'fecha', 'hora', 'lugar')
    list_filter = ('categoria', 'fecha', 'lugar')
    search_fields = ('titulo', 'descripcion', 'lugar__nombre', 'organizador__nombre')
    date_hierarchy = 'fecha'
    autocomplete_fields = ['categoria', 'organizador', 'lugar']