import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aqphoy.settings')
django.setup()

from django.core.mail import send_mail

send_mail(
    subject='Prueba desde script',
    message='Este es un mensaje de prueba.',
    from_email='aqphoy.1@gmail.com',
    recipient_list=['peyefad329@mvpmedix.com'],
    fail_silently=False,
)
