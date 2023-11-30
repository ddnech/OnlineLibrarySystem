const {user:userController} = require("../controllers")
const authMiddleware = require("../middleware/authMiddleware")
const router = require("express").Router();

router.post("/:book_id",authMiddleware.verifyAccessTokenUser, userController.bookRequest)
router.patch("/pending-return/:id",authMiddleware.verifyAccessTokenUser, userController.bookReturn)


module.exports = router;