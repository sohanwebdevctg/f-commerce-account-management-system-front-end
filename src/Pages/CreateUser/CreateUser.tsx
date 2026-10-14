import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";

const CreateUser = () => {


  // state
  const [showPassword, setShowPassword] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);

  // SweetAlert Toast Notification Config
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

  // call user api from tanstack query
  const {mutate: usersMutation} = useMutation({
    mutationFn: async(data: {name: string; email: string; password: string; role: string; status: string}) => {
      const response = await axiosInstance.post('/users', data)
      return response.data;
    },
    onSuccess: (data) => {
      // show toast
      Toast.fire({ icon: "success", title: data.message});
      setTimeout(() => {
          setActiveBtn(false);
        }, 1500);
    },
    onError: (error: any) => {
      // show toast
    Toast.fire({ icon: "error", title: error.response?.data?.message || error.message});
    setTimeout(() => {
          setActiveBtn(false);
        }, 1500);
    }
  });

  // handleSubmit
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLInputElement).value;
    const status = (form.elements.namedItem("status") as HTMLInputElement).value;

    // call tanstackQuery mutation
    setActiveBtn(true);
    usersMutation({name,email, password, role, status});
    form.reset();
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-2">Create User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <input type="text" name="name" placeholder="enter your name" className="input w-full"/>
              </div>
            </div>
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
            {/* role */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Role</span>
              </label>
              <div className="relative">
                <select name="role" defaultValue="STAFF" className="select select-md w-full">
                  <option value="ADMIN">ADMIN</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </div>
            </div>
            {/* status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <div className="relative">
                <select name="status" defaultValue="APPROVED" className="select select-md w-full">
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            {/* submit */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full"  disabled={activeBtn}>{activeBtn ? "Created..." : "Create User"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;