const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());

// ROOT TEST

app.get("/", (req, res) => {
  res.send("API working");
});

// AUTH ROUTES (routes folder backend ke bahar hai)
app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
