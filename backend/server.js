require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const articlesRouter = require("./routes/articles");
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT= 5000;
mongoose.connect("mongodb://localhost:27017/periodico")
    .then(() => {
        console.log("Conectado a MongoDB local");
        app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
    })
    .catch(err => console.error("Error al conectar a MongoDB:", err));

app.use("/api/articles", articlesRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
