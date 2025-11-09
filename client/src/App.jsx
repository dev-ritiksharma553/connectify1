import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";

import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUser } from "./redux/chatSlice";
import { setSocket } from "./redux/socketSlice";
import { setLikeNotification } from "./redux/notiSlice";
import NotificationPage from "./components/NotificationPage";
import ProtectedRoutes from "./components/ProtectedRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes> <MainLayout /> </ProtectedRoutes>,
    children: [
      { path: "/", element:<ProtectedRoutes> <Home /> </ProtectedRoutes>  },
      { path: "/profile/:id", element: <ProtectedRoutes> <Profile /> </ProtectedRoutes> },
      { path: "/account/edit", element: <ProtectedRoutes> <EditProfile /> </ProtectedRoutes>  },
      { path: "/chat", element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>  },
      { path: "/notification", element: <ProtectedRoutes><NotificationPage /> </ProtectedRoutes> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  // 1️⃣ Create socket and save in Redux
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:7000", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    }
  }, [user, dispatch]);

  // 2️⃣ Listen to notifications from Redux socket
  useEffect(() => {
    if (socket) {
      socket.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [socket, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
