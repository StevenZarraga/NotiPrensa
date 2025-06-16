require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const articlesRouter = require("./routes/articles");
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRouter);
const PORT = process.env.PORT

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Conectado a MongoDB Atlas");
        app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
    })
    .catch(err => console.error("Error al conectar a MongoDB:", err));


// Modelo de artículo
const Article = require('./models/article');

app.use("/api/articles", articlesRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
