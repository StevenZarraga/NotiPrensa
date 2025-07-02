// En: backend/server.js

require('dotenv').config(); // <-- Esta línea es clave para que lea el .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cron = require('node-cron');

const Article = require('./models/Article.js');
const Category = require('./models/Category.js');

const articlesRouter = require("./routes/articles");
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

// --- INICIO DE LA MODIFICACIÓN ---

// Se reemplaza la cadena de conexión local por la variable de entorno de Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Podemos cambiar el mensaje para que sea más claro
        console.log("Conectado a la base de datos de MongoDB Atlas"); 
        app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor corriendo en el puerto ${PORT} y accesible en la red`);
        });
    })
    .catch(err => console.error("Error al conectar a MongoDB:", err));

// --- FIN DE LA MODIFICACIÓN ---


app.use("/api/articles", articlesRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);


const deleteOrphanedCategories = async () => {
  console.log('Ejecutando tarea de limpieza de categorías huérfanas...');
  
  try {
    const allCategories = await Category.find().select('_id');
    const allCategoryIds = allCategories.map(cat => cat._id);

    const usedCategoryIds = await Article.distinct('categories');

    const orphanedCategoryIds = allCategoryIds.filter(catId => 
      !usedCategoryIds.some(usedId => usedId.equals(catId))
    );

    if (orphanedCategoryIds.length > 0) {
      console.log(`Se encontraron ${orphanedCategoryIds.length} categorías huérfanas para eliminar.`);
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

cron.schedule('0 3 * * *', deleteOrphanedCategories, {
  scheduled: true,
  timezone: "America/Caracas"
});

console.log('Tarea de limpieza de categorías programada para ejecutarse todos los días a las 3:00 AM.');