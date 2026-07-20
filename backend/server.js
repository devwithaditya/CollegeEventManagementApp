const app = require("./src/app")
const connectdb = require("./src/database/db")
connectdb()

app.listen(3000,()=>{
    console.log("server is started at port 3000")
})