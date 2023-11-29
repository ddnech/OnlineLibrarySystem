const jwt = require("jsonwebtoken");

module.exports = {
  verifyAccessTokenAdmin: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
          res.status(401).json({
            message: "Token verification failed",
          });
          return;
        }

        const { roles } = payload;
        if (roles !== "admin") {
          return res.status(403).json({
            message: "Unauthorized role",
            role: payload,
          });
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).json({
          message: "Invalid token",
          payload: authorization,
          error,
        });
      }
    }
  },


};