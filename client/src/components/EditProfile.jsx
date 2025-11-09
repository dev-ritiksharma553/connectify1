import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { setAuthSlice } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth); // ✅ get logged-in user
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profilePicture: null,
    bio: user?.bio || "",
    gender: user?.gender || "",
    username: user?.username || "unknown_user",
  });

  const [preview, setPreview] = useState(user?.profilePicture || null);

  // Handle text and select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profilePicture: file,
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }
      data.append("bio", formData.bio);
      data.append("gender", formData.gender);

      const response = await axios.post(`http://localhost:7000/user/editprofile`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials:true
      });

      if(response.data.success){
            dispatch(setAuthSlice(response.data.user))
            navigate(`/profile/${user?._id}`)
            toast.success("Profile updated successfully!");
      }
      
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-purple-600">
            ✨ Edit Profile ✨
          </h2>

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-28 h-28">
              <img
                src={
                  preview ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow-md"
              />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Bio */}
          <div>
            <Label className="text-gray-600">Bio</Label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <Label className="text-gray-600">Gender</Label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male ♂️</option>
              <option value="female">Female ♀️</option>
              <option value="other">Other 🌈</option>
            </select>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 font-semibold shadow-md"
          >
            Save Changes
          </Button>
        </form>

        {/* Profile Preview Card */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center">
          <img
            src={
              preview ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-pink-400 shadow-lg"
          />
          <h3 className="mt-4 text-xl font-bold text-gray-800">
            {formData.username}
          </h3>
          <p className="text-gray-600 italic">
            {formData.bio || "No bio yet..."}
          </p>
          <span className="mt-2 px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full">
            {formData.gender || "Not specified"}
          </span>

          {/* Fancy Followers/Following (from Redux if you have it) */}
          <div className="flex gap-6 mt-4 text-center">
            <div>
              <p className="font-bold text-gray-800">
                {user?.posts?.length || 0}
              </p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">
                {user?.followers?.length || 0}
              </p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">
                {user?.following?.length || 0}
              </p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
