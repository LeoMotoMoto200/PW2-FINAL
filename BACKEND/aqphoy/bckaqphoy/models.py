from django.db import models

class Evento(models.Model):
    titulo= models.CharField(max_length=100, blank=False)
    descripción= models.TextField(max_length=200)
    fecha= models.DateField()
    hora= models.TimeField()
    imagen = models.ImageField(upload_to='eventos/', default='eventos/default.jpg')

    def __str__(self):
            return self.titulo
    
class Categoria(models.Model):
    nombre= models.TextField(max_length=20)
    color = models.CharField(max_length=7, default="#000000")

    def __str__(self):
            return self.nombre
