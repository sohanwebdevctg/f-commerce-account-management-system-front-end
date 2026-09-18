import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { 
  FaArrowLeft, 
  FaEdit, 
  FaCalendarAlt, 
  FaBoxes, 
  FaClock 
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";

export interface ICategoryDetails {
  id: string;
  name: string;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ডমি সিঙ্গেল ক্যাটাগরি ডাটা
const mockCategoryData: ICategoryDetails = {
  id: "cat-101",
  name: "Mens Fashion",
  productsCount: 42,
  createdAt: "2026-01-15",
  updatedAt: "2026-02-28",
};

const CategoryDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // ডমি রোল (ADMIN এবং MODERATOR আপডেট বাটন দেখতে পাবে)
  const [currentUserRole] = useState<"ADMIN" | "MODERATOR" | "STAFF">("ADMIN");
  const [category] = useState<ICategoryDetails>(mockCategoryData);

  const canModify = currentUserRole === "ADMIN" || currentUserRole === "MODERATOR";

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Bar: Back Button & Update Button */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-100 transition cursor-pointer"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>

          {canModify && (
            <button
              onClick={() => navigate(`/dashboard/categories/edit/${id || category.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-100 transition cursor-pointer"
            >
              <FaEdit className="text-xs" /> Update Category
            </button>
          )}
        </div>

        {/* Category Profile Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Main Info Section (ID Removed) */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-emerald-100">
                <BiCategory />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
              </div>
            </div>
          </div>

          {/* Stats & Metadata Grid */}
          <div className="p-6 sm:p-8 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Category Summary & Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Total Products Count */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Products</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{category.productsCount}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FaBoxes className="text-lg" />
                </div>
              </div>

              {/* Created Date */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Created At</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{category.createdAt}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FaCalendarAlt className="text-lg" />
                </div>
              </div>

              {/* Last Updated Date */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Last Updated</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{category.updatedAt}</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <FaClock className="text-lg" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CategoryDetails;