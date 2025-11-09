import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "@/redux/authSlice";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import useGetAllMessages from "@/hooks/UseGetAllMessages";
import useGetRTM from "@/hooks/UseRTM";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user, suggestedUser, selectedUser } = useSelector((state) => state.auth);
  const { onlineUser, messages } = useSelector((store) => store.chat);
  const {likeNotification} = useSelector((store)=>store.realTimeNotification);
  console.log(likeNotification)


  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useGetRTM();
  useGetAllMessages();
  useEffect(() => {
    
      return () => {
        dispatch(setSelectedUser(null));
      }
    }, [])
    
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    console.log(onlineUser)
  if (!newMsg.trim()) return;

  try {
    const response = await axios.post(
      `http://localhost:7000/message/send/${selectedUser?._id}`,
      { text: newMsg },   // ✅ wrap it in an object
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.data.success) {
        console.log(response.data.message)
        console.log(messages)
        dispatch(setMessages([...(messages || []), response.data.message]));
      setNewMsg("");
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};


  return (
    <div className="mx-16 flex h-screen bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-white border-r flex flex-col p-4 gap-4 shadow-lg">
        <div className="flex items-center gap-3 p-2 bg-purple-100 rounded-xl w-fit hover:bg-purple-200 transition">
          <img
            src={user?.profilePicture || "https://via.placeholder.com/40"}
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
          />
          <span className="font-semibold text-sm">{user?.username}</span>
        </div>

        <h2 className="text-gray-700 font-semibold mt-4">Suggested Chats</h2>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {suggestedUser?.map((u) => {
            const isOnline = onlineUser.includes(u._id);
            return (
              <div
                key={u._id}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-purple-50 transition ${
                  selectedUser?._id === u._id ? "bg-purple-100" : ""
                }`}
                onClick={() => dispatch(setSelectedUser(u))}
              >
                <div className="relative">
                  <img
                    src={u.profilePicture || "https://via.placeholder.com/40"}
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white" />
                  )}
                </div>
                <span className="font-medium text-sm">{u.username}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col ml-4">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 rounded-2xl p-3 border-b bg-white shadow-sm w-fit sticky top-0 z-10">
              <img
                src={selectedUser?.profilePicture || "https://via.placeholder.com/40"}
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-pink-300"
              />
              <span className="font-semibold text-sm">{selectedUser.username}</span>
              {onlineUser.includes(selectedUser._id) && (
                <span className="ml-2 w-3 h-3 bg-green-500 rounded-full" />
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gradient-to-b from-purple-50 to-pink-50">
              {messages &&
                messages.map((m, index) => (
                  <div
                    key={index}
                    className={`max-w-xs px-4 py-2 rounded-3xl break-words shadow-md ${
                      user?._id === m.senderId?._id
                        ? "self-end bg-purple-600 text-white rounded-br-none animate-slide-in"
                        : "self-start bg-white text-gray-800 animate-slide-in"
                    }`}
                  >
                    {m.message}
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1 border rounded-2xl px-4 py-2 focus:outline-none focus:ring focus:ring-pink-300"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-pink-500 text-white px-4 py-2 rounded-2xl hover:bg-pink-600 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex flex-col justify-center items-center gap-4 text-gray-400">
            <div className="text-6xl animate-bounce">💬</div>
            <h2 className="text-2xl font-semibold">No Chat Selected</h2>
            <p className="text-center max-w-xs">
              Select a user from the left sidebar to start chatting. Your conversations will appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
