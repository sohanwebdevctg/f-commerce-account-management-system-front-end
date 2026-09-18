import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCamera, 
  FaArrowLeft, 
  FaSave, 
  FaEye, 
  FaEyeSlash 
} from "react-icons/fa";
import Swal from "sweetalert2";

// Toast Config
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

// ডমি কারেন্ট ইউজার ডাটা
const currentUserData = {
  id: "usr-1",
  name: "Anisur Rahman",
  email: "anis@store.com",
  profileImage: "https://i.pravatar.cc/150?img=11",
};

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // ফর্ম স্টেট
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // পাসওয়ার্ড শো/হাইড স্টেট
  const [name, setName] = useState<string>(currentUserData.name || "");
  const [email, setEmail] = useState<string>(currentUserData.email || "");
  const [password, setPassword] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(currentUserData.profileImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  // ইমেজ সিলেক্ট হ্যান্ডলার
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!name || !email) {
      setError("Please fill in both name and email.");
      return;
    }

    try {
      setBtnLoading(true);

      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success Toast নোটিফিকেশন
      Toast.fire({
        icon: "success",
        title: "Profile updated successfully!",
      });

      // নোট: এখানে কোনো navigate() নেই, ফলে ইউজার বর্তমান ফর্মেই থাকবে।
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
        </div>

        {/* Header / Profile Image */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-3">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-emerald-500 shadow-md mx-auto"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border-4 border-emerald-200 mx-auto shadow-md">
                <FaUser className="text-4xl" />
              </div>
            )}

            {/* Camera Icon Badge */}
            <label
              htmlFor="profile-image-input"
              className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-emerald-700 transition shadow-md"
              title="Change Photo"
            >
              <FaCamera className="text-xs" />
            </label>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            Update your personal details and credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaUser className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Anisur Rahman"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaEnvelope className="text-sm" />
              </div>
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* New Password Input with Eye Toggle Icon */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaLock className="text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 pl-1">Leave blank to keep existing password</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
              btnLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg shadow-red-200 transform active:scale-[0.99] cursor-pointer"
            }`}
          >
            {btnLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Updating Profile...</span>
              </div>
            ) : (
              <>
                <FaSave />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;