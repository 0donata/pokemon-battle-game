const express = require("express");
const router = express.Router();
const {
  startBattle,
  getBattle,
  processTurn,
  surrender,
} = require("../controllers/battleController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/start-battle", authMiddleware, startBattle);
router.post("/process-turn", authMiddleware, processTurn);
router.get("/battle/:id", authMiddleware, getBattle);
router.post("/surrender", authMiddleware, surrender);

module.exports = router;
