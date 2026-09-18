import React from "react";
import { useParams, Link } from "react-router";
import { FaArrowLeft, FaEdit, FaEnvelope, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaShoppingBag,FaUser,FaBoxOpen,FaTags
} from "react-icons/fa";

// ----------------------------------------------------------------------
// TypeScript Types
// ----------------------------------------------------------------------
export type UserRole = "ADMIN" | "MODERATOR" | "STAFF";
export type UserStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface IUserDetail {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: UserRole;
  status: UserStatus;
  createdOrdersCount: number;
  createdCategoriesCount: number;
  createdProductsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// Mock Data (ডেভেলপমেন্ট টেস্টের জন্য)
// ----------------------------------------------------------------------
const mockUser: IUserDetail = {
  id: "usr-1",
  name: "Anisur Rahman",
  email: "anis@store.com",
  profileImage: "https://i.pravatar.cc/150?img=11",
  role: "ADMIN",
  status: "APPROVED",
  createdOrdersCount: 45,
  createdCategoriesCount: 8,
  createdProductsCount: 32,
  createdAt: "2026-01-10",
  updatedAt: "2026-02-28",
};

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  /* 
  ======================================================================
  🔴 [REAL BACKEND / AUTH CONTEXT LOGIC] - (এপিআই ইন্টিগ্রেশনের সময় এটি ব্যবহার করবেন)
  ======================================================================
  // const { user: currentUser } = useAuth(); // Logged-in User
  // const { data: profileUser } = useGetUserByIdQuery(id); // Fetch User API
  
  // const isSelf = currentUser?.id === id;
  // const displayUser = isSelf ? currentUser : profileUser;
  ======================================================================
  */

  // আপাতত টেস্টিং ডাটা
  const displayUser = mockUser;

  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-5 max-w-5xl mx-auto">
      {/* ব্যাক বাটন ও আপডেট বাটন হেডার */}
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/dashboard/users"
          className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <FaArrowLeft className="text-xs" /> Back
        </Link>

        {/* 
          ======================================================================
          🔴 [REAL SECURITY LOGIC] - (এপিআই নিয়ে কাজ করার সময় এটি আন-কমেন্ট করবেন)
          ======================================================================
          [SECURITY LOGIC]: শুধু নিজের প্রোফাইল (isSelf === true) হলেই Update Profile বাটনটি দেখাবে।
          অন্যদের প্রোফাইল দেখার সময় এটি হাইড থাকবে।
        */}
        {/* {isSelf && (
          <Link
            to={`/dashboard/users/edit/${id || displayUser.id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <FaEdit className="text-xs" /> Update Profile
          </Link>
        )} */}

        {/* 
          ======================================================================
          🟢 [TEMPORARY / CURRENT VIEW] - (এখন এটি দেখাবে, এপিআই এলে বাদ দিবেন)
          ======================================================================
        */}
        <Link
          to={`/dashboard/users/edit/${id || displayUser.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <FaEdit className="text-xs" /> Update Profile
        </Link>
      </div>

      {/* ইউজার মেইন ইনফো কার্ড */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        {/* প্রোফাইল হেডার (ছবি, নাম, ইমেইল, রোল ও স্ট্যাটাস) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-gray-100">
          {displayUser.profileImage ? (
            <img
              src={displayUser.profileImage}
              alt={displayUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border-2 border-emerald-200">
              <FaUser className="text-3xl" />
            </div>
          )}

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{displayUser.name}</h3>

            <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
              <FaEnvelope className="text-emerald-500 text-xs" /> {displayUser.email}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              {/* Role Badge */}
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  displayUser.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : displayUser.role === "MODERATOR"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                ROLE: {displayUser.role}
              </span>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                  displayUser.status === "APPROVED"
                    ? "bg-emerald-100 text-emerald-700"
                    : displayUser.status === "PENDING"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {displayUser.status === "APPROVED" && <FaCheckCircle className="text-xs" />}
                {displayUser.status === "PENDING" && <FaHourglassHalf className="text-xs" />}
                {displayUser.status === "REJECTED" && <FaTimesCircle className="text-xs" />}
                {displayUser.status}
              </span>
            </div>
          </div>
        </div>

        {/* অ্যাক্টিভিটি স্ট্যাটস কার্ডস */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            User Activity & Contributions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-[11px]">Created Orders</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">{displayUser.createdOrdersCount}</p>
              </div>
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
                <FaShoppingBag className="text-base" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-[11px]">Created Products</p>
                <p className="text-lg font-bold text-blue-600 mt-0.5">{displayUser.createdProductsCount}</p>
              </div>
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                <FaBoxOpen className="text-base" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-[11px]">Created Categories</p>
                <p className="text-lg font-bold text-purple-600 mt-0.5">{displayUser.createdCategoriesCount}</p>
              </div>
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg">
                <FaTags className="text-base" />
              </div>
            </div>
          </div>
        </div>

        {/* অ্যাকাউন্ট ইনফরমেশন ও ডেট ডিটেইলস */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <FaCalendarAlt className="text-emerald-500 text-base shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Account Created</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">{displayUser.createdAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <FaCalendarAlt className="text-blue-500 text-base shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Last Updated</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">{displayUser.updatedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;