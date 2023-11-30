const authController = require("../controllers/authController")
const authValidation = require("../middleware/validationMiddleware/auth")
const router = require("express").Router();

router.post("/login",authValidation.validateLogin,authController.login)
router.post("/register",authValidation.validateRegistration, authController.registerUser)

module.exports = router;