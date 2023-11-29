const {user:userController} = require("../controllers")
const authMiddleware = require("../middleware/authMiddleware")
const router = require("express").Router();

router.post("/:book_id/:user_id",authMiddleware.verifyAccessTokenUser, userController.bookRequest)


module.exports = router;