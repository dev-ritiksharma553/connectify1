// RightSideBar.jsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const { suggestedUser } = useSelector((store) => store.auth);
  
  return (
    <aside className=" w-full md:w-80 lg:w-[350px] mt-6 lg:mt-0 lg:sticky lg:top-6 px-2 lg:px-0">
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage className="object-cover" src={user.profilePicture} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <Link to={`/profile/${user?._id}`}>
            <div>
              <p className="font-semibold text-sm">{user.username}</p>
              {/* <p className="text-gray-500 text-xs">{user.username}</p> */}
            </div>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-500 text-xs font-semibold"
        >
          Switch
        </Button>
      </div>

      {/* Suggestions Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-sm font-semibold">Suggestions for you</p>
        <button className="text-xs font-semibold hover:underline">
          See All
        </button>
      </div>

      {/* Suggestions List */}
      <div className="flex flex-col gap-3 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2">
        {suggestedUser.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage className="object-cover"
                  src={user?.profilePicture}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Link to={`/profile/${user?._id}`}>
                <div>
                  <p className="text-sm font-semibold">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.username?.toLowerCase()}</p>
                </div>
              </Link>

            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 text-xs font-semibold hover:bg-blue-50"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Card className="mt-6 shadow-none border-none bg-transparent">
        <CardHeader className="p-0">
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
            <span>About</span>
            <span>Help</span>
            <span>Press</span>
            <span>API</span>
            <span>Jobs</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Locations</span>
            <span>Language</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} INSTACLONE FROM META
          </p>
        </CardContent>
      </Card>
    </aside>
  );
};

export default RightSideBar;
