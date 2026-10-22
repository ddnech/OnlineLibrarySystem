const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

const generateToken = (user) =>
  jwt.sign({ id: user.id, roles: user.roles }, jwtSecret, { expiresIn: jwtExpiresIn });

module.exports = generateToken;
