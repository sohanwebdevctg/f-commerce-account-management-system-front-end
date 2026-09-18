import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  FaArrowLeft, 
  FaUserPlus, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUserShield, 
  FaCheckCircle 
} from "react-icons/fa";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------
// TypeScript Interfaces & Types
// ----------------------------------------------------------------------
export type UserRole = "ADMIN" | "MODERATOR" | "STAFF";
export type UserStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface ICreateUserData {
  email: string;
  role: UserRole;
  status: UserStatus;
  password: string;
}

// 초기 Initial Form State
const initialFormState: ICreateUserData = {
  email: "",
  role: "STAFF",
  status: "APPROVED",
  password: "",
};

// SweetAlert Toast Notification Config
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  // ফর্ম স্টেট
  const [formData, setFormData] = useState<ICreateUserData>(initialFormState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    // ভ্যালিডেশন
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setBtnLoading(true);

      // API Call Simulation (১৫০০ মি.সে. লেটেন্সি)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ১. সফল মেসেজের সুইট অ্যালার্ট টোস্ট শো
      Toast.fire({
        icon: "success",
        title: "User created successfully!",
      });

      // ২. ফর্মের সব ইনপুট আগের মতো রিসেট/খালি করা
      setFormData(initialFormState);
      setShowPassword(false);

    } catch (err) {
      setError("Failed to create user. Please try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
        
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

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 border-4 border-emerald-100 shadow-sm">
            <FaUserPlus />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the credentials to onboard a new system user
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateUser} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaEnvelope className="text-base" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="user@store.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition"
                required
              />
            </div>
          </div>

          {/* Role & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                  <FaUserShield className="text-base" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition cursor-pointer font-medium"
                >
                  <option value="STAFF">STAFF</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                  <FaCheckCircle className="text-base" />
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition cursor-pointer font-medium"
                >
                  <option value="APPROVED">APPROVED (Active)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaLock className="text-base" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Set initial password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
              btnLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg shadow-emerald-200 transform active:scale-[0.99] cursor-pointer"
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
                <span>Creating User...</span>
              </div>
            ) : (
              <>
                <FaUserPlus />
                <span>Create User</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateUser;