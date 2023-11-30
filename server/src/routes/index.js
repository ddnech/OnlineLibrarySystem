const auth = require("./authRouter");
const genre = require("./genreRouter");
const book = require("./bookRouter");
const user = require("./userRouter");
const admin = require("./adminRouter");

module.exports = {
  auth,
  genre,
  book,
  user,
  admin,
};