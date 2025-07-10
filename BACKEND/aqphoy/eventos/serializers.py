
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Categoria, Organizador, Lugar, Evento

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}} # Para que no devuelva el hash del password

    def create(self, validated_data):
        # Usamos create_user para que el password se guarde hasheado y no en texto plano
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
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
    categoria = CategoriaSerializer(read_only=True)
    organizador = OrganizadorSerializer(read_only=True)
    lugar = LugarSerializer(read_only=True)

    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )
    organizador_id = serializers.PrimaryKeyRelatedField(
        queryset=Organizador.objects.all(), source='organizador', write_only=True, required=False
    )
    lugar_id = serializers.PrimaryKeyRelatedField(
        queryset=Lugar.objects.all(), source='lugar', write_only=True, required=False
    )

    class Meta:
        model = Evento
        fields = [
            'id', 'titulo', 'descripcion', 'fecha', 'hora', 'imagen',
            'categoria', 'organizador', 'lugar', 
            'categoria_id', 'organizador_id', 'lugar_id' 
        ]