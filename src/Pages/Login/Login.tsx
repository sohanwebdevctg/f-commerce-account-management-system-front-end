import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { axiosInstance } from "../../api/axiosInstance";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {

  // context
  const { setAuthData } = useAuth();
  // state
  const [showPassword, setShowPassword] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);
  const navigate = useNavigate();

  // SweetAlert Toast Notification Config
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

    // call login api from tanstack query
    const {mutate: loginMutation} = useMutation({
    mutationFn: async (data: {email: string; password: string}) => {
      const response = await axiosInstance.post('/auth/login', data)
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Login Successful! Response Data:', data);
      // set user data in localStorage
      const userData = data.data;
      if(userData?.token && userData?.id && userData?.email && userData?.role){

        // set data in localstorage
        setAuthData(userData.token, userData.id, userData.email, userData.role);
      }

      // show toast
      Toast.fire({ icon: "success", title: data.message});
      // navigate
      navigate('/dashboard');
    },
    onError: (error: any) => {
    // show toast
    Toast.fire({ icon: "error", title: error.response?.data?.message || error.message});
    setActiveBtn(false);
  },
});

  // handleSubmit
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {

    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    // call tanstackQuery mutation
    setActiveBtn(true);
    loginMutation({email, password});
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input type="email" name="email" placeholder="enter your valid email" className="input w-full" required/>
              </div>
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="enter your password" className="input input-bordered w-full pr-10" required/>
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content cursor-pointer" onClick={() => setShowPassword(!showPassword)}
                >{showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* submit */}
            <div className="form-control mt-6">
              <button type="submit" className="btn w-full text-white bg-red-500 hover:bg-green-500 duration-200"  disabled={activeBtn}>{activeBtn ? "Logging in..." : "Login"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;