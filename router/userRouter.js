/* /router/userRouter.js */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userAuthentication = require("../middleware/auth");

router.use(express.static("public"));

router.get("/", userController.getLoginPage);
router.get("/isPremiumUser", userAuthentication, userController.isPremiumUser);
router.post("/user/login", userController.postUserLogin);
router.post("/user/signUp", userController.postUserSignUp);

module.exports = router;
