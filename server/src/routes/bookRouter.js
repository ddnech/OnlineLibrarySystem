const {book:bookController} = require("../controllers")
const authMiddleware = require("../middleware/authMiddleware")
const bookValidation = require("../middleware/validationMiddleware/book")
const multerMiddleware = require("../middleware/multerMiddleware/book");
const genreController = require("../controllers/genreController");
const router = require("express").Router();

router.get("/records", authMiddleware.verifyAccessToken,bookController.getBookRecordsList)
router.get("/genre", genreController.getAllGenres)
router.post("/",multerMiddleware,authMiddleware.verifyAccessTokenAdmin,bookValidation.validateRegisterBook, bookController.registerBook)
router.patch("/:id",authMiddleware.verifyAccessTokenAdmin,bookValidation.removeEmptyFields,bookValidation.validateUpdateBook, bookController.updateBookDetails)
router.get("/", bookController.getBooksList)
router.get("/",authMiddleware.verifyAccessToken, bookController.getBookRecordsList)
router.get("/:id", bookController.getSingleBook)


module.exports = router;