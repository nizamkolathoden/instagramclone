//required stuff
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
//midlle ware for authontication
const requirelogin = require("./../middleware/requirelogin")
const User = require("./../models/user")
const Post = require("./../models/post")

router.get('/user/:id',requirelogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })

    //newly added

        //get all post in this id
       /*  Post.find({ postedBy: req.params.id })
            .populate("postedBy", "_id name")
            .then(mypost => {
    
                res.json({ sucess: mypost })
    
                
    
            }).catch(e => console.log("error in mypost:", e)) */
    })
    
   




module.exports = router