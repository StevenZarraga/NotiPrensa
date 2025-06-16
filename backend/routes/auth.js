// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importamos nuestro modelo de User

// ==========================================================
// RUTA DE REGISTRO DE USUARIOS
// Petición tipo: POST /api/auth/register
// ==========================================================
router.post('/register', async (req, res) => {
  try {
    // 1. Ahora también extraemos la clave de registro del cuerpo de la petición
    const { username, password, registrationKey } = req.body;

    // 2. AÑADIMOS LA VALIDACIÓN DE LA CLAVE SECRETA
    // Compara la clave enviada con la que guardamos en el archivo .env
    if (registrationKey !== process.env.REGISTRATION_SECRET) {
      return res.status(403).json({ message: 'Clave de registro de administrador incorrecta.' });
    }

    // El resto de la lógica es la misma de antes...
    if (!username || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona un nombre de usuario y una contraseña.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
    }

    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar el usuario.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Buscamos al usuario en la base de datos por su nombre de usuario
    const user = await User.findOne({ username });

    // 2. Verificamos si el usuario existe Y si la contraseña coincide
    //    Usamos el método que acabamos de crear en el modelo: user.matchPassword()
    if (!user || !(await user.matchPassword(password))) {
      // Es importante dar un mensaje genérico para no revelar si el usuario existe o no
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // 3. Si las credenciales son correctas, creamos un nuevo token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Enviamos la respuesta exitosa con el nuevo token
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});


module.exports = router;