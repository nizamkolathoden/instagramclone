//required stuff
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
//midlle ware for authontication
const requirelogin = require("./../middleware/requirelogin")
const User = require("./../models/user")
const Post = require("./../models/post")

router.post("/createpost", requirelogin, (req, res) => {
    const { title, body, pic } = req.body
    if (!title || !body || !pic) return res.status(422).json({ error: 'plz add all the fields' })
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        //req.user come from the middle ware the middle ware of jwt
        postedBy: req.user
    })

    post.save()
        .then(result => {
            res.send(result)
        }).catch(e => {
            console.log(e);
        })
})

router.get("/allpost", requirelogin, (req, res) => {
    Post.find()
        //pouplate postedBy
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")

        .then(posts => {
            res.json({ sucess: posts });

        }).catch(e => console.log("error in allpost:", e))
})

router.get("/mypost", requirelogin, (req, res) => {

    //get all post in this id
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(mypost => {

            res.json({ sucess: mypost })

            console.log(mypost);

        }).catch(e => console.log("error in mypost:", e))
})

router.put('/like', requirelogin, (req, res) => {
    //we will get post Id in req.body.postId so we will get post
    Post.findByIdAndUpdate(req.body.postId, {
        //we will get userId in there req.user._id we push like the form of userId req.user._id come from middleware
        $push: { likes: req.user._id }
    }, {
        //we adding new data its actually updatin existing data it will be show only updated data
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json({ sucess: result })
            }
        })
})




router.put('/unlike', requirelogin, (req, res) => {
    //we will get post Id in req.body.postId so we will get post
    Post.findByIdAndUpdate(req.body.postId, {
        //we will get userId in there req.user._id we push like the form of userId req.user._id come from middleware
        $pull: { likes: req.user._id }


    }, {
        //we adding new data its actually updatin existing data it will be show only updated data
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) return res.status(422).json({ error_in_like: err })
            else res.json({ sucess: result })
        })

})

router.put('/comment', requirelogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    //we will get post Id in req.body.postId so we will get post
    Post.findByIdAndUpdate(req.body.postId, {
        //we will get userId in there req.user._id we push like the form of userId req.user._id come from middleware
        $push: { comments: comment }

    }, {
        //we adding new data its actually updatin existing data it will be show only updated data
        new: true
    }).populate("comments.postedBy", "_id name").populate('postedBy', "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json({ sucess: result })
            }
        })
})

router.delete('/deletepost/:postid', requirelogin, (req, res) => {
    Post.findOne({ _id: req.params.postid })
        .populate('postedBy', "_id")
        .exec((err, post) => {
            if (err || !post) return res.status(422).json({ error: err })
            //checking the same user is post photos 
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        return res.json({ sucess: result })
                    }).catch(e => {
                        console.log('error in delete post', e);
                    })
            }
        })
})

router.delete('/deletecomment/:commentid', requirelogin, (req, res) => {
    //we will get post Id in req.body.postId so we will get post
    Post.findByIdAndUpdate(req.body.postId, {
        //we will be remove comments using comments_id
        $pull: {
            comments:
            {
                _id:
                    req.params.commentid
            }
        }


    }, {
        //we adding new data its actually updatin existing data it will be show only updated data
        new: true
    }).populate('postedBy', '_id name')
        .populate('comments.postedBy', 'name _id')
        .exec((err, result) => {
            if (err) return res.status(422).json({ error_in_like: err })
            else res.json({ sucess: result })
        })

})

module.exports = router