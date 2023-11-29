const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const token = jwt.sign(
      {
        id: user.id,
        roles: user.roles,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  };

module.exports = generateToken;