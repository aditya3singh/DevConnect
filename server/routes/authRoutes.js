const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// @desc Register new user
router.post("/register", register);

// @desc Login user
router.post("/login", login);

module.exports = router;
