/* /router/userRouter.js */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userAuthentication = require("../middleware/auth");

router.use(express.static("public"));

router.get("/", userController.getLoginPage);
router.post("/user/login", userController.postUserLogin);
router.post("/user/signUp", userController.postUserSignUp);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/isPremiumUser", userAuthentication, userController.isPremiumUser);


module.exports = router;
