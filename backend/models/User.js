// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Por favor, introduce un nombre de usuario'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Por favor, introduce una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  }
});

// Middleware para encriptar la contraseña ANTES de guardar
UserSchema.pre('save', async function(next) {
  // Solo encriptamos si la contraseña es nueva o ha sido modificada
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ==========================================================
// **LA PARTE CLAVE A CORREGIR**
// Añadimos el método para comparar contraseñas a las instancias del modelo.
// Es "methods" (en plural), no "method". Este es un error común.
// ==========================================================
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Exportamos el modelo
module.exports = mongoose.model('User', UserSchema);