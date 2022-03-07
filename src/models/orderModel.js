const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const orderSchema = new mongoose.Schema({


    user: {
        type: ObjectId,
        ref: "NewUser"
    },

    product: {
        type: ObjectId,
        ref: "Product"
    },

    amount:Number,
    isFreeAppUser:
        Boolean,
    date: String,
},
    { timestamps: true })

module.exports = mongoose.model('neworder', orderSchema) 
