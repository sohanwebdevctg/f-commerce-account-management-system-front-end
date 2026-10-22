import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link } from "react-router";

// get all products
const getAllProducts = async (isDeleted: boolean, searchTerm: string) => {
  const response = await axiosInstance.get(`/products?isDeleted=${isDeleted}&searchTerm=${searchTerm}`);
  return response.data?.data;
}

// Update Product Status
const updateProductStatus = async ({ id, status }: { id: string; status: string }) => {const response = await axiosInstance.patch(`/products/${id}/status`, { status });
  return response.data;
};

// delete product (soft delete)
const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};

// restore product
const restoreProduct = async (id: string) => {
  const response = await axiosInstance.patch(`/products/${id}/restore`);
  return response.data;
};


// Update Product Variant Status
const updateProductVariantStatus = async ({ productId, variantId, status,
}: { productId: string; variantId: string; status: string;
}) => { const response = await axiosInstance.patch(`/products/${productId}/variants/${variantId}/status`,{ status });
  return response.data;
};

// delete product variant (soft delete)
const deleteProductVariant = async ({ productId, variantId}: { productId: string; variantId: string;}) => {
  const response = await axiosInstance.delete(`/products/${productId}/variants/${variantId}`);
  return response.data;
};

// restore product variant
const restoreProductVariant = async ({ productId, variantId,
}: {productId: string;variantId: string;}) => {
  const response = await axiosInstance.patch( `/products/${productId}/variants/${variantId}/restore`);
  return response.data;
};


// Update Product Variant Item Status
const updateProductVariantItemStatus = async ({ productId, variantId, itemId, status}: {productId: string;variantId: string;itemId: string;status: string;}) => { const response = await axiosInstance.patch(`/products/${productId}/variants/${variantId}/items/${itemId}/status`,{ status });
  return response.data;
};

// delete product variant item
const deleteProductVariantItem = async ({productId,variantId,itemId}: { productId: string; variantId: string; itemId: string;}) => {
  const response = await axiosInstance.delete(`/products/${productId}/variants/${variantId}/items/${itemId}`);
  return response.data;
};

// restore product variant item
const restoreProductVariantItem = async ({ productId, variantId, itemId}: { productId: string; variantId: string; itemId: string}) => {
  const response = await axiosInstance.patch(`/products/${productId}/variants/${variantId}/items/${itemId}/restore`);
  return response.data;
};

const ProductTable = () => {

  // declare tab state (true = Active Users, false = Deleted/Trash)
    const [activeTab, setActiveTab] = useState<boolean>(() => {
    const savedTab = localStorage.getItem("activeTab");
    return savedTab !== null ? JSON.parse(savedTab) : true;});
    // handle tab function
    const handleTabChange = (status: boolean) => {
    setActiveTab(status);
    localStorage.setItem("activeTab", JSON.stringify(status));};

    const {role, id, token, email} = useAuth();
    
      // search state
      const [searchTerm, setSearchTerm] = useState<string>("");

      // Main Variant Product Collapse
      const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

      const toggleProduct = (id: string) => {
        setExpandedProducts((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };

      // Collapse of Variant Products
    const [expandedVariants, setExpandedVariants] = useState<{ [key: string]: boolean }>({});

    const toggleVariantSizes = (variantId: string) => {
      setExpandedVariants((prev) => ({
        ...prev,
        [variantId]: !prev[variantId],
      }));
    };

   // SweetAlert Toast Notification Config
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });

    // TanStack Query
    const {data, isLoading, isError, error} = useQuery({
      queryKey: ["products", activeTab, searchTerm],
      queryFn: () => getAllProducts(!activeTab, searchTerm)
    });

  const queryClient = useQueryClient();

  // Product Status Mutation
  const { mutate: updateProductStatusMutation } = useMutation({
    mutationFn: updateProductStatus,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Toast.fire({ icon: "success", title: data?.message || "Product status updated successfully!",});
    },
    onError: (error: any) => {
      Toast.fire({icon: "error",title: error?.response?.data?.message || "Failed to update product status!",});
    },
  });

  // Handle Product Delete
  const handleProductDelete = (productId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductMutation(productId);
      }
    });
  };

  // Delete Product Mutation
  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Toast.fire({
        icon: "success",
        title: data?.message || "Product deleted successfully!",
      });
    },
    onError: (error: any) => {
      Toast.fire({
        icon: "error",
        title: error?.response?.data?.message || "Failed to delete product!",
      });
    },
  });

  // Handle Product Restore
  const handleProductRestore = (productId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to restore this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, restore it!",
    }).then((result) => {
      if (result.isConfirmed) {
        restoreProductMutation(productId);
      }
    });
  };

  // Restore Product Mutation
  const { mutate: restoreProductMutation } = useMutation({
    mutationFn: restoreProduct,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Toast.fire({ icon: "success", title: data?.message || "Product restored successfully!"});
    },
    onError: (error: any) => {
      Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to restore product!"});
    },
  });


  // Product Variant Status Mutation
  const { mutate: updateProductVariantStatusMutation } = useMutation({
    mutationFn: updateProductVariantStatus,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Toast.fire({ icon: "success", title: data?.message || "Variant status updated successfully!",});
    },
    onError: (error: any) => {
      Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update variant status!",});
    },
  });

  // Handle Product Delete Variant Confirmation
  const handleProductDeleteVariant = (productId: string, variantId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this variant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductVariantMutation({ productId, variantId });
      }
    });
  };

  // Delete Product Variant Mutation
  const { mutate: deleteProductVariantMutation } = useMutation({
    mutationFn: deleteProductVariant,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Toast.fire({
        icon: "success",
        title: data?.message || "Variant deleted successfully!",
      });
    },
    onError: (error: any) => {
      Toast.fire({
        icon: "error",
        title: error?.response?.data?.message || "Failed to delete variant!",
      });
    },
  });

  // Handle Product Variant Restore
  const handleProductVariantRestore = (productId: string, variantId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to restore this variant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, restore it!",
    }).then((result) => {
      if (result.isConfirmed) {
        restoreProductVariantMutation({ productId, variantId });
      }
    });
  };

  // Restore Product Variant Mutation
const { mutate: restoreProductVariantMutation } = useMutation({
  mutationFn: restoreProductVariant,
  onSuccess: (data: any) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    Toast.fire({ icon: "success", title: data?.message || "Product variant restored successfully!",
    });
  },
  onError: (error: any) => {
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to restore product variant!",});
  },
});

  // Product Variant Item Status Mutation
const { mutate: updateProductVariantItemStatusMutation } = useMutation({
  mutationFn: updateProductVariantItemStatus,
  onSuccess: (data: any) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    Toast.fire({ icon: "success", title: data?.message || "Variant item status updated successfully!",});
  },
  onError: (error: any) => {
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update variant item status!",});
  },
});

  // Handle Product Delete Variant Item Confirmation
  const handleProductDeleteVariantItem = (
    productId: string,
    variantId: string,
    itemId: string
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this variant item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductVariantItemMutation({ productId, variantId, itemId });
      }
    });
  };

  // Delete Product Variant Item Mutation
  const { mutate: deleteProductVariantItemMutation } = useMutation({
    mutationFn: deleteProductVariantItem,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Toast.fire({ icon: "success", title: data?.message || "Variant item deleted successfully!"});
    },
    onError: (error: any) => {
      Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to delete variant item!"});
    },
  });

// Handle Product Variant Item Restore Confirmation
const handleProductVariantItemRestore = ( productId: string, variantId: string, itemId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to restore this variant item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, restore it!",
  }).then((result) => {
    if (result.isConfirmed) {
      restoreProductVariantItemMutation({ productId, variantId, itemId });
    }
  });
};

// Restore Product Variant Item Mutation
const { mutate: restoreProductVariantItemMutation } = useMutation({
  mutationFn: restoreProductVariantItem,
  onSuccess: (data: any) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    Toast.fire({
      icon: "success",
      title: data?.message || "Variant item restored successfully!",
    });
  },
  onError: (error: any) => {
    Toast.fire({
      icon: "error",
      title:
        error?.response?.data?.message || "Failed to restore variant item!",
    });
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
        {role === "ADMIN" && id && email && token && (
          <Link to="/dashboard/createProduct">
            <button className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-none p-4">
              CreateProduct
            </button>
          </Link>
        )}
          <button onClick={() => handleTabChange(true)} className={`btn btn-sm border-none rounded-lg text-xs flex-1 sm:flex-initial transition-all ${activeTab ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" : "bg-transparent text-base-content/70 hover:bg-base-300"}`}>Products</button>
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
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          {activeTab ? (
            /* ================= ACTIVE PRODUCT TABLE BODY ================= */
            <tbody>
  {isLoading ? (
    <tr>
      <td colSpan={9} className="text-center py-6 text-base-content/70">
        Loading products...
      </td>
    </tr>
  ) : isError ? (
    <tr>
      <td colSpan={9} className="text-center py-6 text-error">
        Error loading products!
      </td>
    </tr>
  ) : !data || data.length === 0 ? (
    <tr>
      <td colSpan={9} className="text-center py-6 text-gray-500 font-medium">
        No products found! <span className="text-red-500">Please Reset</span>
      </td>
    </tr>
  ) : (
    data.map((product: any, index: number) => {
      // Price Calculation
      let displayPrice = "0.00";
      if (product.productType === "SINGLE") {
        displayPrice = product.variants?.[0]?.variantItems?.[0]?.sellPrice || "0.00";
      } else if (product.variants?.length > 0) {
        const prices = product.variants.flatMap((v: any) =>
          v.variantItems?.map((item: any) => Number(item.sellPrice || 0)) || []
        );
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          displayPrice = minPrice === maxPrice ? `${minPrice}` : `${minPrice} - ${maxPrice}`;
        }
      }

      // মূল প্রোডাক্টের সর্বমোট sold
      const totalSoldQty = product.totalSold || 0;

      // শুধুমাত্র একটিভ (ডিলিট না হওয়া) ভ্যারিয়েন্টগুলো ফিল্টার করা
      const activeVariants = (product.variants || []).filter((v: any) => !v.isDeleted);

      return (
        <React.Fragment key={product.id}>
          {/* Main Product Row - পুরো রো ক্লিক্রেবল করা হলো */}
          <tr
            onClick={() => {
              if (product.productType === "VARIANT") {
                toggleProduct(product.id);
              }
            }}
            className={`hover:bg-base-200/40 transition-colors border-b border-base-200 ${
              product.productType === "VARIANT" ? "cursor-pointer select-none" : ""
            }`}
          >
            {/* Serial */}
            <td className="py-3 px-4 font-semibold text-sm">{index + 1}</td>

            {/* Image */}
            <td className="py-3 px-4">
              <div className="avatar">
                <div className="mask mask-squircle h-10 w-10">
                  <img
                    src={product.thumbnailImage || "/empty-product.png"}
                    alt={product.name || "Product"}
                  />
                </div>
              </div>
            </td>

            {/* Name */}
            <td className="py-3 px-4 font-bold text-sm text-base-content">
              {product.name}
            </td>

            {/* 4. Type */}
            <td className="py-3 px-4">
              <span className="badge badge-ghost badge-sm text-[10px] font-bold">
                {product.productType}
              </span>
            </td>

            {/* Category */}
            <td className="py-3 px-4 text-xs text-base-content/70">
              {product.category?.name || "N/A"}
            </td>

            {/* Price */}
            <td className="py-3 px-4 font-semibold text-emerald-600">
              ৳{displayPrice}
            </td>

            {/* Order (Product Level) */}
            <td className="py-3 px-4 font-bold text-xs text-indigo-600 text-center">
              {totalSoldQty}
            </td>

            {/* product Status */}
            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
              {role === "ADMIN" || role === "MODERATOR" ? (
                <select
                  defaultValue={product.isActive ? "ACTIVE" : "INACTIVE"}
                  className="select select-bordered select-xs w-28 focus:outline-none"
                  onChange={(e) =>
                    updateProductStatusMutation({ id: product.id, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              ) : (
                <span
                  className={`badge badge-sm font-semibold ${
                    product.isActive ? "badge-success text-white" : "badge-error text-white"
                  }`}
                >
                  {product.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              )}
            </td>

            {/* Action */}
            <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-2">
                {/* product view */}
                <Link to={`/dashboard/productDetails/${product.id}`}>
                  <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">View
                  </button>
                </Link>

                {/* product delete */}
                {(role === "ADMIN" || role === "MODERATOR") && (
                  <button
                    onClick={() => handleProductDelete(product.id)}
                    className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none"
                  >
                    Delete
                  </button>
                )}

                {product.productType === "VARIANT" && (
                  <button
                    onClick={() => toggleProduct(product.id)}
                    className="btn btn-xs btn-ghost p-1 min-h-0 h-6 w-6 rounded-full"
                  >
                    {expandedProducts[product.id] ? "▲" : "▼"}
                  </button>
                )}
              </div>
            </td>
          </tr>

          {/* Variant Container */}
          {product.productType === "VARIANT" && expandedProducts[product.id] && (
            <tr className="bg-base-100 border-b border-base-200">
              <td colSpan={9} className="p-3 sm:px-6">
                <div className="flex flex-col gap-2.5 w-full">
                  {/* Case 1: যদি প্রোডাক্টের আন্ডারে কোনো একটিভ ভ্যারিয়েন্ট না থাকে */}
                  {activeVariants.length === 0 ? (
                    <div className="p-4 text-center text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 rounded-xl">
                      No active variants found for this product. All variants have been deleted.
                    </div>
                  ) : (
                    activeVariants.map((variant: any) => {
  // ১. ডিলিট না হওয়া একটিভ সাইজগুলো ফিল্টার করা
  const activeVariantItems = (variant.variantItems || []).filter(
    (item: any) => !item.isDeleted
  );

  // ২. ডাটাবেজে তৈরির সময় আসল ভ্যারিয়েন্ট আইটেমের সংখ্যা (isDeleted ধরা হচ্ছে না যাতে তৈরি করার সময়ের অবস্থা বোঝা যায়)
  const totalOriginalItems = (variant.variantItems || []).length;
  const isOriginallySingle = totalOriginalItems === 1;

  const variantSoldQty = variant.totalSold || 0;
  const isSizesOpen = expandedVariants[variant.id];

  // =========================================================================
  // 🟢 CASE A: তৈরিই হয়েছিল ১টি সাইজ নিয়ে (যেমন: Lux Soap)
  // (কোনো ড্রপডাউন বা ব্যাজ থাকবে না, সরাসরি ফ্ল্যাট ১ লাইনে দেখাবে)
  // =========================================================================
  if (isOriginallySingle) {
    const item = activeVariantItems[0] || variant.variantItems?.[0];

    return (
      <div
        key={variant.id}
        className="px-4 py-2.5 rounded-xl bg-base-100 border border-base-200 flex items-center justify-between gap-4 w-full shadow-sm hover:border-base-300 transition-all mb-2"
      >
        {/* Image & Color / Size */}
        <div className="flex items-center gap-4 w-1/4">
          <div className="avatar">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-base-200">
              <img
                src={
                  variant.images?.[0]?.productImage
                    ? variant.images[0].productImage.startsWith("/")
                      ? variant.images[0].productImage
                      : `/${variant.images[0].productImage}`
                    : "/empty-product.png"
                }
                alt="Variant"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {variant.colorCode && (
              <span
                className="w-4 h-4 rounded-full border border-gray-300 shadow-sm inline-block shrink-0"
                style={{ backgroundColor: variant.colorCode }}
                title={variant.colorCode}
              ></span>
            )}
            {item?.size && (
              <span className="badge badge-outline badge-sm text-xs font-medium">
                {item.size}
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-xs sm:text-sm font-semibold text-emerald-600 w-1/6 text-center">
          ৳{item?.sellPrice || "0"}
        </div>

        {/* Orders */}
        <div className="text-xs font-semibold text-indigo-600 w-1/6 text-center">
          {variantSoldQty} Orders
        </div>

        {/* Stock */}
        <div className="text-xs text-base-content/70 w-1/6 text-center">
          Stock: <strong className="text-base-content">{item?.stock || 0}</strong>
        </div>

        {/* Status */}
        <div className="w-1/6 flex justify-center">
          {role === "ADMIN" || role === "MODERATOR" ? (
            <select
              defaultValue={
                item?.isActive ?? variant.isActive ? "ACTIVE" : "INACTIVE"
              }
              className="select select-bordered select-xs w-24 focus:outline-none"
              onChange={(e) =>
                updateProductVariantItemStatusMutation({
                  productId: product.id,
                  variantId: variant.id,
                  itemId: item?.id,
                  status: e.target.value,
                })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          ) : (
            <span
              className={`badge badge-xs font-semibold p-2 ${
                item?.isActive ?? variant.isActive
                  ? "badge-success text-white"
                  : "badge-ghost"
              }`}
            >
              {item?.isActive ?? variant.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          )}
        </div>

        {/* Delete button */}
        <div className="w-1/12 flex justify-end">
          {(role === "ADMIN" || role === "MODERATOR") && (
            <button
              onClick={() =>
                handleProductDeleteVariant(
                  product.id,
                  variant.id,
                )
              }
              className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none text-[11px] px-3"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 🟢 CASE B: তৈরিই হয়েছিল মাল্টিপল সাইজ নিয়ে (যেমন: S, M, L)
  // (সাইজ ১টিতে নেমে আসলেও ড্রপডাউন '1 Sizes' আকারে ভ্যারিয়েন্ট আইটেমসহ থাকবে)
  // =========================================================================
  const totalVariantStock = activeVariantItems.reduce(
    (acc: number, item: any) => acc + Number(item.stock || 0),
    0
  );
  const itemPrices = activeVariantItems.map((item: any) =>
    Number(item.sellPrice || 0)
  );
  const minVariantPrice =
    itemPrices.length > 0 ? Math.min(...itemPrices) : 0;
  const maxVariantPrice =
    itemPrices.length > 0 ? Math.max(...itemPrices) : 0;
  const priceRangeText =
    itemPrices.length === 0
      ? "৳0"
      : minVariantPrice === maxVariantPrice
      ? `৳${minVariantPrice}`
      : `৳${minVariantPrice} - ৳${maxVariantPrice}`;

  return (
    <div
      key={variant.id}
      className="rounded-xl bg-base-100 border border-base-200 overflow-hidden shadow-sm hover:border-base-300 transition-all mb-2"
    >
      {/* Header Bar */}
      <div
        onClick={() => toggleVariantSizes(variant.id)}
        className="p-3 px-4 flex items-center justify-between gap-4 bg-base-100 hover:bg-base-200/40 cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-base-200">
              <img
                src={
                  variant.images?.[0]?.productImage
                    ? variant.images[0].productImage.startsWith("/")
                      ? variant.images[0].productImage
                      : `/${variant.images[0].productImage}`
                    : "/empty-product.png"
                }
                alt="Variant"
              />
            </div>
          </div>

          {variant.colorCode && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full border border-gray-300 shadow-sm inline-block shrink-0"
                style={{ backgroundColor: variant.colorCode }}
                title={variant.colorCode}
              ></span>
            </div>
          )}

          <span
            className={`badge badge-sm text-[11px] font-medium ${
              activeVariantItems.length === 0
                ? "badge-error text-white"
                : "badge-ghost text-base-content/70"
            }`}
          >
            {activeVariantItems.length} Sizes
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs">
          <div className="font-semibold text-emerald-600">
            {priceRangeText}
          </div>
          <div className="font-semibold text-indigo-600">
            {variantSoldQty} Orders
          </div>
          <div className="text-base-content/70">
            Total Stock:{" "}
            <strong className="text-base-content">
              {totalVariantStock}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div onClick={(e) => e.stopPropagation()}>
            {role === "ADMIN" || role === "MODERATOR" ? (
              <select
                defaultValue={variant.isActive ? "ACTIVE" : "INACTIVE"}
                className="select select-bordered select-xs w-24 focus:outline-none"
                onChange={(e) =>
                  updateProductVariantStatusMutation({
                    productId: product.id,
                    variantId: variant.id,
                    status: e.target.value,
                  })
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            ) : (
              <span
                className={`badge badge-xs font-semibold p-2 ${
                  variant.isActive ? "badge-success text-white" : "badge-ghost"
                }`}
              >
                {variant.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            )}
          </div>

          {(role === "ADMIN" || role === "MODERATOR") && (
            <div onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() =>
                  handleProductDeleteVariant(product.id, variant.id)
                }
                className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none text-[11px] px-3"
              >
                Delete
              </button>
            </div>
          )}

          <span className="text-xs text-base-content/60 font-bold ml-1">
            {isSizesOpen ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Sub-Items (Sizes) List */}
      {isSizesOpen && (
        <div className="border-t border-base-200/80 bg-base-200/20 p-2.5 flex flex-col gap-1.5">
          {activeVariantItems.length === 0 ? (
            <div className="p-3 text-center text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 rounded-lg">
              No active sizes available for this variant. All sizes have been deleted.
            </div>
          ) : (
            activeVariantItems.map((item: any, itemIdx: number) => {
              const itemSoldQty = item.totalSold || 0;

              return (
                <div
                  key={item.id || itemIdx}
                  className="flex items-center justify-between gap-4 py-1.5 px-3 rounded-lg bg-base-100 hover:bg-base-200/50 transition-colors w-full border border-base-200/50"
                >
                  <div className="flex items-center gap-2 w-1/4">
                    {item?.varientName && (
                      <span className="text-xs font-semibold text-base-content/80">
                        {item.varientName}
                      </span>
                    )}
                    {item?.size && (
                      <span className="badge badge-outline badge-sm text-xs font-medium">
                        {item.size}
                      </span>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-emerald-600 w-1/6 text-center">
                    ৳{item?.sellPrice || "0"}
                  </div>

                  <div className="text-xs font-semibold text-indigo-600 w-1/6 text-center">
                    {itemSoldQty} Orders
                  </div>

                  <div className="text-xs text-base-content/70 w-1/6 text-center">
                    Stock:{" "}
                    <strong className="text-base-content">
                      {item?.stock || 0}
                    </strong>
                  </div>

                  <div className="w-1/6 flex justify-center">
                    {role === "ADMIN" || role === "MODERATOR" ? (
                      <select
                        defaultValue={
                          item.isActive ?? variant.isActive
                            ? "ACTIVE"
                            : "INACTIVE"
                        }
                        className="select select-bordered select-xs w-24 focus:outline-none"
                        onChange={(e) =>
                          updateProductVariantItemStatusMutation({
                            productId: product.id,
                            variantId: variant.id,
                            itemId: item.id,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    ) : (
                      <span
                        className={`badge badge-xs font-semibold p-2 ${
                          item.isActive ?? variant.isActive
                            ? "badge-success text-white"
                            : "badge-ghost"
                        }`}
                      >
                        {item.isActive ?? variant.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    )}
                  </div>

                  <div className="w-1/12 flex justify-end">
                    {(role === "ADMIN" || role === "MODERATOR") && (
                      <button
                        onClick={() =>
                          handleProductDeleteVariantItem(
                            product.id,
                            variant.id,
                            item.id
                          )
                        }
                        className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none text-[11px] px-3"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
})
                  )}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    })
  )}
          </tbody>
          ) : (
            /* ================= TRASH / DELETED PRODUCT TABLE BODY ================= */
            <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-base-content/70">
                  Loading products...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-error">
                  Error loading products!
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500 font-medium">
                  No deleted products found! <span className="text-red-500">Please Reset</span>
                </td>
              </tr>
            ) : (
              data.map((product: any, index: number) => {
                const isProductDeleted = product.isDeleted;

                // ১. ভ্যারিয়েন্ট ফিল্টারিং: মূল প্রোডাক্ট ডিলিট না হলে, শুধুমাত্র ডিলিট হওয়া (বা যাদের ভেতরে ডিলিটেড সাইজ আছে) ভ্যারিয়েন্ট ফিল্টার করা
                const filteredVariants = (product.variants || []).filter((variant: any) => {
                  if (isProductDeleted) return true; // প্রোডাক্ট ডিলিট হলে সব দেখাবে
                  if (variant.isDeleted) return true; // ভ্যারিয়েন্ট নিজে ডিলিট হলে দেখাবে
                  // অথবা যদি ভ্যারিয়েন্টের ভেতরে কোনো সাইজ ডিলিট করা থাকে
                  return variant.variantItems?.some((item: any) => item.isDeleted);
                });

                // Price Calculation
                let displayPrice = "0.00";
                if (product.productType === "SINGLE") {
                  displayPrice = product.variants?.[0]?.variantItems?.[0]?.sellPrice || "0.00";
                } else if (filteredVariants.length > 0) {
                  const prices = filteredVariants.flatMap((v: any) =>
                    v.variantItems?.map((item: any) => Number(item.sellPrice || 0)) || []
                  );
                  if (prices.length > 0) {
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    displayPrice = minPrice === maxPrice ? `${minPrice}` : `${minPrice} - ${maxPrice}`;
                  }
                }

                const totalSoldQty = product.totalSold || 0;

                return (
                  <React.Fragment key={product.id}>
                    {/* Main Product Row */}
                    <tr
                      onClick={() => {
                        if (product.productType === "VARIANT") {
                          toggleProduct(product.id);
                        }
                      }}
                      className={`hover:bg-base-200/40 transition-colors border-b border-base-200 ${
                        product.productType === "VARIANT" ? "cursor-pointer select-none" : ""
                      }`}
                    >
                      {/* Serial */}
                      <td className="py-3 px-4 font-semibold text-sm">{index + 1}</td>

                      {/* Image */}
                      <td className="py-3 px-4">
                        <div className="avatar">
                          <div className="mask mask-squircle h-10 w-10">
                            <img
                              src={product.thumbnailImage || "/empty-product.png"}
                              alt={product.name || "Product"}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-sm text-base-content">
                        {product.name}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4">
                        <span className="badge badge-ghost badge-sm text-[10px] font-bold">
                          {product.productType}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-xs text-base-content/70">
                        {product.category?.name || "N/A"}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold text-emerald-600">
                        ৳{displayPrice}
                      </td>

                      {/* Order */}
                      <td className="py-3 px-4 font-bold text-xs text-indigo-600 text-center">
                        {totalSoldQty}
                      </td>

                      {/* Product Status (শুধু যদি মেইন প্রোডাক্ট ডিলিট হয়ে থাকে) */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        {isProductDeleted ? (
                          role === "ADMIN" || role === "MODERATOR" ? (
                            <select
                              defaultValue={product.isActive ? "ACTIVE" : "INACTIVE"}
                              className="select select-bordered select-xs w-28 focus:outline-none"
                              onChange={(e) =>
                                updateProductStatusMutation({ id: product.id, status: e.target.value })
                              }
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="INACTIVE">INACTIVE</option>
                            </select>
                          ) : (
                            <span
                              className={`badge badge-sm font-semibold ${
                                product.isActive ? "badge-success text-white" : "badge-error text-white"
                              }`}
                            >
                              {product.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          )
                        ) : null}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/dashboard/productDetails/${product.id}`}>
                            <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                              View
                            </button>
                          </Link>
                          {/* product restore */}
                          {isProductDeleted && (role === "ADMIN" || role === "MODERATOR") && (
                            <button
                              onClick={() => handleProductRestore(product.id)}
                              className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                            >
                              Restore
                            </button>
                          )}

                          {product.productType === "VARIANT" && (
                            <button
                              onClick={() => toggleProduct(product.id)}
                              className="btn btn-xs btn-ghost p-1 min-h-0 h-6 w-6 rounded-full"
                            >
                              {expandedProducts[product.id] ? "▲" : "▼"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Variant Container */}
                    {product.productType === "VARIANT" && expandedProducts[product.id] && (
                      <tr className="bg-base-100 border-b border-base-200">
                        <td colSpan={9} className="p-3 sm:px-6">
                          <div className="flex flex-col gap-2.5 w-full">
                            {filteredVariants.map((variant: any) => {
                              const isVariantDeleted = variant.isDeleted;

                              // ২. সাইজ/আইটেম ফিল্টারিং: প্রোডাক্ট বা ভ্যারিয়েন্ট ডিলিট না হলে, শুধু ডিলিটেড সাইজ ফিল্টার করে ফিল্টার করা
                              const filteredVariantItems = (variant.variantItems || []).filter((item: any) => {
                                if (isProductDeleted || isVariantDeleted) return true;
                                return item.isDeleted; // শুধুমাত্র ডিলিটেড সাইজটিই থাকবে
                              });

                              const hasMultipleSizes = (variant.variantItems || []).length > 1;
                              const variantSoldQty = variant.totalSold || 0;
                              const isSizesOpen = expandedVariants[variant.id];
                              const showVariantControls = isProductDeleted || isVariantDeleted;

                              // ১. যদি কোনো সাইজ না থাকে বা একটা সাইজ থাকে (Single Variant Size)
                              if (!hasMultipleSizes && filteredVariantItems.length === 1) {
                                const item = filteredVariantItems[0];
                                const showItemControls = isProductDeleted || isVariantDeleted || item.isDeleted;

                                return (
                                  <div
                                    key={variant.id}
                                    className="px-4 py-2.5 rounded-xl bg-base-100 border border-base-200 flex items-center justify-between gap-4 w-full shadow-sm hover:border-base-300 transition-all"
                                  >
                                    <div className="flex items-center gap-4 w-1/4">
                                      <div className="avatar">
                                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-base-200">
                                          <img
                                            src={
                                              variant.images?.[0]?.productImage
                                                ? variant.images[0].productImage.startsWith("/")
                                                  ? variant.images[0].productImage
                                                  : `/${variant.images[0].productImage}`
                                                : "/empty-product.png"
                                            }
                                            alt="Variant"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {variant.colorCode && (
                                          <span
                                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm inline-block shrink-0"
                                            style={{ backgroundColor: variant.colorCode }}
                                            title={variant.colorCode}
                                          ></span>
                                        )}
                                        {item?.size && (
                                          <span className="badge badge-outline badge-sm text-xs font-medium">
                                            {item.size}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-xs sm:text-sm font-semibold text-emerald-600 w-1/6 text-center">
                                      ৳{item?.sellPrice || "0"}
                                    </div>

                                    <div className="text-xs font-semibold text-indigo-600 w-1/6 text-center">
                                      {variantSoldQty} Orders
                                    </div>

                                    <div className="text-xs text-base-content/70 w-1/6 text-center">
                                      Stock: <strong className="text-base-content">{item?.stock || 0}</strong>
                                    </div>

                                    {/* Variant Status */}
                                    <div className="w-1/6 flex justify-center">
                                      {showItemControls ? (
                                        role === "ADMIN" || role === "MODERATOR" ? (
                                          <select
                                            defaultValue={
                                              isVariantDeleted
                                                ? variant.isActive ? "ACTIVE" : "INACTIVE"
                                                : item.isActive ? "ACTIVE" : "INACTIVE"
                                            }
                                            className="select select-bordered select-xs w-24 focus:outline-none"
                                            onChange={(e) =>
                                              isVariantDeleted
                                                ? updateProductVariantStatusMutation({
                                                    productId: product.id,
                                                    variantId: variant.id,
                                                    status: e.target.value,
                                                  })
                                                : updateProductVariantItemStatusMutation({
                                                    productId: product.id,
                                                    variantId: variant.id,
                                                    itemId: item.id,
                                                    status: e.target.value,
                                                  })
                                            }
                                          >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                          </select>
                                        ) : (
                                          <span className="badge badge-xs font-semibold p-2 badge-success text-white">
                                            ACTIVE
                                          </span>
                                        )
                                      ) : null}
                                    </div>

                                    {/* product variant restore */}
                                    <div className="w-1/12 flex justify-end">
                                      {showItemControls && (role === "ADMIN" || role === "MODERATOR") && (
                                        <button
                                          onClick={() => handleProductVariantRestore(product.id, variant.id)}
                                          className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none text-[11px] px-3"> Restore</button>
                                      )}
                                    </div>
                                  </div>
                                );
                              }

                              // --- একাধিক সাইজ থাকলে ---
                              const totalVariantStock = filteredVariantItems.reduce((acc: number, item: any) => acc + Number(item.stock || 0),0);
                              const itemPrices = filteredVariantItems.map((item: any) => Number(item.sellPrice || 0));
                              const minVariantPrice = Math.min(...itemPrices);
                              const maxVariantPrice = Math.max(...itemPrices);
                              const priceRangeText =
                                minVariantPrice === maxVariantPrice
                                  ? `৳${minVariantPrice}`
                                  : `৳${minVariantPrice} - ৳${maxVariantPrice}`;

                              return (
                                <div
                                  key={variant.id}
                                  className="rounded-xl bg-base-100 border border-base-200 overflow-hidden shadow-sm hover:border-base-300 transition-all"
                                >
                                  {/* Header Bar */}
                                  <div
                                    onClick={() => toggleVariantSizes(variant.id)}
                                    className="p-3 px-4 flex items-center justify-between gap-4 bg-base-100 hover:bg-base-200/40 cursor-pointer select-none transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="avatar">
                                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-base-200">
                                          <img
                                            src={
                                              variant.images?.[0]?.productImage
                                                ? variant.images[0].productImage.startsWith("/")
                                                  ? variant.images[0].productImage
                                                  : `/${variant.images[0].productImage}`
                                                : "/empty-product.png"
                                            }
                                            alt="Variant"
                                          />
                                        </div>
                                      </div>

                                      {variant.colorCode && (
                                        <div className="flex items-center gap-1.5">
                                          <span
                                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm inline-block shrink-0"
                                            style={{ backgroundColor: variant.colorCode }}
                                            title={variant.colorCode}
                                          ></span>
                                        </div>
                                      )}

                                      <span className="badge badge-ghost badge-sm text-[11px] font-medium text-base-content/70">
                                        {filteredVariantItems.length} Sizes
                                      </span>
                                    </div>

                                    <div className="hidden md:flex items-center gap-8 text-xs">
                                      <div className="font-semibold text-emerald-600">{priceRangeText}</div>
                                      <div className="font-semibold text-indigo-600">
                                        {variantSoldQty} Orders
                                      </div>
                                      <div className="text-base-content/70">
                                        Total Stock: <strong className="text-base-content">{totalVariantStock}</strong>
                                      </div>
                                    </div>

                                    {/* Status & Restore controls */}
                                    <div className="flex items-center gap-4 sm:gap-6">
                                      <div onClick={(e) => e.stopPropagation()}>
                                        {showVariantControls ? (
                                          role === "ADMIN" || role === "MODERATOR" ? (
                                            <select
                                              defaultValue={variant.isActive ? "ACTIVE" : "INACTIVE"}
                                              className="select select-bordered select-xs w-24 focus:outline-none"
                                              onChange={(e) =>
                                                updateProductVariantStatusMutation({
                                                  productId: product.id,
                                                  variantId: variant.id,
                                                  status: e.target.value,
                                                })
                                              }
                                            >
                                              <option value="ACTIVE">ACTIVE</option>
                                              <option value="INACTIVE">INACTIVE</option>
                                            </select>
                                          ) : (
                                            <span className="badge badge-xs font-semibold p-2 badge-success text-white">
                                              ACTIVE
                                            </span>
                                          )
                                        ) : null}
                                      </div>
                                      {/* product variant restore */}
                                      {showVariantControls && (role === "ADMIN" || role === "MODERATOR") && (
                                        <div onClick={(e) => e.stopPropagation()}>
                                          <button onClick={() => handleProductVariantRestore(product.id, variant.id)} className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none text-[11px] px-3"
                                          >
                                            Restore
                                          </button>
                                        </div>
                                      )}

                                      <span className="text-xs text-base-content/60 font-bold ml-1">
                                        {isSizesOpen ? "▲" : "▼"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Sub-Items (Sizes) List */}
                                  {isSizesOpen && (
                                    <div className="border-t border-base-200/80 bg-base-200/20 p-2.5 flex flex-col gap-1.5">
                                      {filteredVariantItems.map((item: any, itemIdx: number) => {
                                        const itemSoldQty = item.totalSold || 0;
                                        const isItemDeleted = item.isDeleted;
                                        const showItemControls =
                                          isProductDeleted || isVariantDeleted || isItemDeleted;

                                        return (
                                          <div key={item.id || itemIdx} className="flex items-center justify-between gap-4 py-1.5 px-3 rounded-lg bg-base-100 hover:bg-base-200/50 transition-colors w-full border border-base-200/50">
                                            <div className="flex items-center gap-2 w-1/4">
                                              {item?.varientName && (
                                                <span className="text-xs font-semibold text-base-content/80">
                                                  {item.varientName}
                                                </span>
                                              )}
                                              {item?.size && (
                                                <span className="badge badge-outline badge-sm text-xs font-medium">
                                                  {item.size}
                                                </span>
                                              )}
                                            </div>

                                            <div className="text-xs sm:text-sm font-semibold text-emerald-600 w-1/6 text-center">
                                              ৳{item?.sellPrice || "0"}
                                            </div>

                                            <div className="text-xs font-semibold text-indigo-600 w-1/6 text-center">
                                              {itemSoldQty} Orders
                                            </div>

                                            <div className="text-xs text-base-content/70 w-1/6 text-center">
                                              Stock: <strong className="text-base-content">{item?.stock || 0}</strong>
                                            </div>

                                            <div className="w-1/6 flex justify-center">
                                              {showItemControls ? (
                                                role === "ADMIN" || role === "MODERATOR" ? (
                                                  <select
                                                    defaultValue={
                                                      item.isActive ?? variant.isActive ? "ACTIVE" : "INACTIVE"
                                                    }
                                                    className="select select-bordered select-xs w-24 focus:outline-none"
                                                    onChange={(e) =>
                                                      updateProductVariantItemStatusMutation({
                                                        productId: product.id,
                                                        variantId: variant.id,
                                                        itemId: item.id,
                                                        status: e.target.value,
                                                      })
                                                    }
                                                  >
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="INACTIVE">INACTIVE</option>
                                                  </select>
                                                ) : (
                                                  <span className="badge badge-xs font-semibold p-2 badge-success text-white">
                                                    ACTIVE
                                                  </span>
                                                )
                                              ) : null}
                                            </div>
                                            {/* product variant item */}
                                            <div className="w-1/12 flex justify-end">
                                              {showItemControls && (role === "ADMIN" || role === "MODERATOR") && (
                                                <button onClick={() => handleProductVariantItemRestore(product.id,variant.id,item.id)}className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none text-[11px] px-3">Restore</button>)}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
          )}
          
        </table>
      </div>
    </div>
  );
};

export default ProductTable;