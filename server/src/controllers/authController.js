const bcrypt = require("bcryptjs");
const db = require("../models");
const generateToken = require("../utils/generateToken");
const { sendEmail } = require("../utils/mailer");

const publicUser = (user) => ({
  id: user.id,
  username: user.username,
  fullName: user.fullName,
  email: user.email,
  roles: user.roles,
});

module.exports = {
  async login(req, res) {
    const { username, password } = req.body;
    const user = await db.User.findOne({ where: { username } });

    // Same message for both cases, so nobody can probe which usernames exist.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Wrong username or password." });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user),
      roles: user.roles,
      user: publicUser(user),
    });
  },

  async register(req, res) {
    const { username, email, address, password, fullName } = req.body;

    const user = await db.User.create({
      username,
      email,
      address,
      fullName,
      roles: "user",
      password: await bcrypt.hash(password, 10),
    });

    // Fire and forget: a broken mail server shouldn't block sign up.
    sendEmail({
      to: email,
      subject: "Welcome to the Online Library",
      name: fullName,
      message: `Your account "${username}" is ready. You can now log in and start borrowing books.`,
    });

    return res.status(201).json({
      message: `Account ${user.username} created. You can log in now.`,
      data: publicUser(user),
    });
  },

  async me(req, res) {
    const user = await db.User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ data: publicUser(user) });
  },
};
