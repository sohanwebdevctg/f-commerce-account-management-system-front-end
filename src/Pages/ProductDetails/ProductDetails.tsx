import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";

// Fetch Product Detail
const fetchProductDetail = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data?.data;
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TanStack Query
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => fetchProductDetail(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p className="font-semibold text-lg">
          {(error as any)?.response?.data?.message || "Failed to load product details!"}
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm mt-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-6 p-4 space-y-6">
      
      {/* 🟢 TOP HEADER ACTION BUTTONS */}
      <div className="flex items-center justify-between bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm">
        <button onClick={() => navigate(-1)} className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none">Back
        </button>
        {/* Product Table বা Detail View পেজের এডিট বাটন */}
        {!product?.isDeleted && !product?.deletedAt && (
          <button onClick={() => navigate(`/dashboard/updateProduct/${product.id}`)}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none">Update
          </button>
        )}
      </div>
      {/* 🟢 MAIN PRODUCT BASIC INFO CARD */}
<div className="card flex-col md:flex-row bg-base-100 shadow-sm border border-base-200 overflow-hidden items-start p-4 gap-4">
  
  {/* Thumbnail Image (Size Reduced) */}
  <figure className="w-full md:w-48 h-48 shrink-0 bg-base-200 rounded-lg p-2 self-center md:self-start">
    <img 
      src={product?.thumbnailImage || '/placeholder-product.png'} 
      alt={product?.name || "Product"} 
      className="w-full h-full object-contain rounded-md"
    />
  </figure>

  {/* Details Section */}
  <div className="w-full space-y-3">
    
    {/* Product Name */}
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
      {product?.name}
    </h2>

    {/* Info Grid (Product Type, Product Status, and Action/Deleted Status) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 bg-base-200/50 p-3 rounded-lg">
      <p><span className="font-semibold text-gray-800 dark:text-white">Category:</span> {product?.category?.name || 'N/A'}</p>
      <p><span className="font-semibold text-gray-800 dark:text-white">Brand:</span> {product?.brand || 'N/A'}</p>
      <p><span className="font-semibold text-gray-800 dark:text-white">Created By:</span> {product?.createdBy?.name} ({product?.createdBy?.role})</p>
      <p><span className="font-semibold text-gray-800 dark:text-white">Updated By:</span> {product?.updatedBy?.name || 'N/A'}</p>
      <p><span className="font-semibold text-gray-800 dark:text-white">Created At:</span> {product?.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}</p>
      <p><span className="font-semibold text-gray-800 dark:text-white">Last Updated:</span> {product?.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}</p>
      <p><span className="font-semibold text-gray-800 dark:text-white">Product Type:</span> <span className="uppercase font-medium text-primary">{product?.productType}</span></p>
      
      {/* Product Status (Active / Inactive) */}
      <p>
        <span className="font-semibold text-gray-800 dark:text-white">Product Status:</span>{" "}
        <span className={`font-semibold ${product?.isActive ? 'text-emerald-600' : 'text-amber-500'}`}>
          {product?.isActive ? 'Active' : 'Inactive'}
        </span>
      </p>

      {/* Action / Delete Status */}
      <p>
        <span className="font-semibold text-gray-800 dark:text-white">Action Status:</span>{" "}
        <span className={`badge badge-sm font-semibold text-white ${product?.isDeleted ? 'badge-error' : 'badge-success'}`}>
          {product?.isDeleted ? 'Deleted' : 'Restored'}
        </span>
      </p>
    </div>

    {/* Short Description */}
    {product?.shortDescription && (
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-semibold text-gray-800 dark:text-white block">Short Description:</span>
        <p className="italic">{product.shortDescription}</p>
      </div>
    )}

    {/* Full Description */}
    {product?.description && (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <span className="font-semibold text-gray-800 dark:text-white block mb-1">Full Description:</span>
        <p className="whitespace-pre-line">{product.description}</p>
      </div>
    )}

  </div>
</div>

    {/* 🟢 VARIANTS & SUB-ITEMS TABLE SECTION */}
<div className="bg-base-100 p-5 rounded-xl border border-base-200 shadow-sm space-y-6">
  <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b pb-2">
    Product Variants & Pricing Details
  </h3>

  {product?.variants && product.variants.length > 0 ? (
    product.variants.map((variant: any, index: number) => (
      <div key={variant.id || index} className="space-y-4 border border-base-200 p-4 rounded-xl bg-base-50/50">
        
        {/* Variant Header Info (Color + Name on Left | Status + Action on Right) */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-base-200/70 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            {variant.colorCode && (
              <span 
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-400 inline-block shadow-sm shrink-0" 
                style={{ backgroundColor: variant.colorCode }}
              ></span>
            )}
            <span className="font-bold text-xs text-gray-800 dark:text-white sm:text-sm">
              {variant.name || variant.variantName || variant.colorName || `Variant #${index + 1}`}
            </span>
          </div>

          {/* Status & Action Badges */}
          <div className="flex items-center gap-2">
            <span className={`badge badge-sm font-semibold text-white ${variant.isActive ? 'badge-success' : 'badge-warning'}`}>
              {variant.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
            <span className={`badge badge-sm font-semibold text-white ${variant.isDeleted ? 'badge-error' : 'badge-info'}`}>
              {variant.isDeleted ? 'Deleted' : 'Restored'}
            </span>
          </div>
        </div>

        {/* Multiple Images Grid */}
        {variant.images && variant.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {variant.images.map((imgObj: any) => (
              <div key={imgObj.id || imgObj} className="w-16 h-16 border rounded-md overflow-hidden bg-white p-1">
                <img 
                  src={imgObj.productImage || imgObj.url || imgObj} 
                  alt="Variant" 
                  className="w-full h-full object-cover rounded" 
                />
              </div>
            ))}
          </div>
        )}

        {/* Variant Items Table */}
        <div className="overflow-x-auto w-full border border-base-200 rounded-lg">
          <table className="table table-xs w-full text-left">
            <thead className="bg-base-200 text-gray-700">
              <tr>
                <th className="py-2.5 px-3">Variant Name</th>
                <th className="py-2.5 px-3">Size Name</th>
                <th className="py-2.5 px-3">Cost Price</th>
                <th className="py-2.5 px-3">Sell Price</th>
                <th className="py-2.5 px-3">Orders</th>
                <th className="py-2.5 px-3">Profit</th>
                <th className="py-2.5 px-3">Stock</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {variant.variantItems && variant.variantItems.length > 0 ? (
                variant.variantItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-base-200/40">
                    
                    {/* Item Name */}
                    <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-white">
                      {item.name || item.varientName || item.variantName || 'Default'}
                    </td>
                    
                    {/* Size */}
                    <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-white">
                      {item.size ? `(${item.size})` : 'N/A'}
                    </td>

                    <td className="py-2.5 px-3 text-gray-600">৳{item.costPrice}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">৳{item.sellPrice}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-700">
                      {item.orderCount ?? item.orders ?? 0}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-blue-600">৳{item.profit || 0}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge badge-sm ${item.stock > 0 ? 'badge-ghost font-bold' : 'badge-error text-white'}`}>
                        {item.stock}
                      </span>
                    </td>

                    {/* Active/Inactive Status */}
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-bold ${item.isActive ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Deleted/Restored Action Status */}
                    <td className="py-2.5 px-3">
                      <span className={`badge badge-sm text-[10px] text-white font-semibold ${item.isDeleted ? 'badge-error' : 'badge-success'}`}>
                        {item.isDeleted ? 'Deleted' : 'Restored'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-400">
                    No items found for this variant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center py-4">No variant details available for this product.</p>
  )}
</div>

    </div>
  );
};

export default ProductDetails;