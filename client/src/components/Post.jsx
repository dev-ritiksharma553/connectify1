import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, ShieldCheck } from "lucide-react";
import CommentDialoag from "./CommentDialoag";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPostSlice } from "@/redux/postSlice";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge"

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // ✅ Fix: initialize liked & likesCount
  const [liked, setLiked] = useState(post.likes.includes(user._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:7000/post/likes/${post._id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // console.log(response.data.updatedLikes)
        const updatedPosts = posts.map((p) => p._id === post._id ? { ...p, likes: response.data.updatedLikes } : p);

        dispatch(setPostSlice(updatedPosts));
        setLikesCount(response.data.updatedLikes.length);
        setLiked(response.data.updatedLikes.includes(user._id));
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const bookmarkHandler = async ()=>{
    try{
      const response = await axios.get(`http://localhost:7000/post/${post._id}/bookmark`,{withCredentials:true});
      if(response.data.success){
        toast.success(response.data.message);
      }
    }catch(error){
      toast.error(
        error.response?.data?.message || "Post Bookmarked Successfully"
      );
    }
  }

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:7000/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedPost = posts.filter((p) => p._id !== post._id);
        dispatch(setPostSlice(updatedPost));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Post Not Deleted Successfully"
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-2xl mx-auto flex flex-col gap-3">
      {/* User Info */}
      <div className="flex items-center gap-3 justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage
              className="object-cover"
              src={post?.author?.profilePicture}
            />
            <AvatarFallback>
              {post?.author?.username
                ? post.author.username.slice(0, 2).toUpperCase()
                : "NA"}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg">
            {post?.author?.username || "Unknown"}
          </span>
          <span>

            {post?.author?._id === user?._id && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold 
               bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
               rounded-full shadow-sm"
              >
                <ShieldCheck size={12} /> Author
              </Badge>
            )}          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreHorizontal size={22} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white shadow-md rounded-md border w-40 z-10">
              <button onClick={bookmarkHandler} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Save
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              {user?._id === post?.author?._id && (
                <button
                  onClick={deleteHandler}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Image - fixed size container */}
      {post.image && (
        <div className="w-full h-80 md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt="post"
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-4 text-gray-700 text-base">{post.caption}</div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 mt-2 px-4 text-gray-600">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 cursor-pointer transition-colors duration-200 ${liked ? "text-red-500" : "hover:text-red-400"
            }`}
        >
          <Heart size={22} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors duration-200"
        >
          <MessageCircle size={22} /> {post.comments.length}
        </button>

        <button className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition-colors duration-200">
          <Share2 size={22} /> Share
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentDialoag

          onClose={() => setShowComments(false)}
          postImage={post.image}
          post={post}
        />
      )}

      {/* Timestamp */}
      <div className="px-4 text-xs text-gray-400 mt-2">{post.timestamp}</div>
    </div>
  );
};

export default Post;
