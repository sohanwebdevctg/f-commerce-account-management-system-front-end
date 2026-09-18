import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import Swal from "sweetalert2";

// ডমি ক্যাটাগরি ডাটা
const dummyCategoryData = {
  id: "cat-101",
  name: "Mens Fashion",
};

// Toast Notification Config
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const UpdateCategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // স্টেট
  const [name, setName] = useState<string>(dummyCategoryData.name || "");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setBtnLoading(true);

      // API Call Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Toast নোটিফিকেশন দেখানো হবে এবং নেভিগেট না করে এই পেজেই রেখে দেওয়া হবে
      Toast.fire({
        icon: "success",
        title: "Category updated successfully!",
      });

    } catch (err) {
      setError("Failed to update category. Please try again.");
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
            <BiCategory />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Update Category</h2>
          <p className="text-gray-500 text-sm mt-1">
            Modify the category name and click update
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
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Category Name Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Category Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <BiCategory className="text-lg" />
              </div>
              <input
                type="text"
                placeholder="e.g. Mens Fashion"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-700 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                <span>Updating Category...</span>
              </div>
            ) : (
              <>
                <FaEdit />
                <span>Update Category</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default UpdateCategory;