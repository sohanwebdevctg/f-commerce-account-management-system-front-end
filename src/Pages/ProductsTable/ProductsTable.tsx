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
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Swal from "sweetalert2";

// Child Variant Interface
export interface IProductVariant {
  id: string;
  sku: string;
  attributes: { Color?: string; Size?: string; [key: string]: string | undefined };
  price: number;
  stock: number;
  totalOrders: number;
}

// Main Product Interface
export interface IProduct {
  id: string;
  name: string;
  image?: string;
  category: string;
  type: "SINGLE" | "VARIANT";
  price?: number;        // Only for Single
  stock?: number;        // Only for Single
  totalOrders?: number; // Only for Single
  variants?: IProductVariant[]; // Only for Variant
  status: "ACTIVE" | "INACTIVE";
  isDeleted: boolean;
  createdAt: string;
}

// Sample Dummy Data
const initialProducts: IProduct[] = [
  {
    id: "prod-101",
    name: "Wireless Bluetooth Headphones",
    image: "https://via.placeholder.com/150",
    category: "Electronics",
    type: "SINGLE",
    price: 1200,
    stock: 12,
    totalOrders: 45,
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2026-02-15",
  },
  {
    id: "prod-102",
    name: "Men's Premium Cotton T-Shirt",
    image: "https://via.placeholder.com/150",
    category: "Mens Fashion",
    type: "VARIANT",
    variants: [
      { id: "var-1", sku: "TSH-RED-M", attributes: { Color: "Red", Size: "M" }, price: 500, stock: 20, totalOrders: 15 },
      { id: "var-2", sku: "TSH-RED-L", attributes: { Color: "Red", Size: "L" }, price: 550, stock: 10, totalOrders: 8 },
      { id: "var-3", sku: "TSH-BLUE-M", attributes: { Color: "Blue", Size: "M" }, price: 500, stock: 0, totalOrders: 22 },
    ],
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2026-02-18",
  },
  {
    id: "prod-103",
    name: "Running Sports Shoes",
    image: "https://via.placeholder.com/150",
    category: "Footwear",
    type: "SINGLE",
    price: 2500,
    stock: 0,
    totalOrders: 110,
    status: "INACTIVE",
    isDeleted: false,
    createdAt: "2026-02-20",
  },
];

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const ProductsTable: React.FC = () => {
  const navigate = useNavigate();

  const [currentUserRole] = useState<"ADMIN" | "MODERATOR">("ADMIN");
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productType, setProductType] = useState<"SINGLE" | "VARIANT">("SINGLE");
  const [activeTab, setActiveTab] = useState<"ACTIVE_LIST" | "TRASH">("ACTIVE_LIST");

  // Expanded Accordion State for Variants
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Filter Logic
  const filteredProducts = products.filter((prod) => {
    if (activeTab === "ACTIVE_LIST" && prod.isDeleted) return false;
    if (activeTab === "TRASH" && !prod.isDeleted) return false;
    if (prod.type !== productType) return false;

    return (
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Status Change
  const handleStatusChange = (id: string, newStatus: "ACTIVE" | "INACTIVE") => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    Toast.fire({ icon: "success", title: `Status updated to ${newStatus}` });
  };

  // Soft Delete Main Product
  const handleDeleteProduct = (product: IProduct) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${product.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === product.id ? { ...item, isDeleted: true } : item
          )
        );
        Toast.fire({ icon: "success", title: "Product moved to trash" });
      }
    });
  };

  // Delete Individual Variant Child
  const handleDeleteVariantChild = (productId: string, variantId: string) => {
    Swal.fire({
      title: "Delete Variant?",
      text: "Are you sure you want to delete this specific variant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete variant",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) =>
          prev.map((prod) => {
            if (prod.id === productId && prod.variants) {
              return {
                ...prod,
                variants: prod.variants.filter((v) => v.id !== variantId),
              };
            }
            return prod;
          })
        );
        Toast.fire({ icon: "success", title: "Variant removed" });
      }
    });
  };

  // Restore Main Product
  const handleRestoreProduct = (product: IProduct) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, isDeleted: false } : item
      )
    );
    Toast.fire({ icon: "success", title: "Product restored" });
  };

  // Calculate Total Stock for Variant
  const getVariantTotalStock = (variants: IProductVariant[] = []) => {
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  const canModify = currentUserRole === "ADMIN" || currentUserRole === "MODERATOR";

  const activeCount = products.filter((p) => !p.isDeleted && p.type === productType).length;
  const trashCount = products.filter((p) => p.isDeleted && p.type === productType).length;

  return (
    <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <FaBoxOpen className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Product Management</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage your store products efficiently
              </p>
            </div>
          </div>

          {canModify && (
            <button
              onClick={() => navigate("/dashboard/products/create")}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md cursor-pointer"
            >
              <FaPlus className="text-xs" />
              <span>Create Product</span>
            </button>
          )}
        </div>

        {/* Filters & Tabs */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:max-w-xl">
            {/* Search Input */}
            <div className="relative w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <select
              value={productType}
              onChange={(e) => {
                setProductType(e.target.value as "SINGLE" | "VARIANT");
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="SINGLE">Single Product</option>
              <option value="VARIANT">Variant Product</option>
            </select>
          </div>

          {/* Active / Deleted Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl border border-gray-200/50">
            <button
              onClick={() => {
                setActiveTab("ACTIVE_LIST");
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "ACTIVE_LIST"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>Active Products</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-extrabold">
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("TRASH");
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "TRASH"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>Deleted Products</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-extrabold">
                {trashCount}
              </span>
            </button>
          </div>

        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center">#</th>

                  {/* Dynamic Headers Based on Product Type */}
                  {productType === "SINGLE" ? (
                    <>
                      <th className="py-4 px-6">IMAGE</th>
                      <th className="py-4 px-6">NAME</th>
                      <th className="py-4 px-6">CATEGORY</th>
                      <th className="py-4 px-6 text-center">PRICE</th>
                      <th className="py-4 px-6 text-center">STOCK</th>
                      <th className="py-4 px-6 text-center">ORDERS</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 px-6">NAME</th>
                      <th className="py-4 px-6 text-center">VARIANT</th>
                      <th className="py-4 px-6">CATEGORY</th>
                      <th className="py-4 px-6 text-center">TOTAL STOCK</th>
                    </>
                  )}

                  <th className="py-4 px-6 text-center">STATUS</th>
                  <th className="py-4 px-6 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {currentData.length > 0 ? (
                  currentData.map((product, index) => {
                    const isExpanded = expandedRows.includes(product.id);
                    const totalVariantStock = getVariantTotalStock(product.variants);

                    return (
                      <>
                        {/* Parent Row */}
                        <tr
                          key={product.id}
                          className={`transition-colors ${
                            productType === "VARIANT" ? "cursor-pointer hover:bg-emerald-50/20" : "hover:bg-gray-50/50"
                          } ${isExpanded ? "bg-emerald-50/30" : ""}`}
                          onClick={() => productType === "VARIANT" && toggleRowExpand(product.id)}
                        >
                          {/* # Index */}
                          <td className="py-4 px-6 text-center font-medium text-gray-400">
                            <div className="flex items-center justify-center gap-1">
                              {productType === "VARIANT" && (
                                <span className="text-gray-400 text-xs mr-1">
                                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                              )}
                              <span>{startIndex + index + 1}</span>
                            </div>
                          </td>

                          {/* Render SINGLE Columns */}
                          {productType === "SINGLE" && (
                            <>
                              {/* Image */}
                              <td className="py-4 px-6">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                    <FaBoxOpen />
                                  </div>
                                )}
                              </td>

                              {/* Name */}
                              <td className="py-4 px-6 font-bold text-gray-800">
                                {product.name}
                              </td>

                              {/* Category */}
                              <td className="py-4 px-6 text-gray-600 font-medium">
                                {product.category}
                              </td>

                              {/* Price */}
                              <td className="py-4 px-6 text-center font-bold text-gray-800">
                                ৳{product.price}
                              </td>

                              {/* Stock */}
                              <td className="py-4 px-6 text-center font-bold">
                                <span className={product.stock === 0 ? "text-rose-500" : "text-gray-700"}>
                                  {product.stock}
                                </span>
                              </td>

                              {/* Total Orders */}
                              <td className="py-4 px-6 text-center font-semibold text-emerald-600">
                                {product.totalOrders || 0}
                              </td>
                            </>
                          )}

                          {/* Render VARIANT Columns */}
                          {productType === "VARIANT" && (
                            <>
                              {/* Name */}
                              <td className="py-4 px-6 font-bold text-gray-800">
                                {product.name}
                              </td>

                              {/* Variant Count */}
                              <td className="py-4 px-6 text-center">
                                <span className="bg-blue-50 text-blue-600 font-extrabold px-2.5 py-1 rounded-md text-xs">
                                  {product.variants?.length || 0} Variants
                                </span>
                              </td>

                              {/* Category */}
                              <td className="py-4 px-6 text-gray-600 font-medium">
                                {product.category}
                              </td>

                              {/* Total Stock */}
                              <td className="py-4 px-6 text-center font-bold">
                                <span className={totalVariantStock === 0 ? "text-rose-500" : "text-gray-700"}>
                                  {totalVariantStock}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Status Dropdown */}
                          <td
                            className="py-4 px-6 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {activeTab === "ACTIVE_LIST" ? (
                              <select
                                value={product.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    product.id,
                                    e.target.value as "ACTIVE" | "INACTIVE"
                                  )
                                }
                                disabled={!canModify}
                                className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer focus:outline-none ${
                                  product.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-amber-50 text-amber-600 border-amber-200"
                                }`}
                              >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                              </select>
                            ) : (
                              <span className="text-xs font-bold uppercase text-gray-500">
                                {product.status}
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td
                            className="py-4 px-6 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex items-center justify-center gap-2">
                              <button
                                onClick={() => navigate(`/dashboard/products/${product.id}`)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                              >
                                <FaEye className="text-xs" /> View
                              </button>

                              {activeTab === "ACTIVE_LIST" ? (
                                canModify && (
                                  <button
                                    onClick={() => handleDeleteProduct(product)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-500 hover:bg-rose-100 transition cursor-pointer"
                                  >
                                    <FaTrash className="text-xs" /> Delete
                                  </button>
                                )
                              ) : (
                                canModify && (
                                  <button
                                    onClick={() => handleRestoreProduct(product)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                                  >
                                    <FaUndo className="text-xs" /> Restore
                                  </button>
                                )
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Collapsible Accordion Rows for Variant Child Items */}
                        {productType === "VARIANT" && isExpanded && product.variants && (
                          <tr className="bg-slate-50/80 border-b border-gray-100">
                            <td colSpan={7} className="p-4 pl-10 sm:pl-14">
                              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-inner">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                                  Variants for "{product.name}"
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                                        <th className="py-2 px-4">#</th>
                                        <th className="py-2 px-4">SKU</th>
                                        <th className="py-2 px-4">ATTRIBUTES (COLOR / SIZE)</th>
                                        <th className="py-2 px-4 text-center">PRICE</th>
                                        <th className="py-2 px-4 text-center">STOCK</th>
                                        <th className="py-2 px-4 text-center">ORDERS</th>
                                        <th className="py-2 px-4 text-center">ACTION</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-xs">
                                      {product.variants.map((variant, vIndex) => (
                                        <tr key={variant.id} className="hover:bg-gray-50">
                                          <td className="py-3 px-4 font-semibold text-gray-400">
                                            {vIndex + 1}
                                          </td>
                                          <td className="py-3 px-4 font-mono font-medium text-gray-700">
                                            {variant.sku}
                                          </td>
                                          {/* Variant Attributes (Color, Size etc) */}
                                          <td className="py-3 px-4">
                                            <div className="flex gap-2 flex-wrap items-center">
                                              {variant.attributes.Color && (
                                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-gray-200">
                                                  {/* Color Circle Indicator */}
                                                  <span
                                                    className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: variant.attributes.Color.toLowerCase() }}
                                                  ></span>
                                                  Color: {variant.attributes.Color}
                                                </span>
                                              )}
                                              {variant.attributes.Size && (
                                                <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-gray-200">
                                                  Size: {variant.attributes.Size}
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-3 px-4 text-center font-bold text-gray-800">
                                            ৳{variant.price}
                                          </td>
                                          <td className="py-3 px-4 text-center font-bold">
                                            <span className={variant.stock === 0 ? "text-rose-500" : "text-gray-700"}>
                                              {variant.stock}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-center font-semibold text-emerald-600">
                                            {variant.totalOrders}
                                          </td>
                                          {/* Variant Child Action (View & Delete) */}
                                          <td className="py-3 px-4 text-center">
                                            <div className="inline-flex items-center justify-center gap-2">
                                              <button
                                                onClick={() => navigate(`/dashboard/products/variant/${variant.id}`)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                                              >
                                                <FaEye className="text-[10px]" /> View
                                              </button>
                                              {canModify && (
                                                <button
                                                  onClick={() => handleDeleteVariantChild(product.id, variant.id)}
                                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-500 hover:bg-rose-100 cursor-pointer"
                                                >
                                                  <FaTrash className="text-[10px]" /> Delete
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                      No products found in this table.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
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

export default ProductsTable;