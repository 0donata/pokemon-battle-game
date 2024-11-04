const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getPokemons } = require("../controllers/pokemonController");

router.get("/pokemons", authMiddleware, getPokemons);

module.exports = router;
