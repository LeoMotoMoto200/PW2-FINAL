# backend/eventos/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

# Importa tus modelos
from .models import Categoria, Organizador, Lugar, Evento, Profile

# --- CLASE PARA MOSTRAR EL PERFIL DENTRO DEL USUARIO ---
# Esto te permite editar el rol del usuario directamente en la página de edición del usuario.
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'perfiles'

# --- DEFINE UN NUEVO USER ADMIN ---
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    # Añade 'get_rol' a la lista para ver el rol en la tabla de usuarios
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_rol')

    @admin.display(description='Rol')
    def get_rol(self, obj):
        try:
            return obj.profile.get_rol_display() # .get_rol_display() muestra el texto legible
        except Profile.DoesNotExist:
            return "Sin perfil"

# Vuelve a registrar el modelo User con tu UserAdmin personalizado
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


# Registra tus otros modelos como ya los tenías
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'color')

@admin.register(Organizador)
class OrganizadorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'contacto')

@admin.register(Lugar)
class LugarAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion')

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'fecha', 'categoria', 'creador')
    list_filter = ('fecha', 'categoria', 'creador')