Arequipa Hoy: Tu Ciudad en un Solo Lugar
Ejemplo de la interfaz principal de la plataforma.
📖 Sobre el Proyecto
Arequipa Hoy es una plataforma web desarrollada como proyecto académico para centralizar y facilitar el acceso a los eventos locales en la ciudad de Arequipa, Perú.
El principal problema que buscamos resolver es la fragmentación de la información: los eventos se publican en grupos de Facebook, chats o afiches en la calle, lo que provoca que tanto los ciudadanos se pierdan de actividades interesantes como que los organizadores no logren el alcance deseado.
Nuestra plataforma sirve como un puente digital, creando un único punto de encuentro donde los ciudadanos pueden descubrir qué sucede en su ciudad y los organizadores pueden difundir sus actividades de manera sencilla y efectiva.
✨ Características Principales
Roles de Usuario: Diferenciación entre usuarios (pueden ver eventos) y organizadores (pueden crear y gestionar eventos).
Autenticación Segura: Implementación de registro e inicio de sesión utilizando tokens JWT (JSON Web Tokens).
Feed Centralizado de Eventos: Una página principal donde los usuarios pueden explorar todos los eventos publicados en un formato de tarjetas visuales.
Páginas de Detalle: Vistas completas para cada evento con descripción, imágenes, ubicación en Google Maps y más.
Dashboard para Organizadores: Un panel de control privado donde los organizadores pueden realizar operaciones CRUD (Crear, Leer, Actualizar y Borrar) sobre sus propios eventos.
Notificaciones por Correo: Función para que los usuarios reciban un recordatorio del evento por correo electrónico.
Exportación a PDF: Opción para descargar los detalles de un evento en un archivo PDF.
🛠️ Arquitectura y Tecnologías Utilizadas
El proyecto se construyó sobre una arquitectura desacoplada, lo que significa que el frontend y el backend son aplicaciones independientes que se comunican a través de una API REST.
Backend:
Framework: Django
API: Django REST Framework
Base de Datos: SQLite (para el prototipo)
Frontend:
Framework: Angular (desarrollado como una Single-Page Application - SPA)
Comunicación:
API REST con formato JSON.
🚀 Futuras Mejoras
El proyecto actual sienta las bases para futuras funcionalidades, entre las que se planean:
🗺️ Geolocalización para encontrar eventos cercanos a ti.
🧠 Recomendaciones personalizadas basadas en tus intereses.
🔍 Filtros avanzados de búsqueda (por fecha, categoría, etc.).
📱 Desarrollo de una aplicación móvil nativa.
👨‍💻 Autores
Este proyecto fue desarrollado por estudiantes de la Universidad Nacional de San Agustín (UNSA), Perú.
Giovanni Patrick Mejia Rondan (gmejiar@unsa.edu.pe)
German Arturo Chipana Jeronimo (gchipanaj@unsa.edu.pe)
Santiago Enrique Palma Apaza (spalmaa@unsa.edu.pe)
Leonardo Juan Jose Baca Calsin (lbacac@unsa.edu.pe)
