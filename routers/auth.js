const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("./../models/user")
//const user = require("./../models/user")
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("./../key");
const requiredlogin=require("./../middleware/requirelogin")

//protected
router.get("/protected",requiredlogin,(req,res)=>{
    res.json({message:"hello"})
  
})


//siginup
router.post("/signup",(req,res)=>{
    const {name,email,password}= req.body
    if(!email||!password||!name){
      return res.status(422).json({error:"enter all fields"})
    }
        
        User.findOne({email:email})
        .then((savedUser)=>{
        
            if(savedUser) return res.status(422).json({error:"user alerady exists in same email"})
            
            bcrypt.hash(password,13)
            .then(hashedpassword=>{
              
                const user = new User({
                    email,
                    password:hashedpassword,
                    name
                })
                user.save()
                .then(user=>{
                    res.json({message:"saved sucess"})
                })
                .catch(err=>{
                    console.log("error:",err);
                })            
            })
          
            })
          
        .catch(err=>{
            console.log("error",err);
        }) 
})

//login
router.post("/login",(req,res)=>{
        
    const {email,password} = req.body
        
        if(!email || !password) return res.json({error:"please enter email and password"});
        
        User.findOne({email:email}).then(savedUser=>{
                
                if(!savedUser) res.status(422).json({error:"invalid Email or password"})
                
                bcrypt.compare(password,savedUser.password)
                .then(doMatch=>{
                
                    if(doMatch){
                       
                        //res.send("logged in")
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        //return res.json({message:token})
                        //fetch name email and id from savedUser(saved user is comming from database not in tocken) 
                        const{_id,email,name} = savedUser;
                        //pass tocken and user to frontend/responce
                        res.json({token,user:{_id,name,email}})

                    }else res.status(422).json({error:"invalid email or Password"})
                }).catch(e=>{
                  
                    console.log("error1:",e);
                })
        }).catch(e=>{
            
            console.log("error");
        })
})


module.exports = router
