const express = require("express")
const contactRouter = express.Router();
const contactController = require("../controller/contact.controller")
const authMiddleware = require("../middleware/auth.middleware")
const adminMiddleware = require("../middleware/admin.middleware")

contactRouter.post("/contact-send",contactController.sendContact)
contactRouter.get("/get-contact",authMiddleware.authUser,adminMiddleware.authAdmin,contactController.getContact)

module.exports = contactRouter