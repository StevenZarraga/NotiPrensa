// En: backend/server.js

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cron = require('node-cron'); // <-- 1. IMPORTAMOS NODE-CRON

// --- IMPORTAMOS LOS MODELOS QUE NECESITAREMOS PARA LA TAREA ---
const Article = require('./models/Article.js');
const Category = require('./models/Category.js');
// ---

const articlesRouter = require("./routes/articles");
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
mongoose.connect("mongodb://localhost:27017/periodico")
    .then(() => {
        console.log("Conectado a MongoDB local");
        app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor corriendo en el puerto ${PORT} y accesible en la red`);
        });
    })
    .catch(err => console.error("Error al conectar a MongoDB:", err));

app.use("/api/articles", articlesRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);


// --- INICIO DE LA NUEVA LÓGICA DE LIMPIEZA AUTOMÁTICA ---

/**
 * Esta función busca y elimina las categorías que no están siendo utilizadas por ningún artículo.
 */
const deleteOrphanedCategories = async () => {
  console.log('Ejecutando tarea de limpieza de categorías huérfanas...');
  
  try {
    // 1. Obtenemos una lista de TODOS los IDs de categorías que existen.
    const allCategories = await Category.find().select('_id');
    const allCategoryIds = allCategories.map(cat => cat._id);

    // 2. Obtenemos una lista de IDs de categorías que SÍ están en uso en los artículos.
    const usedCategoryIds = await Article.distinct('categories');

    // 3. Comparamos ambas listas para encontrar las categorías huérfanas.
    // (IDs que están en la lista total pero NO en la lista de usadas)
    const orphanedCategoryIds = allCategoryIds.filter(catId => 
      !usedCategoryIds.some(usedId => usedId.equals(catId))
    );

    if (orphanedCategoryIds.length > 0) {
      console.log(`Se encontraron ${orphanedCategoryIds.length} categorías huérfanas para eliminar.`);
      
      // 4. Eliminamos todas las categorías huérfanas de una sola vez.
      const deleteResult = await Category.deleteMany({
        '_id': { $in: orphanedCategoryIds }
      });

      console.log(`Se eliminaron ${deleteResult.deletedCount} categorías exitosamente.`);
    } else {
      console.log('No se encontraron categorías huérfanas. Todo está limpio.');
    }

  } catch (error) {
    console.error('Error durante la tarea de limpieza de categorías:', error);
  }
};

// 2. PROGRAMAMOS LA TAREA para que se ejecute todos los días a las 3:00 AM.
// La sintaxis cron '0 3 * * *' significa: Minuto 0, Hora 3, cualquier día del mes, cualquier mes, cualquier día de la semana.
cron.schedule('0 3 * * *', deleteOrphanedCategories, {
  scheduled: true,
  timezone: "America/Caracas" // Usamos la zona horaria de Venezuela
});

console.log('Tarea de limpieza de categorías programada para ejecutarse todos los días a las 3:00 AM.');

// --- FIN DE LA NUEVA LÓGICA ---