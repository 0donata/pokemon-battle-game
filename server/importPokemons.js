const mongoose = require("mongoose");
const fs = require("fs");
const Pokemon = require("./models/Pokemon");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const pokemonData = JSON.parse(
  fs.readFileSync("D:/Work/pokedex.json", "utf-8")
);

const importData = async () => {
  try {
    await Pokemon.deleteMany();
    console.log("Old data is deleted");

    await Pokemon.insertMany(pokemonData);
    console.log("Pokemon data loaded");

    process.exit();
  } catch (error) {
    console.error("Error loading data:", error);
    process.exit(1);
  }
};

importData();
