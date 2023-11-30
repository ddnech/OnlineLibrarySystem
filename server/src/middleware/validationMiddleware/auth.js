const { body, validationResult } = require("express-validator");
const db = require("../../models");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(400)
      .send({ message: "An error occurs", errors: errors.array() });
  };
};

const checkUsername = async (value, { req }) => {
  try {
    const user = await db.User.findOne({ where: { username: value } });
    if (user) {
      throw new Error("Username already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkEmail = async (value, { req }) => {
    try {
      const user = await db.User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email already taken");
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };

const removeEmptyFields = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === null || req.body[key] === undefined) {
      delete req.body[key];
    }
  });
  next();
};

module.exports = {
  removeEmptyFields,

  validateRegistration: validate([
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 to 20 characters long.")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "Username can only contain letters, numbers, underscores, and hyphens"
      )
      .custom(checkUsername)
      .custom((value) => {
        if (/\s/.test(value)) {
          throw new Error("Username cannot contain spaces.");
        }
        return true;
      }),
    body("fullName")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage(
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address")
      .custom(checkEmail)
      .custom((email) => {
        const allowedDomains = ["gmail.com", "hotmail.com"]; // add more domains as needed
        const domain = email.split("@")[1];
        if (!allowedDomains.includes(domain)) {
          throw new Error(
            "Email must be from a valid domain (e.g., gmail.com, hotmail.com)"
          );
        }
        return true;
      }),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .withMessage("Password is required")
      .matches(/^(?=.*[A-Z])[A-Za-z0-9]{8,}$/)
      .withMessage(
        "Password must be at least 8 characters long, contain at least one uppercase letter, be alphanumeric, and no symbols"
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Confirm password does not match with password");
        }
        return true;
      }),
    body("address")
      .notEmpty()
      .withMessage("Address is required"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required"),
  ]),

  validateLogin: validate([
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
};
