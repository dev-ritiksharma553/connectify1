import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPostSlice } from "@/redux/postSlice";
import axios from "axios";
import { setSuggestedUser } from "@/redux/authSlice";

const useGetAllSuggestedUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const response = await axios.get("http://localhost:7000/user/suggesteduser", {
          withCredentials: true,
        });
        if (response.data.success) {
       
            dispatch(setSuggestedUser(response?.data?.users))
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchAllUser();
  }, [dispatch]); 
};

export default useGetAllSuggestedUser;
