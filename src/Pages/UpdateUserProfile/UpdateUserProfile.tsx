import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router";

// get user profile data
const getUserProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data?.data;
};

const UpdateUserProfile = () => {
  // state
  const [showPassword, setShowPassword] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);
  const navigate = useNavigate();

  // tanstack query
  const { data: user } = useQuery({
  queryKey: ["userProfile"],
  queryFn: getUserProfile,
  });


  // SweetAlert Toast Notification Config
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

  // call user api from tanstack query
  const { mutate: usersMutation } = useMutation({
  mutationFn: async (data: { 
    name: string; 
    email: string; 
    password?: string; 
    profileImage: File | null 
  }) => {
    // api call
    const response = await axiosInstance.patch('/users/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data'}});
      return response.data;
    },
  onSuccess: (data) => {
    Toast.fire({ icon: "success", title: data.message });
    setTimeout(() => { 
      setActiveBtn(false); 
      navigate('/dashboard/userProfile');
    }, 1500);
  },
  onError: (error: any) => {
    Toast.fire({ icon: "error", title: error.response?.data?.message || error.message });
    setTimeout(() => { setActiveBtn(false); }, 1500);
  }
});

  // handleSubmit
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    // To capture the image file
    const imageInput = form.elements.namedItem("profileImage") as HTMLInputElement;
    const profileImageFile = imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;

    const updateData = {
    name,
    email,
    password: password || undefined,
    profileImage: profileImageFile,
  };

    // call tanstackQuery mutation
    setActiveBtn(true);
    usersMutation(updateData);
  }



  return (
    <div className="mt-10 flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-2">Update User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <input type="text" name="name" defaultValue={user?.name || ""} placeholder="update your name" className="input w-full"/>
              </div>
            </div>
            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input type="email" name="email" defaultValue={user?.email || ""}  placeholder="update your valid email" className="input w-full" />
              </div>
            </div>
            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="enter your password" className="input input-bordered w-full pr-10"/>
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content cursor-pointer" onClick={() => setShowPassword(!showPassword)}
                >{showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            {/* profileImage */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Profile Image</span>
              </label>
              <div className="relative">
                <input type="file" name="profileImage" className="file-input file-input-md w-full" />
              </div>
            </div>
            {/* previousImage */}
            <div className="form-control">
              <img src={user?.profileImage || "/empty-person.png"} className="w-full h-32"></img>
            </div>
            {/* submit */}
            <div className="form-control mt-6 flex gap-1">
              <button type="button" onClick={() => navigate('/dashboard/userProfile')} className="btn bg-rose-600 text-white w-1/2" >Back</button>
              <button type="submit" className="btn bg-emerald-600 text-white w-1/2 "  disabled={activeBtn}>{activeBtn ? "Updated..." : "Update"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;