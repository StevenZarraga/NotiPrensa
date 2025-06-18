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

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);