# eventos/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Evento, Categoria, Lugar, Organizador, Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- Serializers para los modelos de apoyo (Estos están perfectos) ---
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'color']

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = ['id', 'nombre', 'direccion', 'mapa_url']

class OrganizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizador
        fields = ['id', 'nombre', 'contacto']

# --- Serializer de Usuario para el Registro (Mejorado) ---
class UserSerializer(serializers.ModelSerializer):
    # 1. Añadimos un campo 'rol' que no está en el modelo User, pero que recibiremos del frontend.
    rol = serializers.CharField(write_only=True, required=False, default='normal')

    class Meta:
            model = User
            # 2. Añadimos 'rol' a la lista de campos que este serializer entiende.
            fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'rol']
            extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
            # Sacamos el 'rol' que nos envió el frontend. Si no vino, usamos 'normal'.
            user_rol = validated_data.pop('rol', 'normal')
            
            # Creamos el usuario con el resto de los datos.
            user = User.objects.create_user(**validated_data)
            
            # Asignamos el rol correcto al perfil del usuario.
            try:
                user.profile.rol = user_rol
                user.profile.save()
            except Profile.DoesNotExist:
                Profile.objects.create(user=user, rol=user_rol)
                
            return user

# --- Serializer Principal de Eventos (¡LA GRAN MEJORA!) ---
class EventoSerializer(serializers.ModelSerializer):
    # CAMBIO #1: Para LEER datos (GET), mostramos la info completa de los objetos relacionados.
    # Usamos los serializers que definimos arriba. El 'source' apunta al campo del modelo.
    categoria_info = CategoriaSerializer(source='categoria', read_only=True)
    lugar_info = LugarSerializer(source='lugar', read_only=True)
    organizador_info = OrganizadorSerializer(source='organizador', read_only=True)
    creador = serializers.ReadOnlyField(source='creador.username')

    class Meta:
        model = Evento
        # CAMBIO #2: La lista de campos ahora es más limpia.
        # Incluimos los campos del modelo Y nuestros campos '_info' de solo lectura.
        fields = [
            'id', 'titulo', 'descripcion', 'fecha', 'hora', 'imagen', 
            'categoria',      # Este campo ahora es para ESCRITURA (espera un ID)
            'lugar',          # Este campo ahora es para ESCRITURA (espera un ID)
            'organizador',    # Este campo ahora es para ESCRITURA (espera un ID)
            'categoria_info', # Este campo es para LECTURA (devuelve el objeto)
            'lugar_info',     # Este campo es para LECTURA (devuelve el objeto)
            'organizador_info',# Este campo es para LECTURA (devuelve el objeto)
            'creador', 
            'creado_en', 
            'actualizado_en'
        ]

        # CAMBIO #3: Le decimos a DRF que los campos 'categoria', 'lugar' y 'organizador'
        # son de solo escritura en el contexto de este serializer.
        # Esto evita que intente mostrarlos como IDs al leer, ya que para eso tenemos los campos '_info'.
        extra_kwargs = {
            'categoria': {'write_only': True},
            'lugar': {'write_only': True},
            'organizador': {'write_only': True},
        }

# --- Serializer para el Token de Login (¡Mejorado y más seguro!) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadimos datos personalizados al payload del token
        token['username'] = user.username
        try:
            # Usamos el related_name 'profile' que definimos en el models.py
            token['rol'] = user.profile.rol
        except Profile.DoesNotExist:
            # Si por alguna razón el perfil no existe, asignamos un rol por defecto.
            token['rol'] = 'normal'
            
        return token