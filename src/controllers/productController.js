
const productModel = require("../models/productmodel")

const createproduct = async function (req,res){
    let data = req.body
    let savedData = await productModel.create(data)
    res.send({msg: savedData})
}
module.exports.createproduct=createproduct