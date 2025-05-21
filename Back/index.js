require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./database/config");
const cookieParser = require("cookie-parser");

const path = require("path");

const __DIRNAME = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  })
);

const routes = require("./routes");

app.use(routes);

mongoose
  .connect(config.mongoDb.uri)
  .then(() => {
    console.log("Connexion Mongo DB OK");
  })
  .catch((err) => console.log(err));

app.use(express.static(path.join(__DIRNAME, "/Front/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__DIRNAME, "Front", "dist", "index.html"));
});

app.listen(3000);

// localhost:3000
