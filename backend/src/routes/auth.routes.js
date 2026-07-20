const express = require("express")
const authRouter = express.Router()
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

authRouter.post("/register",authController.register)

authRouter.post("/login",authController.login)

authRouter.post("/otp-verify",authController.verifyOTP)

authRouter.get("/refresh-token",authController.refreshToken)

authRouter.post("/logout",authController.logOut)

module.exports = authRouter