const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/signout", userController.signout);
router.post("/google", userController.google);

module.exports = router;
