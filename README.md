# Proyecto
Desafío técnico de backend para práctica de ing. en informática en AGS BYTE. 
Este es un proyecto que permite a los usuarios registrarse, iniciar sesión y recuperar contraseñas, utilizando Node.js, MySQL (desde xampp) y Express.

# Características
- Registro de usuarios con contraseña cifrada.
- Inicio de sesión con verificación de credenciales.
- Recuperación de contraseña para usuarios registrados.
- Actualización de contraseñas.
- Conexión a una base de datos MySQL.

# Requisitos previos
- Node.js (v16+ recomendado).
- MySQL instalado y configurado.
- XAMPP instalado.
- Dependencias instaladas mediante `npm install`.

# Instalación
1.1 Clona este repositorio:
   git clone https://github.com/vcaat/proyecto.git
2. Inicia el XAMPP y crea la base de datos:
   el nombre de la base de datos es "proyecto1"
   luego de haberla creado, ve al sql y pega el código sql que está dentro del   
   proyecto1 y ejecutala. Con esto se habrá creado la tabla para los usuarios. 
3. Navega a la carpeta del proyecto:
   cd proyecto1
4. Instala las dependencias:
   npm install express mysql2 dotenv
   npm install bcrypt jsonwebtoken body-parser
5. Configura las variables de entorno en el archivo .env si es que es necesario:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=proyecto1

# Uso
1. Inicia el servidor: node index.js
2. Abre tu navegador y accede a http://localhost:3000

# Endpoints principales:
- Registro de usuarios: POST /register
- Inicio de sesión: POST /login
- Recuperar contraseña: POST /recuperarpass
- Actualizar contraseña: POST /actualizar-password
