from django.db import models
    
class Categoria(models.Model):
    nombre= models.CharField(max_length=20)
    color = models.CharField(max_length=7, default="#000000")

    def __str__(self):
            return self.nombre

class Evento(models.Model):
    titulo= models.CharField(max_length=100, blank=False)
    descripcion= models.TextField()
    fecha= models.DateField()
    hora= models.TimeField()
    imagen = models.ImageField(upload_to='eventos/', default='eventos/default.jpg')
    categoria = models.ManyToManyField(Categoria, verbose_name="Categorías del evento")

    class Meta:
        ordering = ['-fecha', '-hora'] 

    def __str__(self):
            return self.titulo
    
