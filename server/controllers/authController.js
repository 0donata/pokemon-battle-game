const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ethSigUtil = require("eth-sig-util");
const Player = require("../models/Player");

require("dotenv").config();

exports.generateNonce = async (req, res) => {
  const { address } = req.body;
  const nonce = crypto.randomBytes(16).toString("hex");

  const player = await Player.findOneAndUpdate(
    { address },
    { nonce },
    { upsert: true, new: true }
  );

  res.json({ nonce });
};

exports.login = async (req, res) => {
  const { address, signature, nonce } = req.body;

  const player = await Player.findOne({ address });
  if (!player || player.nonce !== nonce) {
    return res.status(401).json({ error: "Invalid nonce" });
  }

  const message = `Authorization: ${nonce}`;
  const recoveredAddress = ethSigUtil.recoverPersonalSignature({
    data: message,
    sig: signature,
  });

  if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const token = jwt.sign({ address }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  player.nonce = null;
  await player.save();

  res.json({ token, player });
};
