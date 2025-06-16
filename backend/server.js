require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Importar los enrutadores
const articlesRouter = require("./routes/articles");
const authRouter = require('./routes/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Definir el puerto
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Conectado a MongoDB Atlas");
        // Solo iniciamos el servidor si la conexión a la BD es exitosa
        app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
    })
    .catch(err => console.error("Error al conectar a MongoDB:", err));


// Usar los enrutadores para las rutas de la API
app.use("/api/articles", articlesRouter);
app.use('/api/auth', authRouter);
