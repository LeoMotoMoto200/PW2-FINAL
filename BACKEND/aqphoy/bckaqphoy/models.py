from django.db import models
    
class Categoria(models.Model):
    nombre= models.CharField(max_length=20)
    color = models.CharField(max_length=7, default="#000000")

    def __str__(self):
            return self.nombre

class Lugar(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.TextField()
    mapa = models.URLField(blank=False, max_length=200)

class Organizador(models.Model):
    nombre = models.CharField(max_length=50)
    contacto = models.CharField(max_length=9)
    correo = models.EmailField(max_length=254)

class Evento(models.Model):
    titulo= models.CharField(max_length=100, blank=False)
    descripcion= models.TextField()
    fecha= models.DateField()
    hora= models.TimeField()
    imagen = models.ImageField(upload_to='eventos/', default='eventos/default.jpg')
    categoria = models.ManyToManyField(Categoria, verbose_name="Categorías del evento")
    lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE)
    organizador = models.ForeignKey(Organizador, verbose_name="Organizador del evento", on_delete=models.CASCADE)

    class Meta:
        ordering = ['-fecha', '-hora'] 

    def __str__(self):
            return self.titulo
