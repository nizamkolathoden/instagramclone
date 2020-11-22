const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required:true
    },
    postedBy: {
        type: ObjectId,
        ref: "user"
    },
    likes:[{
        type:ObjectId,
        ref:'user'
    }],
    comments:[{
        text:String,
        postedBy:{
            type:ObjectId,
            ref:'user'
        }
    }]
})
module.exports = mongoose.model("Post", postSchema)