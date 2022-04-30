const { use } = require('bcrypt/promises');
const jwt = require('jsonwebtoken');
const userSchema = require('../model/user.model');
require('dotenv').config();

function authVerify (req,res,next){
    try {
        console.log("verify token");
        let token = req.header("token")
        if(!token){
            return res.status(401).json({"status": "failure", "message": "Unauthorised access"})
        }
        const decode = jwt.verify(token, process.env.secretKey)
        console.log("decode",decode)
        next(); 
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: "Invalid token"})
    }    
}

async function isAdmin (req,res,next){
    try{
        console.log("verify token");
        let token = req.header("token")
        if(!token){
            return res.status(401).json({"status": "failure", "message": "Unauthorised access"})
        }
        const decode = jwt.verify(token, process.env.secretKey)
        console.log("decode uuid",decode)
     console.log("role",decode.role)
        if(decode.role === "admin"){
            console.log("admin",decode.role)
            next();
        }else{
            return res.status(401).json({"status": "failure", "message": "Unauthorised access"})
        }       
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status: "failure", message: "Invalid token"})
    }
}

module.exports = {
    authVerify: authVerify,
   isAdmin: isAdmin
}



