const mongoose = require('mongoose');
//const ObjectId = mongoose.Schema.Types.ObjectId

const PublisherSchema = new mongoose.Schema({
name:String,
headQuater:String
})
module.exports = mongoose.model('newPublisher', PublisherSchema)


