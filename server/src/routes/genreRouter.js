const {genre:genreController} = require("../controllers")
const authMiddleware = require("../middleware/authMiddleware")
const genreValidation = require("../middleware/validationMiddleware/book")
const multerMiddleware = require("../middleware/multerMiddleware/genre")
const router = require("express").Router();

router.post("/",multerMiddleware,authMiddleware.verifyAccessTokenAdmin,genreValidation.validateRegisterGenre, genreController.createGenre)

module.exports = router;