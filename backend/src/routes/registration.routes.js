const express = require("express")
const registerRoutes = express.Router()
const registerController = require("../controller/registration.controller")
const authMiddleware = require("../middleware/auth.middleware")

registerRoutes.post("/register-user",authMiddleware.authUser,registerController.registerUser)
registerRoutes.get("/get-Allregistration",registerController.getRegistration)



module.exports = registerRoutes