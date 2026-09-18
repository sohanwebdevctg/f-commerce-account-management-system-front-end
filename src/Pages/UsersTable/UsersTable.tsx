import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrash, FaUserShield, FaChevronLeft, FaChevronRight, FaTimes, FaUser, FaPlus,FaUndo,FaUsers,FaUserSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

/* ----------------------------------------------------------------------
   [FUTURE INTEGRATION IMPORTS - COMMENTED OUT]
   ভবিষ্যতে TanStack Query ও Axios ব্যবহার করতে চাইলে এগুলো আনকমেন্ট করবেন:
   
   import axios from "axios";
   import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
---------------------------------------------------------------------- */

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------
export type UserRole = "ADMIN" | "MODERATOR" | "STAFF";
export type UserStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: UserRole;
  status: UserStatus;
  createdOrdersCount: number;
  isDeleted: boolean;
}

// ----------------------------------------------------------------------
// Dummy Initial Data (আপাতত টেস্ট করার জন্য)
// ----------------------------------------------------------------------
const INITIAL_DUMMY_USERS: IUser[] = [
  { id: "usr-1", name: "Anisur Rahman", email: "anis@store.com", profileImage: "https://i.pravatar.cc/150?img=11", role: "MODERATOR", status: "PENDING", createdOrdersCount: 45, isDeleted: false },
  { id: "usr-2", name: "Mehedi Hasan", email: "mehedi@store.com", profileImage: null, role: "STAFF", status: "PENDING", createdOrdersCount: 0, isDeleted: false },
  { id: "usr-3", name: "Tanvir Ahmed", email: "tanvir@store.com", profileImage: "https://i.pravatar.cc/150?img=13", role: "STAFF", status: "REJECTED", createdOrdersCount: 2, isDeleted: true },
];

// Logged In User Config
const CURRENT_LOGGED_IN_USER = {
  id: "usr-1",
  role: "ADMIN" as UserRole
};

// Toast Notification Config
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

/* ----------------------------------------------------------------------
   [FUTURE AXIOS & API SETUP - COMMENTED OUT]
   
   const axiosInstance = axios.create({ baseURL: "https://api.example.com" });
   const fetchUsersApi = async () => (await axiosInstance.get("/users")).data;
   const updateRoleApi = async ({ userId, role }) => await axiosInstance.patch(`/users/${userId}/role`, { role });
---------------------------------------------------------------------- */

const UsersTable: React.FC = () => {
  const navigate = useNavigate();

  // 1. Local State (ডামি ডাটা দিয়ে স্টেট হ্যান্ডলিং)
  const [users, setUsers] = useState<IUser[]>(INITIAL_DUMMY_USERS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"ACTIVE" | "DELETED">("ACTIVE");
  const itemsPerPage: number = 5;

  /* ----------------------------------------------------------------------
     [FUTURE TANSTACK QUERY HOOKS - COMMENTED OUT]
     
     const queryClient = useQueryClient();
     const { data: users = [], isLoading } = useQuery({ queryKey: ["users"], queryFn: fetchUsersApi });
     const roleMutation = useMutation({
       mutationFn: updateRoleApi,
       onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
     });
  ---------------------------------------------------------------------- */

  // Handlers (স্থানীয়ভাবে ডাটা আপডেট ও Toast দেখানোর জন্য)
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    Toast.fire({ icon: "success", title: `Role updated to ${newRole}` });
  };

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    Toast.fire({ icon: "success", title: `Status updated to ${newStatus}` });
  };

  // Delete Handler with Modal Confirmation
  const handleDeleteUser = (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are moving this user to the trash list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-bold px-4 py-2",
        cancelButton: "rounded-xl font-bold px-4 py-2"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isDeleted: true } : u)));
        Toast.fire({ icon: "success", title: "User moved to trash" });
      }
    });
  };

  const handleRestoreUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isDeleted: false } : u)));
    Toast.fire({ icon: "success", title: "User activated successfully!" });
  };

  // Filter Users Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = viewMode === "DELETED" ? user.isDeleted : !user.isDeleted;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredUsers.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-4 max-w-7xl mx-auto">
      {/* SECTION 1: HEADER CARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
            <FaUserShield />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">System Users</h2>
            <p className="text-xs text-gray-400 font-medium">Manage admin, moderator, and staff roles</p>
          </div>
        </div>

        <button 
          onClick={() => navigate("/dashboard/users/create")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer shrink-0"
        >
          <FaPlus className="text-xs" />
          <span>Add User</span>
        </button>
      </div>

      {/* SECTION 2: SEARCH BAR & TAB TOGGLE */}
<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm">
  
  {/* Search Bar */}
  <div className="relative w-full lg:w-80">
    <input
      type="text"
      placeholder="Search user name or email..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
    />
    <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
    {searchTerm && (
      <button 
        onClick={() => { setSearchTerm(""); setCurrentPage(1); }} 
        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
      >
        <FaTimes className="text-xs" />
      </button>
    )}
  </div>

  {/* Tab Toggle Buttons */}
  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold w-full lg:w-auto">
    <button
      onClick={() => { setViewMode("ACTIVE"); setCurrentPage(1); }}
      className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
        viewMode === "ACTIVE" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <FaUsers className="text-xs shrink-0" />
      <span className="whitespace-nowrap">Active Users</span>
      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.2 text-[10px] rounded-full shrink-0">
        {users.filter((u) => !u.isDeleted).length}
      </span>
    </button>

    <button
      onClick={() => { setViewMode("DELETED"); setCurrentPage(1); }}
      className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
        viewMode === "DELETED" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <FaUserSlash className="text-xs shrink-0" />
      <span className="whitespace-nowrap">Deleted Users</span>
      <span className="bg-rose-100 text-rose-700 px-1.5 py-0.2 text-[10px] rounded-full shrink-0">
        {users.filter((u) => u.isDeleted).length}
      </span>
    </button>
  </div>

</div>

      {/* SECTION 3: USER TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-gray-50/60 border-b border-gray-100 text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">USER DETAILS</th>
                <th className="py-3.5 px-4">ROLE</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-center">ORDERS</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => {
                  const isSelf = user.id === CURRENT_LOGGED_IN_USER.id;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-semibold text-gray-400">
                        {startIndex + index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                              <FaUser className="text-xs" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-gray-800 leading-tight">{user.name}</p>
                              {isSelf && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded">YOU</span>}
                            </div>
                            <p className="text-[11px] text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* ROLE FIELD */}
                      <td className="py-3 px-4">
                        {user.isDeleted ? (
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{user.role}</span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            className={`text-xs font-bold border rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer ${
                              user.role === "ADMIN"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : user.role === "MODERATOR"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MODERATOR">MODERATOR</option>
                            <option value="STAFF">STAFF</option>
                          </select>
                        )}
                      </td>

                      {/* STATUS FIELD */}
                      <td className="py-3 px-4">
                        {user.isDeleted ? (
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{user.status}</span>
                        ) : (
                          <select
                            value={user.status}
                            onChange={(e) => handleStatusChange(user.id, e.target.value as UserStatus)}
                            className={`text-xs font-bold border rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer ${
                              user.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : user.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-block bg-emerald-50 text-emerald-600 font-bold text-xs px-2.5 py-1 rounded-lg">
                          {user.createdOrdersCount}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/users/${user.id}`} className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-all">
                            <FaEye className="text-xs" /> View
                          </Link>

                          {!user.isDeleted ? (
                            <button onClick={() => handleDeleteUser(user.id)} className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
                              <FaTrash className="text-xs" /> Delete
                            </button>
                          ) : (
                            <button onClick={() => handleRestoreUser(user.id)} className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
                              <FaUndo className="text-xs" /> Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-xs font-medium">
                    No {viewMode.toLowerCase()} users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 border-t border-gray-100 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer">
              <FaChevronLeft className="text-xs" />
            </button>
            <span className="px-3 py-1 font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg">
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer">
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;