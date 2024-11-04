const mongoose = require("mongoose");

const BattleSchema = new mongoose.Schema({
  playerPokemon: { type: Object, required: true },
  opponentPokemon: { type: Object, required: true },
  playerHP: { type: Number, required: true },
  opponentHP: { type: Number, required: true },
  roundNumber: { type: Number, required: true },
  log: [
    {
      message: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
  isPlayerTurn: { type: Boolean, required: true },
  battleEnded: { type: Boolean, default: false },
  winner: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Battle", BattleSchema);
