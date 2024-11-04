const express = require("express");
const router = express.Router();
const { generateNonce, login } = require("../controllers/authController");

router.post("/nonce", generateNonce);
router.post("/login", login);

module.exports = router;
