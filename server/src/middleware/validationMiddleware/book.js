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

const checkBookName = async (value, { req }) => {
  try {
    const book = await db.Book.findOne({ where: { title: value } });
    if (book) {
      throw new Error("Book title already taken");
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

  validateRegisterBook: validate([
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .custom(checkBookName),
    body("author").notEmpty().withMessage("Author name is required"),
    body("isbn")
      .notEmpty()
      .withMessage("ISBN is required")
      .isISBN()
      .withMessage("Invalid ISBN format"),
    body("publishedYear")
      .notEmpty()
      .withMessage("Published year is required")
      .isInt({ max: new Date().getFullYear() })
      .withMessage("Invalid published year"),
    body("genreId")
      .notEmpty()
      .withMessage("Genre ID is required")
      .isNumeric()
      .withMessage("Genre ID should be a valid number"),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isNumeric()
      .withMessage("Quantity should be a valid number"),
  ]),

  validateUpdateBook: validate([
    body("title")
      .optional()
      .notEmpty()
      .withMessage("Title is required")
      .custom(checkBookName),
    body("author").optional().notEmpty().withMessage("Author name is required"),
    body("isbn")
      .optional()
      .notEmpty()
      .withMessage("ISBN is required")
      .isISBN()
      .withMessage("Invalid ISBN format"),
    body("publishedYear")
      .optional()
      .notEmpty()
      .withMessage("Published year is required")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Invalid published year"),
    body("genreId")
      .optional()
      .notEmpty()
      .withMessage("Genre ID is required")
      .isNumeric()
      .withMessage("Genre ID should be a valid number"),
    body("quantity")
      .optional()
      .notEmpty()
      .withMessage("Quantity is required")
      .isNumeric()
      .withMessage("Quantity should be a valid number"),
  ]),
};
