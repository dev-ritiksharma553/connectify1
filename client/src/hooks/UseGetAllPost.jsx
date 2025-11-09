import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPostSlice } from "@/redux/postSlice";
import axios from "axios";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const response = await axios.get("http://localhost:7000/post/all", {
          withCredentials: true,
        });
        if (response.data.success) {
         
          dispatch(setPostSlice(response.data.posts)); // use dispatch here
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchAllPost();
  }, [dispatch]); 
};

export default useGetAllPost;
