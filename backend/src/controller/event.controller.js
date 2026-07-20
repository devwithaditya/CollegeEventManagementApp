const eventModel = require("../models/event.models")

async function createEvent(req,res){    
    const{title,description,date,time,venue,price,category,image,maxParticipants} = req.body
    
    const event = await eventModel.create({
        title,
        description,
        date,
        time,
        venue,
        price,
        category,
        image,
        maxParticipants,
        createdBy:req.user.id
    })

    return res.status(201).json({
        message:"Event Created Successfully",
        event
    })

}

async function getEvent(req,res){
    const allEvents = await eventModel.find({})
    
    res.status(200).json({
        message:"All events are fetched successfully",
        allEvents
    })

}

async function getEventsById(req,res){
    const event = await eventModel.findById(req.params.id)
    if(!event){
        return res.status(404).json({
            message:"Event not found"
        })
    }

    res.status(200).json({
        message:"Event are fetched successfully",
        event
    })

}

async function updateEvent(req,res){
    const event = await eventModel.findByIdAndUpdate(
        req.params.id,
        req.body
    )
    if(!event){
        return res.status(404).json({
            message:"Event not found"
        })
    }

    res.status(200).json({
        message:"Event Updated Successfully"
    })
}


async function deleteEvent(req,res){
    const event = await eventModel.findByIdAndDelete(req.params.id)
    if(!event){
        return res(404).json({
            message:"Event not found"
        })
    }
    res.status(200).json({
        message:"Event deleted Successfully"
    })
}


module.exports = {createEvent,getEvent,getEventsById,updateEvent,deleteEvent}