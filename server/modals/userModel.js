const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 105,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['male', 'female', ''],
        default: ''
    },
    profilePicture: {
        type: String,
        default: 'https://plus.unsplash.com/premium_photo-1738590017220-5820f49608cc?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User',userSchema);
module.exports = User;