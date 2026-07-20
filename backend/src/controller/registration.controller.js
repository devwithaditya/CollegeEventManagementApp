const registrationModel = require("../models/registration.models")
const eventModel = require("../models/event.models")

async function registerUser(req,res){

    const {eventId,phone,studentId,year,department} = req.body
    const userId = req.user.id

    const event = await eventModel.findById(eventId)

    if(!event){
        return res.status(404).json({
            message:"Event does not exist"
        })
    }


    const isAlreadyRegister = await registrationModel.findOne({
        userId,
        eventId
    })

    if(isAlreadyRegister){
        return res.status(409).json({
            message:"User already register"
        })
    }


    if(event.currentParticipants>=event.maxParticipants){
        return res.status(403).json({
            message:"Maximum participants reached"
        })
    }

    await eventModel.findByIdAndUpdate(
        eventId,
        {
           currentParticipants: event.currentParticipants + 1
        }
    )


    const rUser = await registrationModel.create({
        userId,
        eventId,
        phone,
        studentId,
        year,
        department
    })

    return res.status(201).json({
        message:"User registered successfully"
    })

}


async function getRegistration(req,res){
    const registeration = await registrationModel.find({})

    if(!registeration){
        return res.status(404).json({
            message:"No registration found"
        })
    }

    res.status(200).json({
        message:"All registration are fetched successfully",
        registeration
    })
}

module.exports = {registerUser,getRegistration}