const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb://localhost:27017/test" // Remplacez par votre URL de connexion MongoDB locale
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.error("Erreur de connexion à MongoDB :", error));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
