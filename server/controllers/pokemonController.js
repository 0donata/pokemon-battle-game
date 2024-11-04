const Pokemon = require("../models/Pokemon");

exports.getPokemons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalPokemons = await Pokemon.countDocuments();
    const pokemons = await Pokemon.find().skip(skip).limit(limit);

    res.json({
      data: pokemons,
      currentPage: page,
      totalPages: Math.ceil(totalPokemons / limit),
    });
  } catch (error) {
    console.error("Error getting Pokemon:", error);
    res.status(500).json({ message: "Server error" });
  }
};
