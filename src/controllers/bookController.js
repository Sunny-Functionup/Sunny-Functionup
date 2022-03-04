const { count } = require("console")
const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel = require("../models/publisherModel")

const createBook= async function (req, res) {
    let book = req.body
    let author_id = req.body.author_id
    let publisher_id = req.body.publisher_id

    //validation condition a ===============================================================================

    if(!author_id){

    return res.send('The request is not valid as the author id is required.')
    }

    //Validation condition b=================================================================================

    let author = await authorModel.findById(author_id)
    if(!author_id) {

     return res.send('no author present with the given id')
    }
    //Validation Condition c========================================================================================

    if(!publisher_id){

    return res.send('The request is not valid as the publisher id is required.') 
    }
    //validation Condition d======================================================================================

    let publisher = await publisherModel.findById(publisher_id)
    if(!publisher_id) {

    return res.send('no publisher present with the given id')
}

    let bookCreated = await bookModel.create(book)
    return res.send({data: bookCreated})
}

const getBooks= async function (req, res) {
    let books = await bookModel.find().populate('author publisher')
    res.send({data: books})
}


 
module.exports.createBook= createBook
module.exports.getBooks= getBooks
