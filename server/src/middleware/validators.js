const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../models");
const { removeUpload } = require("./upload");

/** Runs the checks and answers with the first error message if something is wrong. */
const validate = (checks) => async (req, res, next) => {
  for (const check of checks) {
    await check.run(req);
  }
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  // The image was already saved by multer, so throw it away.
  removeUpload(req.uploadedPath);

  const errors = result.array();
  return res.status(400).json({ message: errors[0].msg, errors });
};

const unique = (model, field, label) => async (value, { req }) => {
  const where = { [field]: value };
  if (req.params.id) where.id = { [Op.ne]: req.params.id };
  if (await db[model].findOne({ where })) {
    throw new Error(`${label} is already taken.`);
  }
  return true;
};

const genreExists = async (value) => {
  if (!(await db.Genre.findByPk(value))) throw new Error("That genre doesn't exist.");
  return true;
};

const thisYear = () => new Date().getFullYear();

const bookFields = (optional) => {
  const field = (name) => (optional ? body(name).optional({ values: "falsy" }) : body(name));
  return [
    field("title").trim().notEmpty().withMessage("Title is required.")
      .isLength({ max: 255 }).withMessage("Title is too long.")
      .custom(unique("Book", "title", "Book title")),
    field("author").trim().notEmpty().withMessage("Author is required."),
    field("isbn").trim().notEmpty().withMessage("ISBN is required.")
      .customSanitizer((v) => String(v).replace(/[\s-]/g, ""))
      .isISBN().withMessage("That doesn't look like a valid ISBN (10 or 13 digits)."),
    field("publishedYear").isInt({ min: 1, max: thisYear() })
      .withMessage(`Published year must be between 1 and ${thisYear()}.`).toInt(),
    field("genreId").isInt().withMessage("Pick a genre.").toInt().custom(genreExists),
    field("quantity").isInt({ min: 1, max: 999 })
      .withMessage("Quantity must be between 1 and 999.").toInt(),
  ];
};

module.exports = {
  register: validate([
    body("username").trim()
      .isLength({ min: 3, max: 20 }).withMessage("Username must be 3 to 20 characters.")
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage("Username can only use letters, numbers, - and _.")
      .custom(unique("User", "username", "Username")),
    body("fullName").trim().notEmpty().withMessage("Full name is required.")
      .isLength({ max: 50 }).withMessage("Full name can be at most 50 characters.")
      .matches(/^[\p{L}\s'.-]+$/u).withMessage("Full name can only contain letters, spaces, ' . and -."),
    body("email").trim().isEmail().withMessage("Enter a valid email address.")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(unique("User", "email", "Email")),
    body("address").trim().notEmpty().withMessage("Address is required."),
    body("password")
      .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      .withMessage("Password needs at least 8 characters, one capital letter and one number."),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords don't match.");
      return true;
    }),
  ]),

  login: validate([
    body("username").trim().notEmpty().withMessage("Username is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ]),

  createBook: validate(bookFields(false)),
  updateBook: validate(bookFields(true)),

  createGenre: validate([
    body("genreName").trim().notEmpty().withMessage("Genre name is required.")
      .isLength({ max: 50 }).withMessage("Genre name can be at most 50 characters.")
      .custom(unique("Genre", "genreName", "Genre name")),
  ]),
};
