//require
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("./../key")
const mongoose = require("mongoose")
const user = require("../models/user")
//database
const User = mongoose.model("user")
//middleware
module.exports = (req,res,next)=>{
                                                          
    const {authorization} = req.headers          
    console.log(authorization);          
    if(!authorization){                                                    
        return res.status(422).json({error:"you didnot get token"})
       
    }   
    //bearer is confussing                                                                     
   const token = authorization.replace("Bearer ","")                            
   jwt.verify(token,JWT_SECRET,(e,payload)=>{             
       if(e) return res.status(422).json({error:`invalid:${e}`})      
        // get id from jwt payload
       const {_id} = payload
       User.findById({_id:_id}).then(userdata=>{
           // send user data from  collection of user to when it call 
           req.user = userdata
            next()
        })
      
   })
}