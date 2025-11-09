const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    caption:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;