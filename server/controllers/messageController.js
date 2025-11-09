const Message = require("../modals/message");
const Conversation = require("../modals/conversation");
const { io, getReceiverSocketId } = require("../socket/socket");


module.exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { text } = req.body;


    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }


    const message = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message: text,
    });
    await message.save();

    t
    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "_id username profilePicture")
      .populate("receiverId", "_id username profilePicture");

 
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(200).json({
      message: populatedMessage,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Message not Sent",
      success: false,
    });
  }
};

module.exports.getAllMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json({
        messages: [],
        success: true,
      });
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .populate("senderId", "_id username profilePicture")
      .populate("receiverId", "_id username profilePicture")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching messages",
      success: false,
    });
  }
};
