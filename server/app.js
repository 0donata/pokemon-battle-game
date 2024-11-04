const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./routes/auth");
const pokemonRoutes = require("./routes/pokemon");
const gameRoutes = require("./routes/game");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api", pokemonRoutes);
app.use("/api", gameRoutes);

app.use(cors());
app.use(express.json());

module.exports = app;
