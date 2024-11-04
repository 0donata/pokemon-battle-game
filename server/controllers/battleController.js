const Pokemon = require("../models/Pokemon");
const Battle = require("../models/Battle");

const calculateDamage = (attacker, defender) => {
  const level = 20;
  const power = 20;
  const randomFactor = Math.random();
  if (randomFactor === 0) return 0;

  const damage =
    ((((2 * level) / 5 + 2) * power * (attacker.Attack / defender.Defense)) /
      50 +
      2) *
    randomFactor;
  return Math.floor(damage);
};

const startBattle = async (req, res) => {
  try {
    const { playerPokemon } = req.body;

    const typeCounters = {
      Fire: ["Water", "Rock"],
      Grass: ["Fire", "Flying"],
      Water: ["Electric", "Grass"],
    };
    const counterTypes = typeCounters[playerPokemon.type[0]] || [];

    let opponentPokemon;
    if (counterTypes.length > 0) {
      opponentPokemon = await Pokemon.aggregate([
        { $match: { type: { $in: counterTypes } } },
        { $sample: { size: 1 } },
      ]);
    }

    if (!opponentPokemon || opponentPokemon.length === 0) {
      opponentPokemon = await Pokemon.aggregate([{ $sample: { size: 1 } }]);
    }

    const battle = new Battle({
      playerPokemon,
      opponentPokemon: opponentPokemon[0],
      playerHP: playerPokemon.base.HP,
      opponentHP: opponentPokemon[0].base.HP,
      roundNumber: 1,
      log: [],
      isPlayerTurn: playerPokemon.base.Speed >= opponentPokemon[0].base.Speed,
    });
    await battle.save();

    res.json(battle);
  } catch (error) {
    console.error("Battle initiation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBattle = async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }
    res.json(battle);
  } catch (error) {
    console.error("Battle recovery error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const processTurn = async (req, res) => {
  const { battleId, isPlayerTurn } = req.body;

  try {
    const battle = await Battle.findById(battleId);
    if (!battle || battle.battleEnded) {
      return res
        .status(404)
        .json({ message: "Battle not found or already completed" });
    }

    const { playerPokemon, opponentPokemon } = battle;
    let newPlayerHP = battle.playerHP;
    let newOpponentHP = battle.opponentHP;
    let newLog = [...battle.log];
    let winner = null;

    if (isPlayerTurn) {
      const playerDamage = calculateDamage(
        playerPokemon.base,
        opponentPokemon.base
      );
      newOpponentHP = Math.max(0, battle.opponentHP - playerDamage);
      newLog.push({
        message: `Round ${battle.roundNumber}: ${playerPokemon.name.english} deals ${playerDamage} damage to ${opponentPokemon.name.english}`,
        color: "green",
      });

      if (newOpponentHP <= 0) {
        battle.battleEnded = true;
        winner = playerPokemon.name.english;
        newLog.push({ message: `${winner} won!`, color: "green" });
      }
    } else {
      const opponentDamage = calculateDamage(
        opponentPokemon.base,
        playerPokemon.base
      );
      newPlayerHP = Math.max(0, battle.playerHP - opponentDamage);
      newLog.push({
        message: `Round ${battle.roundNumber}: ${opponentPokemon.name.english} deals ${opponentDamage} damage to ${playerPokemon.name.english}`,
        color: "red",
      });

      if (newPlayerHP <= 0) {
        battle.battleEnded = true;
        winner = opponentPokemon.name.english;
        newLog.push({ message: `${winner} won!`, color: "red" });
      }
    }

    // Update the battle state
    battle.playerHP = newPlayerHP;
    battle.opponentHP = newOpponentHP;
    battle.log = newLog;
    battle.roundNumber += isPlayerTurn ? 0 : 1;
    battle.isPlayerTurn = !isPlayerTurn;
    battle.winner = winner;
    await battle.save();

    res.json(battle);
  } catch (error) {
    console.error("Move processing error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const surrender = async (req, res) => {
  try {
    const { battleId } = req.body;
    const battle = await Battle.findById(battleId);
    if (!battle || battle.battleEnded) {
      return res
        .status(404)
        .json({ message: "Battle not found or already completed" });
    }

    battle.battleEnded = true;
    battle.winner = battle.opponentPokemon.name.english;
    await battle.save();

    res.json({ message: "You have surrendered, the battle is over" });
  } catch (error) {
    console.error("Surrendered error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  startBattle,
  getBattle,
  processTurn,
  surrender,
};
