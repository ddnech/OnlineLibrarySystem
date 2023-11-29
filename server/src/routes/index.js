const auth = require("./authRouter");
const genre = require("./genreRouter");
const book = require("./bookRouter");
const user = require("./userRouter");

module.exports = {
  auth,
  genre,
  book,
  user,
};