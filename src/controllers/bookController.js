const { count } = require("console")
const newAuthor = require("../models/newAuthor")
const newPublisher=require("../models/newPublisher")
const newBook= require("../models/newBook")



const createAuthor= async function (req, res) {
    let author = req.body
    let authorCreated = await newAuthor.create(author)
    res.send({data: authorCreated})
}

const createPublisher =async function (req, res) {
    let Publisher = req.body
    let PublisherCreated = await newPublisher.create(Publisher)
    res.send({data: PublisherCreated})
}
 
const createBook1 =async function (req, res) {
    let Book1 = req.body
    let Book1Created = await newBook.create(Book1)
    res.send({data:Book1Created})

}

const createBook= async function (req, res) {
    let book = req.body
    if(book.Author){
        if(book.Publisher){
            Publisher_id = book.Publisher
            Author_id=book.Author
          const valid1=await newAuthor.find({_id:Author_id})
          const valid2=await newPublisher.find({_id:Publisher_id})
          if(valid1.length==0)
          {
              res.send("author is not present")
          }
          if(valid2.length==0)
          {
              res.send("publisher is not present")
          }
          let bookCreated = await newBook.create(book)
          res.send({data: bookCreated})
        } 
        res.send("this deatail is required")
    }
        res.send("this detail is required ")
   
}
const getBooks= async function (req, res) {
    let books = await newBook.find().populate("Author_id")
    res.send({data: books})
}

module.exports.createAuthor= createAuthor
module.exports.createPublisher=createPublisher
module.exports.createBook1=createBook1
module.exports.createBook= createBook
module.exports.getBooks= getBooks





