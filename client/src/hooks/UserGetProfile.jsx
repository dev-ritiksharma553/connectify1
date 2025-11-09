import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/user/profile/${userId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
            console.log(response.data.user)
          dispatch(setUserProfile(response.data.user));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;
