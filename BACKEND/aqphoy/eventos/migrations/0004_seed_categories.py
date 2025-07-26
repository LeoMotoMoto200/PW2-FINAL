# events/migrations/0003_seed_categories.py

from django.db import migrations

# --- LA LISTA DE NUESTRAS CATEGORÍAS Y COLORES ---
# ¡Aquí puedes añadir, quitar o modificar las que quieras!
# Usa una página como https://htmlcolorcodes.com/ para encontrar colores "guay".
CATEGORIAS_A_CREAR = [
    {"nombre": "Música", "color": "#E74C3C"},      # Rojo
    {"nombre": "Deporte", "color": "#3498DB"},     # Azul
    {"nombre": "Comida", "color": "#F1C40F"},      # Amarillo
    {"nombre": "Arte y Cultura", "color": "#9B59B6"}, # Morado
    {"nombre": "Tecnología", "color": "#1ABC9C"},   # Turquesa
    {"nombre": "Cine", "color": "#34495E"},      # Gris oscuro
    {"nombre": "Baile", "color": "#E91E63"},      # Rosa
]

# --- LA FUNCIÓN QUE METE LOS DATOS ---
def seed_data(apps, schema_editor):
    # Obtenemos el modelo 'Categoria' de la forma correcta para las migraciones.
    # ¡No se puede importar directamente el modelo!
    Categoria = apps.get_model('eventos', 'Categoria')

    # Iteramos sobre nuestra lista
    for cat_data in CATEGORIAS_A_CREAR:
        # Usamos update_or_create:
        # - Si ya existe una categoría con ese nombre, solo actualiza el color.
        # - Si no existe, la crea con el nombre y el color.
        # ¡Esto evita crear duplicados si corres la migración varias veces!
        Categoria.objects.update_or_create(
            nombre=cat_data["nombre"], 
            defaults={'color': cat_data["color"]}
        )

# --- LA CLASE DE LA MIGRACIÓN ---
class Migration(migrations.Migration):

    # Le decimos a Django de qué migración venimos
    dependencies = [
        ('eventos', '0003_alter_categoria_options_alter_lugar_options_and_more'), # <-- ¡IMPORTANTE! Cambia esto por el nombre de tu migración anterior
    ]

    operations = [
        # Aquí le decimos a Django que ejecute nuestra función 'seed_data'
        migrations.RunPython(seed_data),
    ]