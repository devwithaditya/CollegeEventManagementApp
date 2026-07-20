async function authAdmin(req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).json({
            message:"Token not found"
        })
    }

    const token = authHeader.split(" ")[1]

    if(req.user.role=="admin"){
        next()
    }
    else{
        return res.status(403).json({
        message:"You dont have access"
        })
    }

}
module.exports = {authAdmin}