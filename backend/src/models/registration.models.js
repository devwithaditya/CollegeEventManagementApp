const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    eventId:{
        type:String
    },
    phone:{
        type:String
    },
    studentId:{
        type:String
    },
    year:{
        type:String
    },
    department:{
        type:String
    },
    status:{
        type:String
    },
    registeredAt:{
        type:Date
    }
})

const registrationModel = mongoose.model("registration",registrationSchema)

module.exports = registrationModel