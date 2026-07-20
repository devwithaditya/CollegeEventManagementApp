const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title required"]
    },
    description:{
        type:String,
        required:[true,"Description required"]
    },
    date:{
        type:Date,
        required:[true,"Date is required"]
    },
    time:{
        type:String,
        required:[true,"Time required"]
    },
    venue:{
        type:String,
        required:[true,"Location required"]
    },
    price:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:[true,"Category required"]
    },
    image:{
        type:String,
    },
    maxParticipants:{
        type:Number,
        required:[true,"Max Participants required"]
    },
    currentParticipants:{
        type:Number,
        default:0
    },
    createdBy:{
       type: mongoose.Schema.Types.ObjectId,
       ref: "user"
    }
},
    {
        timestamps:true
    }
)

const eventModel = mongoose.model("event",eventSchema)

module.exports = eventModel