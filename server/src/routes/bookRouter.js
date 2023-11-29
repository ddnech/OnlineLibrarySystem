const {book:bookController} = require("../controllers")
const authMiddleware = require("../middleware/authMiddleware")
const multerMiddleware = require("../middleware/multerMiddleware/book")
const router = require("express").Router();

router.post("/",multerMiddleware,authMiddleware.verifyAccessTokenAdmin, bookController.registerBook)
router.patch("/:id",authMiddleware.verifyAccessTokenAdmin, bookController.updateBookDetails)
router.get("/", bookController.getBooksList)
router.get("/:id", bookController.getSingleBook)

module.exports = router;