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
    })


router.put('/follow',requirelogin,(req,res)=>{

    const {followid} = req.body;
    if(!followid) return res.status(404).json({error:'not found'});
    User.findByIdAndUpdate(followid,{
        $push:{followers:req.user._id}
    },{
        //we put new for we doing put methode but if ther is no data it will be added otherways it did not add the data first click it add only 2nd click
        new:true
        //this result is userdata that mean you follow someone there data store in result
    },(err,result)=>{
        if(err) return res.status(404).json({error:err})
        

        User.findByIdAndUpdate(req.user._id,{
            $push:{following:followid}            
            
        },{
            //we put new for we doing put methode but if ther is no data it will be added otherways it did not add the data first click it add only 2nd click
            new:true
        }
        //this result is the guy who loggedin account
        ).select('-password').then(result=>{
            res.json(result)
        })
        
    }
    ).select('-password')
  
})

router.put('/unfollow',requirelogin,(req,res)=>{
    const {unfollowid} = req.body;
    if(!unfollowid) return res.status(404).json({error:'user not found'});
    User.findByIdAndUpdate(unfollowid,{
        $pull:{followers:req.user._id}
        
    },{
        //we put new for we doing put methode but if ther is no data it will be added otherways it did not add the data first click it add only 2nd click
        new:true
        //this result is userdata that mean you follow someone there data store in result
    },(err,result)=>{
            if(err) return res.status(404).json({error:err})
            //its a loged in user
            // result.password = result.password = null
            console.log(result);
                User.findByIdAndUpdate(req.user._id,{
                        $pull:{following:unfollowid}
                },{
                    new:true
                }).select('-password').then(result=>{
                    res.json(result)
                })
    }
    )
})

module.exports = router