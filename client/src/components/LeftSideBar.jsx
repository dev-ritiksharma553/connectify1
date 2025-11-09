import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Search,
  TrendingUp,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import { setAuthSlice } from "@/redux/authSlice";
import { setPostSlice } from "@/redux/postSlice";
import { setMessages } from "@/redux/chatSlice";

const menuItems = [
  { name: "Home", icon: <Home size={22} /> },
  { name: "Search", icon: <Search size={22} /> },
  { name: "Trending", icon: <TrendingUp size={22} /> },
  { name: "Messages", icon: <MessageCircle size={22} /> },
  { name: "Notifications", icon: <Heart size={22} /> },
  { name: "Create", icon: <PlusSquare size={22} /> },
  { name: "Logout", icon: <LogOut size={22} /> },
];

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const [isHovered, setIsHovered] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bottomBarItems = ["Home", "Search", "Messages", "Notifications"];

  const handleClick = async (item) => {
    if (item === "Logout") {
      try {
        const response = await axios.get("http://localhost:7000/user/logout", {
          withCredentials: true,
        });
        if (response.data.success) {
          navigate("/login");
          dispatch(setAuthSlice(null));
          dispatch(setPostSlice([]));
          dispatch(setMessages([]));
          toast.success(response.data.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Logout failed");
      }
    } else if (item === "Create") {
      setOpenCreatePost(true);
    } else if (item === "Home") {
      navigate("/");
    } else if (item === "Messages") {
      navigate("/chat");
    } else if (item === "Notifications") {
      navigate("/notification"); // ✅ direct navigate
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          isHovered ? "w-56" : "w-20"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <span className="text-xl font-bold">{isHovered ? "MyApp" : "M"}</span>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col mt-4 gap-2 relative">
          {menuItems.map((item) => (
            <div key={item.name} className="relative">
              <button
                className="flex items-center gap-4 px-4 py-3 rounded-lg mx-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 w-full"
                onClick={() => handleClick(item.name)}
              >
                {item.icon}
                {isHovered && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}

                {/* Badge */}
                {item.name === "Notifications" &&
                  likeNotification.length > 0 && (
                    <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
              </button>
            </div>
          ))}
        </nav>

        <div className="flex-1"></div>

        {/* User Profile */}
        <div className="flex items-center gap-4 px-4 py-3 mx-2">
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage
                className="object-cover"
                src={user?.profilePicture || "/default-avatar.png"}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
          {isHovered && (
            <span className="text-lg font-medium text-gray-800">
              {user?.username || "User"}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex lg:hidden justify-around p-2">
        {menuItems
          .filter((item) => bottomBarItems.includes(item.name))
          .map((item) => (
            <button
              key={item.name}
              className="flex flex-col items-center text-gray-700 hover:text-blue-500 relative"
              onClick={() => handleClick(item.name)}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>

              {/* Mobile badge */}
              {item.name === "Notifications" &&
                likeNotification.length > 0 && (
                  <span className="absolute top-0 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>
          ))}

        {/* More */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center text-gray-700 hover:text-blue-500"
          >
            <MoreHorizontal size={22} />
            <span className="text-xs">More</span>
          </button>

          {showMoreMenu && (
            <div className="absolute bottom-10 right-0 w-40 bg-white border border-gray-200 shadow-lg rounded-md flex flex-col z-50">
              {menuItems
                .filter((item) => !bottomBarItems.includes(item.name))
                .map((item) => (
                  <button
                    key={item.name}
                    className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      handleClick(item.name);
                      setShowMoreMenu(false);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* CreatePost Modal */}
      {openCreatePost && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpenCreatePost(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-2 p-5 relative transition-transform transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <CreatePost
              user={user}
              onClose={() => setOpenCreatePost(false)}
              onPost={(data) => console.log("Post data:", data)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
