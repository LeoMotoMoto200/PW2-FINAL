from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    color = models.CharField(max_length=7, default="#007bff", help_text="Color en formato hexadecimal (ej. #FF5733)")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

class Organizador(models.Model):
    nombre = models.CharField(max_length=200, verbose_name="Nombre del Organizador")
    contacto = models.EmailField(blank=True, null=True, verbose_name="Correo de Contacto")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Organizador"
        verbose_name_plural = "Organizadores"

class Lugar(models.Model):
    nombre = models.CharField(max_length=200, verbose_name="Nombre del Lugar")
    direccion = models.CharField(max_length=255, verbose_name="Dirección")
    mapa_url = models.URLField(blank=True, null=True, help_text="URL de Google Maps u otro servicio")

    def __str__(self):
        return f"{self.nombre} ({self.direccion})"

    class Meta:
        verbose_name = "Lugar"
        verbose_name_plural = "Lugares"

class Evento(models.Model):
    titulo = models.CharField(max_length=200, verbose_name="Título del Evento")
    descripcion = models.TextField(verbose_name="Descripción")
    fecha = models.DateField(verbose_name="Fecha del Evento")
    hora = models.TimeField(verbose_name="Hora del Evento")
    imagen = models.ImageField(upload_to='eventos_imagenes/', blank=True, null=True, verbose_name="Imagen o Afiche")
    
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name="eventos")
    organizador = models.ForeignKey(Organizador, on_delete=models.SET_NULL, null=True, blank=True, related_name="eventos")
    lugar = models.ForeignKey(Lugar, on_delete=models.SET_NULL, null=True, blank=True, related_name="eventos")

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.titulo} - {self.fecha.strftime('%d/%m/%Y')}"

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['-fecha', '-hora'] 