const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://aziz:aziz1234@bestdeal.uykyh.mongodb.net/?retryWrites=true&w=majority&appName=bestdeal"
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
