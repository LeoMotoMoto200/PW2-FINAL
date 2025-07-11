
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Categoria, Organizador, Lugar, Evento
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    # Añadimos un campo para recibir el rol desde el frontend.
    # No es un campo del modelo User, así que es de solo escritura y no se mapea.
    rol = serializers.CharField(write_only=True, required=False, default='normal')

    class Meta:
        model = User
        # Añadimos 'rol' a la lista de campos que el serializer conoce
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'rol']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Sacamos el rol de los datos validados antes de crear el usuario
        rol_data = validated_data.pop('rol', 'normal')
        
        # Creamos el usuario como antes
        user = User.objects.create_user(**validated_data)
        
        # Asignamos el rol al perfil del usuario
        # El perfil se crea automáticamente gracias a la señal que ya tienes
        user.profile.rol = rol_data
        user.profile.save()
        
        return user

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class OrganizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizador
        fields = '__all__'

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Evento.
    Maneja la lectura y escritura de datos de eventos.
    """

    # --- CAMPOS PARA LECTURA (GET) ---
    # Cuando se pide un evento, estos campos mostrarán los objetos completos.
    categoria = CategoriaSerializer(read_only=True)
    organizador = OrganizadorSerializer(read_only=True)
    lugar = LugarSerializer(read_only=True)
    # Mostramos el nombre de usuario del creador, no su ID.
    creador = serializers.ReadOnlyField(source='creador.username')

    # --- CAMPOS PARA ESCRITURA (POST/PUT) ---
    # Cuando se crea/edita un evento, el frontend debe enviar los IDs en estos campos.
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )
    organizador_id = serializers.PrimaryKeyRelatedField(
        queryset=Organizador.objects.all(), source='organizador', write_only=True, required=False, allow_null=True
    )
    lugar_id = serializers.PrimaryKeyRelatedField(
        queryset=Lugar.objects.all(), source='lugar', write_only=True, required=False, allow_null=True
    )

    # --- LA CLASE 'META' OBLIGATORIA ---
    # Asegúrate de que esta clase esté indentada un nivel dentro de EventoSerializer.
    class Meta:
        model = Evento
        # Lista de todos los campos que el serializer va a gestionar.
        fields = [
            'id', 'titulo', 'descripcion', 'fecha', 'hora', 'imagen',
            'categoria', 'organizador', 'lugar', 'creador',
            'categoria_id', 'organizador_id', 'lugar_id'
        ]
        # Hacemos que 'creador' sea de solo lectura en el serializer,
        # ya que se asigna automáticamente en la vista (con perform_create).
        read_only_fields = ['creador']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        
        try:
            # --- INTENTA OBTENER EL ROL DEL PERFIL ---
            print(f"Usuario: {user.username}, Perfil encontrado: {user.profile}, Rol: {user.profile.rol}")
            token['rol'] = user.profile.rol 
        except user._meta.model.profile.RelatedObjectDoesNotExist:
            # --- SI FALLA, ASIGNA 'normal' POR DEFECTO ---
            print(f"Usuario: {user.username} NO tiene perfil. Asignando rol 'normal' por defecto.")
            token['rol'] = 'normal'

        return token