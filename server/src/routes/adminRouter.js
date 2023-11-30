const {admin:adminController} = require("../controllers")
const authMiddleware = require("../middleware/authMiddleware")
const router = require("express").Router();

router.patch("/approve-borrow/:id",authMiddleware.verifyAccessTokenAdmin, adminController.approveBorrowRequest)
router.patch("/approve-return/:id",authMiddleware.verifyAccessTokenAdmin, adminController.approveReturnRequest)

router.get("/admin-action",authMiddleware.verifyAccessTokenAdmin, adminController.getAdminActionsList)


module.exports = router;
