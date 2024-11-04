const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String,
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    "Sp. Attack": Number,
    "Sp. Defense": Number,
    Speed: Number,
  },
  species: String,
  description: String,
  evolution: {
    next: [[String, String]],
  },
  profile: {
    height: String,
    weight: String,
    egg: [String],
    ability: [[String, String]],
    gender: String,
  },
  image: {
    sprite: String,
    thumbnail: String,
    hires: String,
  },
});

module.exports = mongoose.model("Pokemon", pokemonSchema);
