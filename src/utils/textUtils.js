// En: src/utils/textUtils.js

export const capitalizeWords = (str) => {
  if (!str) return ''; // Devuelve un string vacío si la entrada no es válida
  return str
    .split(' ') // Divide el string en palabras
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Pone la primera letra de cada palabra en mayúscula
    .join(' '); // Vuelve a unir las palabras en un solo string
};