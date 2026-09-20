const express = require("express");
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express();
//use below line after taking dist file into backend
app.use(express.static("public"))

const authRouter = require("./routes/auth.routes")
const eventRouter = require("./routes/event.routes");
const registerRouter = require("./routes/registration.routes");
const contactRouter = require("./routes/contact.routes")

app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://event-handler-backend.yellowbay-549b6eaf.eastasia.azurecontainerapps.io"
    ],
    credentials:true 
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/events",eventRouter)
app.use("/api/registration",registerRouter)
app.use("/api/contact",contactRouter)


module.exports = app;