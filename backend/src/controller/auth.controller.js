const userModel = require("../models/user.models")
const bcrypt  = require("bcrypt")
const {generateOTP,otpTemplate} = require("../utils/utils")
const otpModel = require("../models/otp.models")
const sendEmail = require("../services/email.service")
const jwt = require("jsonwebtoken")

async function register(req,res){
    const{name,email,password} = req.body

    const isAvailable = await userModel.findOne({
        email
    })

    if(isAvailable){
        return res.status(409).json({
            message:"Email already exist"
        })
    }

    const passwordHash = await bcrypt.hash(password,4)
   
    const otp = generateOTP()
    const html = otpTemplate(otp)

    const otpHash = await bcrypt.hash(otp,4)

    await otpModel.deleteOne({
    email
    })

    await otpModel.create({
        email,
        otp:otpHash
    })

    await sendEmail(email,"OTP Verification",`Your OTP is ${otp}`,html)
    
    const user = await userModel.create({
        name,
        email,
        password:passwordHash,
    })

    res.status(201).json({
        message:"User Successfully Created",
        name:user.name,
        email:user.email,
        verified:user.verified
    })

}

async function verifyOTP(req,res) {
    
    const{email,otp} = req.body

    const otpDoc = await otpModel.findOne({
        email
    })

    if(!otpDoc){
        return res.status(404).json({
            message:"OTP not found or expired"
        })
    }


    const isMatch = await bcrypt.compare(otp,otpDoc.otp)

    if(!isMatch){
        return res.status(401).json({
            message:"Incorrect OTP"
        })
    }

    const user = await userModel.findOneAndUpdate(
        {email},
        {verified:true}
    )

    await otpModel.deleteOne({
        email
    })

    res.status(200).json({
        message:"Email Verified Succesfully"
    })
}

async function login(req,res){
    const {email,password} = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(404).json({
            message:"User not exist"
        })
    }

    if(!user.verified){
        return res.status(403).json({
            message:"User Not Verified"
        })
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.status(401).json({
            message:"Incorrect Password"
        })
    }


    const accessToken = jwt.sign({
        id:user._id, 
        role:user.role,
    },process.env.JWT_SECRET,
        {
            expiresIn:"15m"
        }
    )

    const refreshToken = jwt.sign({
        id:user._id,
        role:user.role,
    },process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        } 
    )

    res.cookie("refreshToken",refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // -> 7 days
    })

    res.status(200).json({
        message:"User Login Successfully",
        accessToken,
        user:{
            name:user.name,
            email:user.email,
            role:user.role
        }
    })

}

async function refreshToken(req,res){

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(404).json({
            message:"Refresh Token not found"
        })
    }

    const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET)

    if(!decoded){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }

    const accessToken = jwt.sign({
        id:decoded.id,
        role:decoded.role,
    },process.env.JWT_SECRET,
        {
            expiresIn:"15m"
        }
    )

    const newRefreshToken = jwt.sign({
        id:decoded.id,
        role:decoded.role,
    },process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    )

    res.cookie("refreshToken",newRefreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message:"Access Token Refresh Successfully",
        accessToken
    })
}

async function logOut(req,res){
    const refreshToken = req.cookies.refreshToken
    
    if(!refreshToken){
        return res.status(404).json({
            message:"No active session found"
        })
    }

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
        sameSite:"strict"
    })

    res.status(200).json({
        message:"Logout Successful"
    })

}

module.exports = {register,login,verifyOTP,refreshToken,logOut}
