const bcrypt = require("bcrypt");
const db = require("../models");
const generateToken = require("../utils/generateToken");
const Mailer = require("../utils/mailer");

module.exports = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await db.User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = generateToken(user);
      return res.json({
        message: "Login successful",
        roles:user.roles,
        token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async registerUser(req, res) {
    const { username, email, address, password, fullName } = req.body;

    const t = await db.sequelize.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await db.User.create(
        {
          username,
          roles: "user",
          email,
          address,
          password: hashPassword,
          fullName,
        },
        { transaction: t }
      );
      
      await t.commit();

      const message = "You have registered an account";
      const mailing = {
        recipient_email: email,
        subject: "Register ACCOUNT",
        receiver: username,
        message,
      };

      try {
        const emailResponse = await Mailer.sendEmail(mailing);
        return res.status(201).json({
          message: `${emailResponse.message}, registration ${newUser.username} successful`,
          data: {
            username: newUser.username,
            roles: newUser.roles,
          },
        });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Internal server error",
        errors: error.message,
      });
    }
  },
};
