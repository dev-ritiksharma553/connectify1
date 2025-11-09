const mongoose = require('mongoose');


const messageSchemma = mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation'
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true    
    },
    message:{
        type:String,
        required:true
    }
})

const Message = mongoose.model('Message',messageSchemma);
module.exports = Message;