const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");


mongoose.connect("mongodb+srv://bhargi:bhargi123@cluster0-wwuet.mongodb.net/mean-crud")
  .then(() => {
    console.log("Connected To DATABASE");
  })
  .catch(() => {
    console.log("FAILUR");

  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})

app.use("/api/users", userRoutes);

module.exports = app;
