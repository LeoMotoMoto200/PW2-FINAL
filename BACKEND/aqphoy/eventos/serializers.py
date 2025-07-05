
from rest_framework import serializers
from .models import Categoria, Organizador, Lugar, Evento

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