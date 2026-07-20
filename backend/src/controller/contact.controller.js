const contactModel = require("../models/contact.models")
async function sendContact(req,res) {
    const{name,email,subject,message} = req.body

    await contactModel.create({
        name,
        email,
        subject,
        message
    })

    res.status(201).json({
        message:"Message sent successfully"
    })
}

async function getContact(req,res){

    const contact = await contactModel.find({})

    res.status(200).json({
        message:"Fetched Successfully",
        contact
    })
}

module.exports = {sendContact,getContact}