const jwt = require("jsonwebtoken")
const User = require("../models/User")

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader;
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err){
                res.status(403).json("Token is not valid!");
            }else{
                req.user = user;
                next();
            }
        })
    }else{
        return res.status(401).json("You are not authenticated!")
    }
}

const verifyTokenAndAuth = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }else{
            res.status(403).json("You are not alowed to do that!")
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin) {
            next();
        }else{
            res.status(403).json("You are not alowed to do that!")
        }
    })
}

module.exports = {verifyTokenAndAuth, verifyToken, verifyTokenAndAdmin} ;