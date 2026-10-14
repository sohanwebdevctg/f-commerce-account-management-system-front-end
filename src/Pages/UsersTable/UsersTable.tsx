import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

//get all user data (The reason for calling this outside the function is to prevent repeated re-renders and ensure that the view doesn't reload every time a change is made)
const getAllUsers = async (isDeleted: boolean, searchTerm: string) => {
  const response = await axiosInstance.get(`/users?isDeleted=${isDeleted}&searchTerm=${searchTerm}`);
  return response.data;
}

// update user role
const updateUserRole = async ({ id, role }: { id: string; role: string }) => {
  const response = await axiosInstance.patch(`/users/${id}/role`, { role });
  return response.data;
};

// update user status
const updateUserStatus = async ({ id, status }: { id: string; status: string }) => {
  const response = await axiosInstance.patch(`/users/${id}/status`, { status });
  return response.data;
};

// delete user (soft delete)
const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

// restore user
const restoreUser = async (id: string) => {
  const response = await axiosInstance.patch(`/users/${id}/restore`);
  return response.data;
};

const UsersTable = () => {
  // declare tab state (true = Active Users, false = Deleted/Trash)
  const [activeTab, setActiveTab] = useState<boolean>(() => {
  const savedTab = localStorage.getItem("activeTab");
  return savedTab !== null ? JSON.parse(savedTab) : true;});
  // handle tab function
  const handleTabChange = (status: boolean) => {
  setActiveTab(status);
  localStorage.setItem("activeTab", JSON.stringify(status));};

  // SweetAlert Toast Notification Config
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });

  const {role, id, token, email} = useAuth();

  // search state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // TanStack Query
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["users", activeTab, searchTerm],
    queryFn: () => getAllUsers(!activeTab, searchTerm)
  });


    // Role Update Mutation
    const queryClient = useQueryClient();
    const { mutate: updateRoleMutation } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      // Automatically reloading/refreshing data by invalidating the cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // show toast
      Toast.fire({ icon: "success", title: data?.message || "User role updated successfully!"});
    },
    onError: (error: any) => {
      // show toast
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update role!"});
    },
  });

  // Status Update Mutation
  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // show toast
      Toast.fire({ icon: "success", title: data?.message || "User status updated successfully!"});
    },
    onError: (error: any) => {
        // show toast
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update status!"});
    },
  });

  // Handle Delete Confirmation
const handleDelete = (userId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUserMutation(userId);
    }
  });
};

  // Delete User Mutation
  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // show toast
      Toast.fire({ icon: "success", title: data?.message || "User deleted successfully!"});
    },
    onError: (error: any) => {
      // show toast
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to delete user!"});
    },
  });

  // Handle Restore Confirmation
const handleRestore = (userId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to restore this user?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, restore it!",
  }).then((result) => {
    if (result.isConfirmed) {
      restoreUserMutation(userId);
    }
  });
};

  // Restore User Mutation
  const { mutate: restoreUserMutation } = useMutation({
    mutationFn: restoreUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // show toast
      Toast.fire({ icon: "success", title: data?.message || "User restored successfully!"});
    },
    onError: (error: any) => {
      // show toast
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to restore user!"});
    },
  });


  return (
    <div className="p-4 sm:p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200 mt-5">
      {/* Search & Tab Filters Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        
        {/* Search Input (Mobile = full width, SM = auto/w-72) */}
        <div className="w-full lg:w-80">
          <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search by email..." className="input input-bordered input-sm w-full focus:outline-none"/>
        </div>
        {/* createUser */}
        {/* Active vs Deleted Tabs (Mobile = full width, SM = auto) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-base-200 p-1 rounded-xl w-full sm:w-auto">
            <button
    className={`btn bg-red-500 btn-sm text-white ${
      role === "ADMIN" && id && email && token ? "col-span-1" : "col-span-2"
    }`}
    onClick={() => setSearchTerm("")}
  >
    Reset
  </button>
          {/* createUser */}
          {role === "ADMIN" && id && email && token && (
            <Link to="/dashboard/createUser">
              <button className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-none p-4 w-full">
                CreateUser
              </button>
            </Link>
          )}

          <button onClick={() => handleTabChange(true)} className={`btn btn-sm border-none rounded-lg text-xs flex-1 sm:flex-initial transition-all ${activeTab ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" : "bg-transparent text-base-content/70 hover:bg-base-300"}`}>Users</button>
          <button onClick={() => handleTabChange(false)} className={`btn btn-sm border-none rounded-lg text-xs flex-1 sm:flex-initial transition-all ${ !activeTab ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"   : "bg-transparent text-base-content/70 hover:bg-base-300"}`}>Deleted</button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto w-full rounded-xl border border-base-200">
        <table className="table w-full bg-base-100">
          {/* Table Head */}
          <thead className="bg-base-200/50 text-base-content/70 text-xs uppercase">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Profile</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          {activeTab ? (
            /* ================= ACTIVE USERS TABLE BODY ================= */
            <tbody>
              {isLoading ? (<tr><td colSpan={6} className="text-center py-4 text-green-500">Loading users...</td></tr>) : isError ? ( <tr> <td colSpan={6} className="text-center py-4 text-error"> Error loading users!</td></tr>) : !data?.data || data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                    No users found! <span className="text-red-500">Please Reset</span>
                  </td>
                </tr>
              ) : data?.data?.map((user: any, index: number) => <tr key={user.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200">
                <td className="font-semibold text-sm">{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-10 w-10">
                        <img src={user?.profileImage ? user.profileImage : "/empty-person.png"} alt={user.name || "N/A"}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.name || "N/A"}</div>
                      <div className="text-xs text-base-content/60">{user.email}</div>
                    </div>
                  </div>
                </td>
                {/* Role Select Input */}
                  <td>
                  {
                    role === "ADMIN" ? (<select disabled={user.id === id || user.email === email} name="role" defaultValue={user.role} className="select select-bordered select-xs w-28 focus:outline-none" onChange={(e) => updateRoleMutation({ id: user.id, role: e.target.value })}>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="STAFF">STAFF</option>
                  </select>): (<span className="badge badge-ghost font-medium">{user.role}</span>)
                  }
                  </td>
                {/* Status Select Input */}
                <td>
                  {
                    role === "ADMIN" || role === "MODERATOR" ? (<select disabled={user.id === id || user.email === email}  name="status" defaultValue={user.status} className="select select-bordered select-xs w-28 focus:outline-none" onChange={(e) => updateStatusMutation({ id: user.id, status: e.target.value })}>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>) : (<span className="badge badge-ghost font-medium">{user.status}</span>)
                  }
                  
                </td>

                {/* Action Buttons */}
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <Link to={`/dashboard/singleUser/${user.id}`}>
                      <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                        View
                      </button>
                    </Link>
                    
                    <button className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed" disabled={user.id === id || user.email === email} onClick={() => handleDelete(user.id)}>Delete
                    </button>
                  </div>
                </td>
              </tr>)}
            </tbody>
          ) : (
            /* ================= TRASH / DELETED USERS TABLE BODY ================= */
            <tbody>
              {isLoading ? (<tr><td colSpan={6} className="text-center py-4">Loading users...</td></tr>) : isError ? ( <tr> <td colSpan={6} className="text-center py-4 text-error"> Error loading users!</td></tr>) : !data?.data || data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                    No users found! <span className="text-red-500">Please Reset</span>
                  </td>
                </tr>
              ): data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 font-medium">
                    No users found!
                  </td>
                </tr>
              ) : data?.data?.map((user: any, index: number) => <tr key={user.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200">
                <td className="font-semibold text-sm">{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-10 w-10">
                        <img src={user?.profileImage ? user.profileImage : "/empty-person.png"} alt={user.name || "N/A"}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.name || "N/A"}</div>
                      <div className="text-xs text-base-content/60">{user.email}</div>
                    </div>
                  </div>
                </td>
                {/* Readonly Text for Deleted Table */}
                <td className="text-xs font-semibold text-base-content/70">{user.role}</td>
                <td className="text-xs font-semibold text-amber-600">{user.status}</td>
                {/* Restore & View Action Buttons */}
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <Link to={`/dashboard/singleUser/${user.id}`}>
                      <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                        View
                      </button>
                    </Link>
                    <button className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none" onClick={() => handleRestore(user.id)}>Restore</button>
                  </div>
                </td>
              </tr>)}
              
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default UsersTable;