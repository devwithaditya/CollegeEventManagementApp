const mongoose = require("mongoose")

const contactCollection = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    }
},
    {
        timestamps:true
    }
)

const contactModel = mongoose.model("contact",contactCollection)

module.exports = contactModel