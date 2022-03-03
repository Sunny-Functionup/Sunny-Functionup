const mongoose = require('mongoose');
//const ObjectId = mongoose.Schema.Types.ObjectId

const AuthorSchema = new mongoose.Schema( {
    
    authorName: String,
    age:Number,
    address:String

}, { timestamps: true });

module.exports = mongoose.model('newAuthor', AuthorSchema)
