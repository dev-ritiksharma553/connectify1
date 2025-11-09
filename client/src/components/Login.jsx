import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAuthSlice } from "@/redux/authSlice";
import { toast } from "sonner";

const Login = () => {
  const dispatch = useDispatch();
    const user = useSelector((store)=>store.auth.user);

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:7000/user/login",
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        console.log(response.data.user);
        dispatch(setAuthSlice(response?.data?.user));
        navigate('/');
        setFormData({ email: "", password: "" });
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
    useEffect(()=>{
      if(user){
        navigate('/');
      }
    },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow-md bg-white border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-700 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-900 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
