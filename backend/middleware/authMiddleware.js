// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Verificamos si el header de autorización existe y empieza con "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extraemos el token del header (ej: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificamos el token con nuestra clave secreta para ver si es válido y no ha expirado
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Si es válido, buscamos al usuario por el ID que está dentro del token
      // y lo adjuntamos al objeto `req` para que esté disponible en las rutas protegidas
      req.user = await User.findById(decoded.id).select('-password'); // .select('-password') evita que se traiga el hash de la contraseña

      next(); // Si todo va bien, llamamos a next() para que la petición continúe a su destino
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