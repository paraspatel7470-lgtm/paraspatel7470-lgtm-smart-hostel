const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// TEST ROUTE (VERY IMPORTANT)
router.get("/test", (req, res) => {
  res.send("auth route working");
});

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

module.exports = router;