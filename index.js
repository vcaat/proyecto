const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Para el envío de correos
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto si tu usuario es diferente
    password: '', // Añade tu contraseña si la tienes
    database: 'proyecto1',
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Endpoint: Registrar usuario
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'El correo ya está registrado' });
                    }
                    return res.status(500).json({ error: 'Error al registrar usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado con éxito' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Endpoint: Iniciar sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Verifica que el correo y la contraseña estén presentes
    if (!email || !password) {
        return res.status(400).send('Correo y contraseña son requeridos');
    }

    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).send('Error en la base de datos');
        }

        if (user.length > 0) {
            // Comparar la contraseña con el valor hash almacenado
            const isPasswordValid = await bcrypt.compare(password, user[0].password); // Usar compare async
            if (isPasswordValid) {
                // Si la contraseña es válida, se puede generar un token JWT o redirigir al usuario
                return res.send('Iniciado sesión con éxito');
            } else {
                // Contraseña incorrecta
                return res.status(401).send('Contraseña incorrecta');
            }
        } else {
            // Usuario no encontrado
            return res.status(404).send('Correo no registrado');
        }
    });
});

// Endpoint: Recuperar contraseña
app.post('/recuperarpass', async (req, res) => {
    const { email } = req.body;

    // Verificamos que el correo esté presente
    if (!email) {
        return res.status(400).send('Correo electrónico es requerido');
    }

    // Consultamos si el correo existe en la base de datos
    connection.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email], (err, user) => {
        if (err) return res.status(500).send('Error en la base de datos');

        if (user.length > 0) {
            // Si el correo está registrado, respondemos con un mensaje de éxito
            return res.send({ message: 'Correo encontrado', success: true });
        } else {
            // Si el correo no está registrado
            return res.status(404).send('Correo no registrado');
        }
    });
});

// Endpoint: Actualizar contraseña
app.post('/actualizar-password', async (req, res) => {
    const { email, newPassword, repeatPassword } = req.body;

    // Verificamos que las contraseñas coincidan
    if (newPassword !== repeatPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Ciframos la nueva contraseña
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Actualizamos la contraseña en la base de datos
    connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (result.affectedRows > 0) {
            return res.json({ success: true, message: 'Contraseña actualizada correctamente' });
        } else {
            return res.status(404).json({ error: 'No se pudo actualizar la contraseña' });
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
