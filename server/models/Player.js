const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  nonce: { type: String },
});

module.exports = mongoose.model("Player", playerSchema);
