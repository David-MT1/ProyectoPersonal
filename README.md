Instrucciones de Instalación y Ejecución

Sigue estos pasos en orden para poner en marcha la aplicación:

1. Clonar el Proyecto

Abre una terminal y clona el repositorio en tu máquina local:
Bash

git clone https://github.com/tu-usuario/PROYECTO-PERSONAL.git

cd PROYECTO-PERSONAL

2. Configurar la Base de Datos

Asegúrate de que tu servicio de MySQL esté activo. Luego, ejecuta el script de Python encargado de crear la base de datos y las tablas necesarias:
Bash

python crear_bd.py

Este script creará automáticamente la base de datos dchio_db y las tablas para usuarios y mensajes.
3. Iniciar el Servidor Backend

Inicia el servidor desarrollado en Python puro (server.py), el cual se encarga de gestionar las rutas y el envío de formularios de forma manual:
Bash

python server.py

4. Acceder a la Aplicación

Una vez que el servidor esté corriendo, abre tu navegador web y entra a la siguiente dirección:
http://localhost:8000


5. Estructura del Proyecto:
Basado en la organización de archivos implementada:

  Frontend: * index.html: Página principal con la carta y buscador dinámico.
              promociones.html: Sección de ofertas con efectos de scrol
              pedido.html: Gestión de carrito y confirmación.
              terminosYcondiciones.html: Marco legal del sitio.
              styles.css: Estilos personalizados y diseño responsivo.
              
  JavaScript: * scriptDchio.js: Lógica global y manejo del carrito de compras.
              index.js, promociones.js, pedido.js: Lógica específica para cada sección.

  Backend: * server.py: Servidor HTTP manual y manejo de peticiones.
              crear_bd.py: Script de configuración inicial de MySQL.

  Datos: * productos.json y promociones.json: Bases de datos locales para carga dinámica.
