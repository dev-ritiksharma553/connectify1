import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
// import { Socket } from "socket.io-client";

const useGetRTM = () => {
  const { selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const {messages} = useSelector((store)=>store.chat)
  const {socket} = useSelector((store)=>store.socketio);

  useEffect(() => {

        socket?.on('newMessage',(newMessage)=>{
            dispatch(setMessages([...messages,newMessage]));
        })
        return ()=>{
            socket?.off('newMessage');
        }
  
  }, [messages,setMessages]); // ✅ include selectedUser
};

export default useGetRTM;
