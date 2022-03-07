const express = require('express');
const router = express.Router();

const orderController = require("../controllers/orderController")
const productController = require("../controllers/productController")
const userController = require("../controllers/userController")
const middleware = require("../middleware/middlewareController")

router.get("/test-me",function(req,res){
    res.send("My first ever API")
})



router.post("/createUser",middleware.mid1,userController.createUser)

router.post("/createorder",orderController.createorder)
router.post("/createproduct",productController.createproduct)
//router.post("/createuser",userController.createUser)

module.exports = router;