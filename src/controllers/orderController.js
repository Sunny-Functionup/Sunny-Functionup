
const orderModel = require("../models/orderModel")
//const productModel = require("../models/productModel")
//const userModel = require("../models/userModel")


const createorder = async function (req, res) {
    let data = req.body
    let savedData = await orderModel.create(data)
    res.send({ msg: savedData })
}

module.exports.createorder=createorder