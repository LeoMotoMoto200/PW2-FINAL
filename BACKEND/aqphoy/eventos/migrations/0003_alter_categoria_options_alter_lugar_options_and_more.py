# Generated by Django 5.2.4 on 2025-07-25 03:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0002_evento_creador_profile'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='categoria',
            options={'ordering': ['nombre'], 'verbose_name': 'Categoría', 'verbose_name_plural': 'Categorías'},
        ),
        migrations.AlterModelOptions(
            name='lugar',
            options={'ordering': ['nombre'], 'verbose_name': 'Lugar', 'verbose_name_plural': 'Lugares'},
        ),
        migrations.AlterModelOptions(
            name='organizador',
            options={'ordering': ['nombre'], 'verbose_name': 'Organizador', 'verbose_name_plural': 'Organizadores'},
        ),
        migrations.AlterField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
    ]
