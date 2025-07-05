from django.db import models

class Evento(models.Model):
    titulo= models.CharField(max_length=100, blank=False)
    descripción= models.TextField(max_length=200)
    fecha= models.DateField()
    hora= models.TimeField()
    imagen = models.ImageField()

    def __str__(self):
            return self.titulo
