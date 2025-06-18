const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==========================================================
// RUTA DE REGISTRO DE USUARIOS
// Petición tipo: POST /api/auth/register
// ==========================================================
router.post('/register', async (req, res) => {
  try {
    const { username, password, registrationKey } = req.body;

    if (registrationKey !== process.env.REGISTRATION_SECRET) {
      return res.status(403).json({ message: 'Clave de registro de administrador incorrecta.' });
    }

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

    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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