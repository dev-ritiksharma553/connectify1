import React, { useState } from "react";
import { Bookmark, Grid3X3, Heart, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import UserGetProfile from "@/hooks/UserGetProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const params = useParams();
  const userId = params.id;

  // Fetch user profile via hook
  UserGetProfile(userId);

  const currentUser = useSelector((store) => store.auth.user) || { _id: "1", username: "current_user" };
  const userProfile = useSelector((store) => store.auth.userProfile) || {
    _id: "2",
    username: "sample_user",
    profilePicture: "https://source.unsplash.com/300x300/?portrait",
    bio: "This is a sample bio for testing.",
    posts: Array.from({ length: 6 }, (_, i) => ({
      _id: i + "",
      image: `https://source.unsplash.com/500x500/?nature,${i}`,
      likes: Array.from({ length: Math.floor(Math.random() * 100) }),
      comments: Array.from({ length: Math.floor(Math.random() * 10) }),
      caption: `Sample caption ${i + 1}`,
    })),
    followers: Array.from({ length: 20 }),
    followings: Array.from({ length: 10 }),
    bookmarks: [],
    isFollowed: false,
  };

  const isOwnProfile = currentUser._id === userProfile._id;
  const [activeTab, setActiveTab] = useState("Posts");

  const getTabContent = () => {
    if (activeTab === "Posts") return userProfile.posts;
    if (activeTab === "Saved") return userProfile.bookmarks;
    return [];
  };

  return (
    <div className="md:ml-[16%] px-4 md:px-10 max-w-6xl mx-auto pt-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-10">
        <img
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300"
          src={userProfile.profilePicture}
          alt="profile"
        />

        <div className="mt-4 md:mt-0 w-full">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h2 className="text-xl md:text-2xl font-semibold">{userProfile.username}</h2>

            {isOwnProfile ? (
              <>
                <Link to="/account/edit">
                  <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300 flex items-center gap-1">
                    Edit Profile
                  </button>
                </Link>
                <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                  Ad Tools
                </button>
                <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                  Archive
                </button>
              </>
            ) : (
              <>
                <button
                  className={`px-4 py-1 text-sm rounded-md ${
                    userProfile.isFollowed
                      ? "bg-gray-200 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {userProfile.isFollowed ? "Following" : "Follow"}
                </button>
                <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                  Message
                </button>
              </>
            )}
          </div>

          <div className="flex gap-8 text-sm md:text-base mb-2">
            <span>
              <strong>{userProfile.posts?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{userProfile.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{userProfile.followings?.length || 0}</strong> following
            </span>
          </div>

          <div className="text-sm md:text-base">
            <p className="font-medium">{userProfile.username}</p>
            <p className="text-gray-600">{userProfile.bio}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t mt-8 pt-4">
        <div className="flex justify-center gap-8 text-gray-500 text-sm md:text-base font-semibold">
          {["Posts", ...(isOwnProfile ? ["Saved"] : [])].map((tab) => {
            const Icon = tab === "Posts" ? Grid3X3 : Bookmark;
            return (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1 cursor-pointer px-2 py-1 border-b-2 ${
                  activeTab === tab
                    ? "text-black border-black"
                    : "border-transparent hover:text-black"
                }`}
              >
                <Icon size={18} />
                <span>{tab}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {getTabContent().length > 0 ? (
          getTabContent().map((post, index) => (
            <div
              key={post._id || index}
              className="relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 h-72 bg-white"
            >
              <img
                src={post.image}
                alt={post.caption || `post-${index}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-xl"
              />

              {/* Hover overlay buttons */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none">
                <div className="flex gap-6 bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm pointer-events-auto">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Heart size={20} />
                    <span>{post.likes?.length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <MessageSquare size={20} />
                    <span>{post.comments?.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No {activeTab.toLowerCase()} to show.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
