const {genre:genreController} = require("../controllers")
const authMiddleware = require("../middleware/authMiddleware")
const multerMiddleware = require("../middleware/multerMiddleware/genre")
const router = require("express").Router();

router.post("/",multerMiddleware,authMiddleware.verifyAccessTokenAdmin, genreController.createGenre)

module.exports = router;