import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { AxiosError } from "axios";
import { useAuth, type User } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axiosInstance";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

  // api calling
  const { mutate: handleLogin, isPending, error: apiError } = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (responseData) => {
  login(responseData.data.user);
  navigate('/dashboard');
},
  });

  // Form submit handler (UI Test)
  const logFun = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");

  // handling email and password error
  if (!email || !password) {
    setError("Please fill in both email and password");

    setTimeout(() => {
      setError("");
    }, 1000);

    return;
  }

  // The TanStack Query mutation was called
  handleLogin({ email, password });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        
        {/* Header / Brand Icon */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-200 mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Access Portal</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* Error Alert */}
        {/* Error Alert */}
        {(error || (apiError as AxiosError<{ message: string }> )?.response?.data?.message || apiError?.message) && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>
              {error || (apiError as AxiosError<{ message: string }> )?.response?.data?.message || apiError?.message}
            </span>
          </div>
        )}

        <form onSubmit={logFun} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope className="text-sm" />
              </div>
              <input
                type="email" placeholder="user@example.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition"
                name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaLock className="text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button with Custom Loading Spinner */}
          <button  type="submit"  disabled={isPending}  className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${ isPending ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg shadow-red-200 transform active:scale-[0.99]"}`}>
          {isPending ? (<div className="flex items-center gap-2"> <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Logging in...</span></div>) : (<><FaSignInAlt /><span>Log In</span></>)}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;