const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Error de autenticación de token', error);
      return res.status(401).json({ message: 'No autorizado, el token falló.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró un token.' });
  }
};

module.exports = { protect };