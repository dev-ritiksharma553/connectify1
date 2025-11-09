import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPostSlice } from "@/redux/postSlice";

const CreatePost = ({ user, onClose }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!caption && !image) {
      toast.error("Please add a caption or image!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);

      const response = await axios.post(
        "http://localhost:7000/post/addpost",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setPostSlice([response.data.post,...posts]));
        setCaption("");
        removeImage();
        onClose();
        toast.success("Post created!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-2 flex flex-col gap-4 p-5 relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage
            className="object-cover"
            src={user?.profilePicture || "/default-avatar.png"}
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="font-medium">{user?.username || "User"}</span>
      </div>

      {/* Caption */}
      <textarea
        className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        rows={3}
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {/* Image Upload / Preview */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
          preview ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full h-80 overflow-hidden rounded-md">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Click to upload an image</p>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleImageChange(e.target.files[0])}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
