// CommentDialoag.jsx
import { setPostSlice } from "@/redux/postSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CommentDialoag = ({ onClose, postImage, post }) => {
  const [text, setText] = useState("");
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    let inputText = e.target.value;
    setText(inputText.trimStart());
  };

  const submitHandler = async () => {
    if (!text.trim()) {
      toast("Write Something");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:7000/post/comment/${post._id}`,
        { text },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        setText("");
        const updatePost = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, comments: [...p.comments, response.data.comment] };
          }
          return p;
        });

        dispatch(setPostSlice(updatePost));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        {/* Post Image */}
        {postImage && (
          <img
            src={postImage}
            alt="post"
            className="w-full max-h-60 object-contain border-b"
          />
        )}

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage className="object-cover" src={comment.author?.profilePicture} />
                  <AvatarFallback>{comment.author?.username.slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-xl p-2 flex-1">
                  <span className="font-semibold text-sm">{comment.author?.username}</span>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center mt-4">No comments yet.</p>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            onChange={changeEventHandler}
            value={text}
            placeholder="Add a comment..."
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={submitHandler}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 text-sm"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialoag;
