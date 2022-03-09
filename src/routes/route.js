const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const mw = require("../middleware/auth")



router.post("/users", userController.createUser  )

router.post("/login", userController.loginUser)


router.get("/users/:userId", mw.tokenChecker,  userController.getUserData)

router.put("/updateusers/:userId", mw.tokenChecker, userController.updateUser)
router.delete("/deletedUser/:userId", mw.tokenChecker, userController.deleteUser)
module.exports = router;