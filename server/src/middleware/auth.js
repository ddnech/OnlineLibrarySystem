const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

/**
 * Checks the Bearer token. Pass one or more roles to limit who gets through:
 *   requireAuth()          -> any logged in user
 *   requireAuth("admin")   -> admins only
 */
function requireAuth(...roles) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({ message: "Please log in first." });
    }

    let payload;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (error) {
      const message =
        error.name === "TokenExpiredError"
          ? "Your session has expired. Please log in again."
          : "Invalid token. Please log in again.";
      return res.status(401).json({ message });
    }

    if (roles.length && !roles.includes(payload.roles)) {
      return res.status(403).json({ message: "You don't have access to this." });
    }

    req.user = payload;
    next();
  };
}

module.exports = { requireAuth };
