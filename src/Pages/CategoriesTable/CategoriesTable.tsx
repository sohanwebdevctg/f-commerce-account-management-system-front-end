import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FaTrash,
  FaPlus,
  FaSearch,
  FaTimes,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaUndo,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import Swal from "sweetalert2";

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  productsCount: number;
  status: "ACTIVE" | "INACTIVE";
  isDeleted: boolean;
  createdAt: string;
}

const initialCategories: ICategory[] = [
  {
    id: "cat-101",
    name: "Mens Fashion",
    description: "Clothing and accessories for men",
    productsCount: 42,
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2026-01-15",
  },
  {
    id: "cat-102",
    name: "Electronics",
    description: "Gadgets, smartphones and laptops",
    productsCount: 128,
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2026-01-20",
  },
  {
    id: "cat-103",
    name: "Footwear",
    description: "Shoes, sneakers and boots",
    productsCount: 15,
    status: "INACTIVE",
    isDeleted: false,
    createdAt: "2026-02-01",
  },
  {
    id: "cat-104",
    name: "Home Appliances",
    description: "Kitchen and home electrical items",
    productsCount: 0,
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2026-02-10",
  },
  {
    id: "cat-105",
    name: "Books & Stationery",
    description: "Educational books and office supplies",
    productsCount: 8,
    status: "INACTIVE",
    isDeleted: true,
    createdAt: "2026-01-10",
  },
];

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const CategoriesTable: React.FC = () => {
  const navigate = useNavigate();

  const [currentUserRole] = useState<"ADMIN" | "MODERATOR" | "STAFF">("ADMIN");
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"ACTIVE_LIST" | "TRASH">("ACTIVE_LIST");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredCategories = categories.filter((cat) => {
    if (activeTab === "ACTIVE_LIST" && cat.isDeleted) return false;
    if (activeTab === "TRASH" && !cat.isDeleted) return false;

    return cat.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Status Change via Dropdown
  const handleStatusChange = (id: string, newStatus: "ACTIVE" | "INACTIVE") => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    Toast.fire({
      icon: "success",
      title: `Status changed to ${newStatus}`,
    });
  };

  // Soft Delete Handler
  const handleDeleteCategory = (category: ICategory) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete "${category.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-bold px-4 py-2",
        cancelButton: "rounded-xl font-bold px-4 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories((prev) =>
          prev.map((item) =>
            item.id === category.id ? { ...item, isDeleted: true } : item
          )
        );
        Toast.fire({ icon: "success", title: "Category moved to trash" });
      }
    });
  };

  // Restore Handler
  const handleRestoreCategory = (category: ICategory) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === category.id ? { ...item, isDeleted: false } : item
      )
    );
    Toast.fire({ icon: "success", title: "Category restored successfully" });
  };

  const canModify = currentUserRole === "ADMIN" || currentUserRole === "MODERATOR";

  const activeCount = categories.filter((c) => !c.isDeleted).length;
  const trashCount = categories.filter((c) => c.isDeleted).length;

  return (
    <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <BiCategory className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Category Management</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage product categories and monitor inventory counts
              </p>
            </div>
          </div>

          {canModify && (
            <button
              onClick={() => navigate("/dashboard/categories/create")}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-100 cursor-pointer"
            >
              <FaPlus className="text-xs" />
              <span>Add Category</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar (Fixed Layout: stacked up to lg, side-by-side on lg+) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full lg:max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search category name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200/60 transition cursor-pointer"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Right Side Pill Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-gray-100/70 p-1.5 rounded-xl border border-gray-200/50 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab("ACTIVE_LIST");
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "ACTIVE_LIST"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BiCategory className="text-sm shrink-0" />
              <span className="whitespace-nowrap">Active Categories</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-extrabold shrink-0">
                {activeCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("TRASH");
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "TRASH"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaTrash className="text-xs shrink-0" />
              <span className="whitespace-nowrap">Deleted Categories</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-extrabold shrink-0">
                {trashCount}
              </span>
            </button>
          </div>

        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center whitespace-nowrap">#</th>
                  <th className="py-4 px-6 whitespace-nowrap">CATEGORY DETAILS</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">STATUS</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">PRODUCTS</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {currentData.length > 0 ? (
                  currentData.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Index */}
                      <td className="py-4 px-6 text-center font-medium text-gray-400 whitespace-nowrap">
                        {startIndex + index + 1}
                      </td>

                      {/* Name & Description */}
                      <td className="py-4 px-6 font-bold text-gray-800 whitespace-nowrap">
                        <div>
                          <span>{category.name}</span>
                          {category.description && (
                            <p className="text-xs font-normal text-gray-400 mt-0.5">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* STATUS Column */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {activeTab === "ACTIVE_LIST" ? (
                          <select
                            value={category.status}
                            onChange={(e) =>
                              handleStatusChange(
                                category.id,
                                e.target.value as "ACTIVE" | "INACTIVE"
                              )
                            }
                            disabled={!canModify}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer focus:outline-none ${
                              category.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                            }`}
                          >
                            <option value="ACTIVE" className="bg-white text-gray-800">
                              ACTIVE
                            </option>
                            <option value="INACTIVE" className="bg-white text-gray-800">
                              INACTIVE
                            </option>
                          </select>
                        ) : (
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {category.status}
                          </span>
                        )}
                      </td>

                      {/* Product Count Badge */}
                      <td className="py-4 px-6 text-center whitespace-nowrap font-bold text-emerald-600">
                        {category.productsCount}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-2">
                          
                          {/* View Button (Always Visible) */}
                          <button
                            onClick={() => navigate(`/dashboard/categories/${category.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <FaEye className="text-xs" /> View
                          </button>

                          {/* Delete / Restore Button */}
                          {activeTab === "ACTIVE_LIST" ? (
                            canModify && (
                              <button
                                onClick={() => handleDeleteCategory(category)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                              >
                                <FaTrash className="text-xs" /> Delete
                              </button>
                            )
                          ) : (
                            canModify && (
                              <button
                                onClick={() => handleRestoreCategory(category)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                              >
                                <FaUndo className="text-xs" /> Restore
                              </button>
                            )
                          )}

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                      {activeTab === "TRASH"
                        ? "No deleted categories found."
                        : "No categories found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoriesTable;