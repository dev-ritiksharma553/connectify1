import React from "react";
import { useSelector } from "react-redux";

const NotificationPage = () => {
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Notifications</h2>

      {likeNotification.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet 🚫</p>
      ) : (
        <div className="flex flex-col gap-3">
          {likeNotification.map((notif, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-xl shadow-md flex items-center gap-3 hover:bg-purple-50 transition"
            >
              {/* Profile Picture */}
              <img
                src={notif.userDetail.profilePicture}
                alt={notif.userDetail.username}
                className="w-12 h-12 rounded-full border object-cover"
              />

              {/* Notification Text */}
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{notif.username}</span>{" "}
                  {notif.type === "like"
                    ? "❤️ liked your post"
                    : "👎 disliked your post"}
                </p>
                <p className="text-xs text-gray-500">{notif.message}</p>
              </div>

              {/* Time */}
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(notif.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
