import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import axios from "axios";

const useGetAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const {messages} = useSelector((store)=>store.chat)

  useEffect(() => {
    if (!selectedUser?._id) return; // nothing to fetch

    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/message/getallmessage/${selectedUser._id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.messages || []));
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchAllMessages();
  }, [dispatch, selectedUser]); // ✅ include selectedUser
};

export default useGetAllMessages;
