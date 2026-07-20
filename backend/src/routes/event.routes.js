const express = require("express")
const eventRouter = express.Router()
const eventController = require("../controller/event.controller")
const authMiddleware = require("../middleware/auth.middleware")
const adminMiddleware = require("../middleware/admin.middleware")


eventRouter.post("/create",authMiddleware.authUser,adminMiddleware.authAdmin,eventController.createEvent)
eventRouter.get("/get-event",eventController.getEvent)
eventRouter.get("/getEvents-byId/:id",authMiddleware.authUser,adminMiddleware.authAdmin,eventController.getEventsById)
eventRouter.put("/update-event/:id",authMiddleware.authUser,adminMiddleware.authAdmin,eventController.updateEvent)
eventRouter.delete("/delete-event/:id",authMiddleware.authUser,adminMiddleware.authAdmin,eventController.deleteEvent)

module.exports = eventRouter