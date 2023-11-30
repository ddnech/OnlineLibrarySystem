const auth = require("./authController");
const genre = require("./genreController");
const book = require("./bookController");
const user = require("./userController");
const admin = require("./adminController");

module.exports = {
  auth,
  genre,
  book,
  user,
  admin,
};
