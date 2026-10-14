import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


//get all categories data (The reason for calling this outside the function is to prevent repeated re-renders and ensure that the view doesn't reload every time a change is made)
const getAllCategories = async (isDeleted: boolean, searchTerm: string) => {
  const response = await axiosInstance.get(`/categories?isDeleted=${isDeleted}&searchTerm=${searchTerm}`);
  return response.data;
}

// update category status
const updateCategoryStatus = async ({ id, status }: { id: string; status: string }) => { const response = await axiosInstance.patch(`/categories/${id}/status`, { status });
  return response.data;
};

// delete category (soft delete)
const deleteCategory = async (id: string) => {
  const response = await axiosInstance.delete(`/categories/${id}`);
  return response.data;
};

// restore category
const restoreCategory = async (id: string) => {
  const response = await axiosInstance.patch(`/categories/${id}/restore`);
  return response.data;
};

const CategoryTable = () => {

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
    queryKey: ["categories", activeTab, searchTerm],
    queryFn: () => getAllCategories(!activeTab, searchTerm)
  });

  // Status Update Mutation
  const queryClient = useQueryClient();
  const { mutate: updateCategoryStatusMutation } = useMutation({
    mutationFn: updateCategoryStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // show toast
      Toast.fire({ icon: "success", title: data?.message || "category status updated successfully!"});
    },
    onError: (error: any) => {
        // show toast
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update status!"});
    },
  });

  // Handle Delete Confirmation
  const handleDelete = (categoryId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategoryMutation(categoryId);
      }
    });
  };


  // Delete Category Mutation
    const { mutate: deleteCategoryMutation } = useMutation({
      mutationFn: deleteCategory,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        // show toast
        Toast.fire({ icon: "success", title: data?.message || "Category deleted successfully!"});
      },
      onError: (error: any) => {
        // show toast
      Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to delete category!"});
      },
    });

    // Handle Restore Confirmation
    const handleRestore = (categoryId: string) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to restore this category?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, restore it!",
      }).then((result) => {
        if (result.isConfirmed) {
          restoreCategoryMutation(categoryId);
        }
      });
    };

    // Restore Category Mutation
      const { mutate: restoreCategoryMutation } = useMutation({
        mutationFn: restoreCategory,
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          // show toast
          Toast.fire({ icon: "success", title: data?.message || "Category restored successfully!"});
        },
        onError: (error: any) => {
          // show toast
        Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to restore category!"});
        },
      });

  return (
    <div className="p-4 sm:p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200 mt-5">
        {/* Search & Tab Filters Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            
            {/* Search Input (Mobile = full width, SM = auto/w-72) */}
            <div className="w-full lg:w-80">
              <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search by name..." className="input input-bordered input-sm w-full focus:outline-none"/>
            </div>
            {/* createUser */}
            {/* Active vs Deleted Tabs (Mobile = full width, SM = auto) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-base-200 p-1 rounded-xl w-full sm:w-auto">
              <button className="btn bg-red-500 btn-sm text-white" onClick={() => setSearchTerm("")}>Reset</button>
              {/* createUser */}
            {(role === "ADMIN" || role === "MODERATOR") && id && email && token && (
              <Link to="/dashboard/createCategory">
                <button className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-none p-4 w-full">
                  CreateCategory
                </button>
              </Link>
            )}
              <button onClick={() => handleTabChange(true)} className={`btn btn-sm border-none rounded-lg text-xs flex-1 sm:flex-initial transition-all ${activeTab ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" : "bg-transparent text-base-content/70 hover:bg-base-300"}`}>Category</button>
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
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
    
              {/* Table Body */}
              {activeTab ? (
                /* ================= ACTIVE USERS TABLE BODY ================= */
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">Loading categories...</td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-error">Error loading categories!</td>
                    </tr>
                  ) : data?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                        No active categories found! <span className="text-red-500">Please Reset</span>
                      </td>
                    </tr>
                  ) : (
                    data?.data?.map((category: any, index: number) => (
                      <tr key={category.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200">
                        <td className="font-semibold text-sm">{index + 1}</td>
                        
                        {/* Name */}
                        <td className="font-semibold text-sm">{category.name}</td>
                        
                        {/* Product Count */}
                        <td className="font-semibold text-sm">{category._count?.products || 0}</td>
                        
                        {/* Status */}
                        <td>
                          <select defaultValue={category.status} name="categoryStatus" className="select select-bordered select-xs w-28 focus:outline-none"
                          onChange={(e) => updateCategoryStatusMutation({ id: category.id, status: e.target.value })}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                          </select>
                        </td>
                        {/* Action Buttons */}
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <Link to={`/dashboard/singleCategory/${category.id}`}>
                              <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                                View
                              </button>
                            </Link>
                            <button className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none" onClick={() => handleDelete(category.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              ) : (
                /* ================= TRASH / DELETED USERS TABLE BODY ================= */
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">Loading categories...</td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-error">Error loading categories!</td>
                    </tr>
                  ) : data?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                        No deleted categories found! <span className="text-red-500">Please Reset</span>
                      </td>
                    </tr>
                  ) : (
                    data?.data?.map((category: any, index: number) => (
                      <tr key={category.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200">
                        <td className="font-semibold text-sm">{index + 1}</td>
                        
                        {/* Name */}
                        <td className="font-semibold text-sm">{category.name}</td>
                        
                        {/* Product Count */}
                        <td className="font-semibold text-sm">{category._count?.products || 0}</td>
                        
                        {/* Status */}
                        <td>
                          <td className="text-xs font-semibold text-base-content/70">{category.status}</td>
                        </td>
                        
                        {/* Action Buttons */}
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <Link to={`/dashboard/singleCategory/${category.id}`}>
                              <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                                View
                              </button>
                            </Link>
                            <button className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none" onClick={() => handleRestore(category.id)}>
                              Restore
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>)}
            </table>
          </div>
    </div>
  );
};

export default CategoryTable;