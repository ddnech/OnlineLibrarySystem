const bcrypt = require("bcrypt");
const db = require("../models");
const generateToken = require("../utils/generateToken");

module.exports = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await db.User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const accessToken = generateToken(user);
      return res.json({
        message: "Login successful",
        user,
        accessToken,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },


};
