const express = require("express");
const app = express();
app.use(express.json());
const router=express.Router();
const userController=require("../Controllers/user.js");

router.post("/signup",userController.signup);
router.post("/login",userController.login);
router.post("/bookride",userController.bookride);
router.post("/cancelride",userController.cancleride);
router.post("/acceptride",userController.acceptride);
router.post("/sendotp",userController.sendotp);
router.post("/rides",userController.getrides);
router.get("/allrides",userController.getallrides);
router.post("/verifyotp",userController.verifyotp);

module.exports =router;