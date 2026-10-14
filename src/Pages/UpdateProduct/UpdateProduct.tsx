import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../api/axiosInstance";

// Basic Interfaces
interface BasicData {
  name: string;
  brand: string;
  categoryId: string;
  isActive: string;
  shortDescription: string;
  description: string;
  thumbnailImage: File | string | null;
}

interface SingleProductData {
  colorCode: string;
  images: (File | string)[];
  size: string;
  stock: string;
  costPrice: string;
  sellPrice: string;
  isActive: string;
}

interface VariantItem {
  id: number | string;
  isExisting?: boolean;
  size: string;
  stock: string;
  costPrice: string;
  sellPrice: string;
  varientName: string;
  isActive: string;
}

interface Variant {
  id: number | string;
  isExisting?: boolean;
  colorCode: string;
  images: (File | string)[];
  isActive: string;
  items: VariantItem[];
}

const getPublicCategories = async () => {
  const response = await axiosInstance.get("/categories/active");
  return response.data;
};

const fetchProductDetail = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data?.data;
};

// Helper: safe image URL resolver
const resolveImageUrl = (imgObj: any) => {
  if (!imgObj) return "/placeholder-product.png";
  if (imgObj instanceof File) {
    return URL.createObjectURL(imgObj);
  }
  const url = typeof imgObj === "string" ? imgObj : imgObj.productImage || imgObj.url || "";
  if (!url) return "/placeholder-product.png";
  return url.startsWith("http") || url.startsWith("data:") ? url : `http://localhost:5173${url}`;
};

// Main Parent Component
const UpdateProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => fetchProductDetail(id as string),
    enabled: !!id,
  });

  const { data: categoryResponse, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["publicCategories"],
    queryFn: getPublicCategories,
  });

  const categories = categoryResponse?.data || [];
  console.log("category",categories);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (isError || !product) {
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
    <UpdateProductForm
      key={product.id || id}
      product={product}
      categories={categories}
      isCategoryLoading={isCategoryLoading}
      id={id as string}
    />
  );
};

// Form Child Component
const UpdateProductForm = ({
  product,
  categories,
  isCategoryLoading,
  id,
}: {
  product: any;
  categories: any[];
  isCategoryLoading: boolean;
  id: string;
}) => {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const generatevarientNameCode = (productName: string) => {
    const prefix = (productName || "PRD").slice(0, 3).toUpperCase();
    const randomNum = Math.floor(10 + (crypto.getRandomValues(new Uint32Array(1))[0] % 90));
    return `${prefix}-${randomNum}`;
  };

  const productType = product?.productType || "SINGLE";

  // State Initialization
  const [basicData, setBasicData] = useState<BasicData>({
    name: product?.name || "",
    brand: product?.brand || "",
    categoryId: product?.category?.id || product?.categoryId || "",
    isActive: String(product?.isActive ?? true),
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    thumbnailImage: product?.thumbnailImage || null,
  });

  // Filter Active Variants
  const activeVariants = (product?.variants || []).filter(
    (v: any) => v.isDeleted !== true && !v.deletedAt
  );

  const firstVariant = activeVariants[0];
  const firstItem = (firstVariant?.variantItems || firstVariant?.options || []).find(
    (item: any) => item.isDeleted !== true && !item.deletedAt
  );

  const [singleData, setSingleData] = useState<SingleProductData>({
    colorCode: product?.colorCode || firstVariant?.colorCode || "",
    images:
      firstVariant?.images?.length > 0
        ? firstVariant.images.map((img: any) => typeof img === "string" ? img : img.productImage || img.url)
        : product?.images?.length > 0
        ? product.images
        : [],
    size: product?.size || firstItem?.size || "",
    stock: String(product?.stock ?? firstItem?.stock ?? 0),
    costPrice: String(product?.costPrice ?? firstItem?.costPrice ?? 0),
    sellPrice: String(product?.sellPrice ?? firstItem?.sellPrice ?? 0),
    isActive: String(product?.isActive ?? firstItem?.isActive ?? true),
  });

  // Variants State Initialization
  const [variants, setVariants] = useState<Variant[]>(() => {
    if (productType === "VARIANT" && product?.variants?.length) {
      return product.variants
        .filter((v: any) => v.isDeleted !== true && !v.deletedAt)
        .map((v: any, index: number) => {
          const validItems = (v.variantItems || v.options || []).filter(
            (item: any) => item.isDeleted !== true && !item.deletedAt
          );

          return {
            id: v.id || `existing_${index}`,
            isExisting: true,
            colorCode: v.colorCode || "",
            images: (v.images || []).map((img: any) => typeof img === "string" ? img : img.productImage || img.url),
            isActive: String(v.isActive ?? true),
            items: validItems.map((item: any, iIdx: number) => ({
              id: item.id || `existing_item_${iIdx}`,
              isExisting: true,
              size: item.size || "",
              stock: String(item.stock ?? 0),
              costPrice: String(item.costPrice ?? 0),
              sellPrice: String(item.sellPrice ?? 0),
              varientName: item.name || item.varientName || item.variantName || "",
              isActive: String(item.isActive ?? true),
            })),
          };
        });
    }
    return [];
  });

  // Handlers
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSingleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setBasicData((prev) => ({ ...prev, thumbnailImage: file }));
    }
  };

  const removeThumbnail = () => {
    setBasicData((prev) => ({ ...prev, thumbnailImage: null }));
    const thumbnailInput = document.getElementById("thumbnailInput") as HTMLInputElement;
    if (thumbnailInput) {
      thumbnailInput.value = "";
    }
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSingleData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
      e.target.value = "";
    }
  };

  const removeSingleImage = (index: number) => {
    setSingleData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVariantImageUpload = (variantId: number | string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setVariants((prev) =>
        prev.map((item) => (item.id === variantId ? { ...item, images: [...item.images, ...filesArray] } : item))
      );
      e.target.value = "";
    }
  };

  const removeVariantImage = (variantId: number | string, imageIndex: number) => {
    setVariants((prev) =>
      prev.map((item) =>
        item.id === variantId
          ? {
              ...item,
              images: item.images.filter((_, index) => index !== imageIndex),
            }
          : item
      )
    );
  };

  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: `new_${crypto.getRandomValues(new Uint32Array(1))[0]}`,
      isExisting: false,
      colorCode: "",
      images: [],
      isActive: "true",
      items: [
        {
          id: `new_item_${crypto.getRandomValues(new Uint32Array(1))[0]}`,
          isExisting: false,
          size: "",
          stock: "",
          costPrice: "",
          sellPrice: "",
          varientName: generatevarientNameCode(basicData.name),
          isActive: "true",
        },
      ],
    };
    setVariants([newVariant, ...variants]);
  };

  const handleRemoveVariant = (variantId: number | string) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const handleAddSize = (variantId: number | string) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newItem: VariantItem = {
            id: `new_item_${crypto.getRandomValues(new Uint32Array(1))[0]}`,
            isExisting: false,
            size: "",
            stock: "",
            costPrice: "",
            sellPrice: "",
            varientName: generatevarientNameCode(basicData.name),
            isActive: "true",
          };
          return { ...v, items: [newItem, ...v.items] };
        }
        return v;
      })
    );
  };

  const handleRemoveSize = (variantId: number | string, itemId: number | string) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          return {
            ...v,
            items: v.items.filter((item) => item.id !== itemId),
          };
        }
        return v;
      })
    );
  };

  const handleVariantChange = (variantId: number | string, field: string, value: string) => {
    setVariants(variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)));
  };

  const handleItemChange = (variantId: number | string, itemId: number | string, field: string, value: string) => {
    setVariants((prevVariants) =>
      prevVariants.map((v) => {
        if (v.id === variantId) {
          const updatedItems = v.items.map((item) => {
            if (item.id === itemId) {
              const updatedItem = { ...item, [field]: value };
              if (field === "size") {
                if (value.trim() !== "") {
                  const prefix = (basicData.name || "PRD").slice(0, 3).toUpperCase();
                  const randomNum = Math.floor(100 + Math.random() * 900);
                  updatedItem.varientName = `${prefix}-${value.toUpperCase()}${randomNum}`;
                } else {
                  updatedItem.varientName = "";
                }
              }
              return updatedItem;
            }
            return item;
          });
          return { ...v, items: updatedItems };
        }
        return v;
      })
    );
  };

  const validateForm = () => {
    if (!basicData.thumbnailImage) {
      Toast.fire({
        icon: "error",
        title: "Product thumbnail image is required!",
      });
      return false;
    }

    if (productType === "SINGLE") {
      if (!singleData.images || singleData.images.length === 0) {
        Toast.fire({
          icon: "error",
          title: "At least one product image is required for Single Product!",
        });
        return false;
      }
    } else {
      if (variants.length === 0) {
        Toast.fire({
          icon: "error",
          title: "Must keep at least 1 variant!",
        });
        return false;
      }

      const colorCodes = variants.map((v) => v.colorCode?.trim().toLowerCase()).filter(Boolean);
      if (new Set(colorCodes).size !== colorCodes.length) {
        Toast.fire({
          icon: "error",
          title: "Duplicate color detected! Each variant must have a unique color.",
        });
        return false;
      }

      for (let vIndex = 0; vIndex < variants.length; vIndex++) {
        const v = variants[vIndex];
        if (!v.images || v.images.length === 0) {
          Toast.fire({
            icon: "error",
            title: `At least one image is required for Variant #${variants.length - vIndex}!`,
          });
          return false;
        }

        if (!v.items || v.items.length === 0) {
          Toast.fire({
            icon: "error",
            title: `At least 1 size option is required for Variant #${variants.length - vIndex}!`,
          });
          return false;
        }

        const sizes = v.items.map((item) => item.size?.trim().toLowerCase()).filter(Boolean);
        if (new Set(sizes).size !== sizes.length) {
          Toast.fire({
            icon: "error",
            title: `Duplicate size detected in Variant #${variants.length - vIndex}!`,
          });
          return false;
        }
      }
    }
    return true;
  };

  // 🛠️ API CALL Mutation: PATCH /api/v1/products/:id
  const { mutate: updateProductMutation } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.patch(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      Toast.fire({ icon: "success", title: data.message || "Product updated successfully!" });
      setTimeout(() => {
        setActiveBtn(false);
        navigate(-1);
      }, 1500);
    },
    onError: (error: any) => {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Failed to update product!",
      });
      setTimeout(() => setActiveBtn(false), 1500);
    },
  });

  // 🛠️ Updated Submit Handler Logic
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("productType", productType);
    formData.append("name", basicData.name);
    formData.append("brand", basicData.brand || "");
    formData.append("categoryId", basicData.categoryId);
    formData.append("isActive", basicData.isActive);
    formData.append("shortDescription", basicData.shortDescription || "");
    formData.append("description", basicData.description || "");

    // 1. Thumbnail Image (নতুন ফাইল নাকি আগের ইউআরএল)
    if (basicData.thumbnailImage instanceof File) {
      formData.append("thumbnailImage", basicData.thumbnailImage);
    } else if (typeof basicData.thumbnailImage === "string") {
      formData.append("existingThumbnailImage", basicData.thumbnailImage);
    }

    // 2. SINGLE Product Logic
    if (productType === "SINGLE") {
      formData.append("colorCode", singleData.colorCode || "");
      formData.append("size", singleData.size || "");
      formData.append("stock", String(singleData.stock || 0));
      formData.append("costPrice", String(singleData.costPrice || 0));
      formData.append("sellPrice", String(singleData.sellPrice || 0));

      const existingImages: string[] = [];
      if (singleData.images?.length > 0) {
        singleData.images.forEach((img) => {
          if (img instanceof File) {
            formData.append("productImage", img); // নতুন ফাইল
          } else if (typeof img === "string") {
            existingImages.push(img); // পুরানো ইমেজের ইউআরএল
          }
        });
      }
      formData.append("existingImages", JSON.stringify(existingImages));
    } 
    // 3. VARIANT Product Logic
    else {
      const variantsPayload = variants.map((v) => {
        const existingVariantImages: string[] = [];
        (v.images || []).forEach((img) => {
          if (typeof img === "string") {
            existingVariantImages.push(img);
          }
        });

        return {
          id: v.isExisting ? v.id : undefined,
          colorCode: v.colorCode,
          isActive: String(v.isActive) === "true" || v.isActive === true,
          existingImages: existingVariantImages, // এই ভ্যারিয়েন্টের পুরানো ইমেজ ইউআরএলসমূহ
          options: (v.items || []).map((item: any) => ({
            id: item.isExisting ? item.id : undefined,
            size: item.size,
            varientName: item.varientName || "",
            stock: Number(item.stock || 0),
            costPrice: Number(item.costPrice || 0),
            sellPrice: Number(item.sellPrice || 0),
            isActive: String(item.isActive) === "true" || item.isActive === true,
          })),
        };
      });

      formData.append("variants", JSON.stringify(variantsPayload));

      // নতুন আপলোড করা ফাইলগুলো ডায়নামিক কি দিয়ে অ্যাপেন্ড করা
      variants.forEach((v, vIndex) => {
        if (v.images?.length > 0) {
          v.images.forEach((img) => {
            if (img instanceof File) {
              formData.append(`variant_images_${vIndex}`, img);
            }
          });
        }
      });
    }

    setActiveBtn(true);
    updateProductMutation(formData);
  };

  return (
    <div className="mt-10 flex items-center justify-center bg-base-200 px-2 py-8">
      <div className="card w-full max-w-6xl bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-4 lg:p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Update Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: BASIC INFORMATION */}
            <div className="p-2 rounded-xl border border-base-300 bg-base-100 space-y-4">
              <h3 className="text-md font-bold border-b border-base-300 pb-2">Basic Information</h3>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Thumbnail Image *</span>
                </label>
                <input
                  id="thumbnailInput"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="file-input file-input-bordered w-full"
                />
                {basicData.thumbnailImage && (
                  <div className="mt-3 relative w-24 h-24 border rounded-lg overflow-hidden group bg-base-200 p-1">
                    <img
                      src={resolveImageUrl(basicData.thumbnailImage)}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Product Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={basicData.name}
                    onChange={handleBasicChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Brand</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Enter brand name"
                    value={basicData.brand}
                    onChange={handleBasicChange}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Category *</span>
                  </label>
                  <select
                    name="categoryId"
                    value={basicData.categoryId}
                    onChange={(e) => setBasicData((prev) => ({ ...prev, categoryId: e.target.value }))}
                    className="select select-bordered w-full"
                    required
                    disabled={categories.length === 0}
                  >
                    <option value="" disabled>
                      {isCategoryLoading
                        ? "Loading categories..."
                        : categories.length === 0
                        ? "No active categories found"
                        : "Select Category"}
                    </option>
                    {categories.map((cat: any) => (
                      <option key={cat.id || cat._id} value={cat.id || cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Status</span>
                  </label>
                  <select
                    name="isActive"
                    value={basicData.isActive}
                    onChange={handleBasicChange}
                    className="select select-bordered w-full"
                  >
                    <option value="true">ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Short Description</span>
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    placeholder="Enter short description"
                    value={basicData.shortDescription}
                    onChange={handleBasicChange}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter description"
                    value={basicData.description}
                    onChange={handleBasicChange}
                    className="textarea textarea-bordered w-full h-24"
                  ></textarea>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">Product Type (Locked)</span>
                  </label>
                  <input
                    type="text"
                    value={productType === "SINGLE" ? "SINGLE (Standard Product)" : "VARIANT (Multiple Colors/Sizes)"}
                    disabled
                    className="input input-bordered w-full font-semibold bg-base-200 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: SINGLE PRODUCT TYPE */}
            {productType === "SINGLE" && (
              <div className="p-2 rounded-xl border border-base-300 bg-base-100 space-y-4">
                <h3 className="text-md font-bold border-b border-base-300 pb-2">Single Product Details</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Product Images *</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSingleImageUpload}
                    className="file-input file-input-bordered w-full"
                  />
                  {singleData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {singleData.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative w-20 h-20 border rounded-lg overflow-hidden bg-base-200 p-1">
                          <img
                            src={resolveImageUrl(img)}
                            alt={`Preview ${imgIndex}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeSingleImage(imgIndex)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Color Code</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="color" name="colorCode" value={singleData.colorCode || ""} onChange={handleSingleChange} className="w-12 h-12 p-1 rounded-lg border border-base-300 cursor-pointer bg-base-100"/>
                      <input
                        type="text"
                        name="colorCode"
                        value={singleData.colorCode || ""}
                        onChange={handleSingleChange}
                        placeholder="#000000"
                        className="input input-bordered w-full uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Size / Weight</span>
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={singleData.size}
                      onChange={handleSingleChange}
                      placeholder="e.g. XL, 500g"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Stock Quantity *</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={singleData.stock}
                      onChange={handleSingleChange}
                      placeholder="0"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Cost Price *</span>
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      value={singleData.costPrice}
                      onChange={handleSingleChange}
                      placeholder="0.00"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Sell Price *</span>
                    </label>
                    <input
                      type="number"
                      name="sellPrice"
                      value={singleData.sellPrice}
                      onChange={handleSingleChange}
                      placeholder="0.00"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Profit</span>
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={(Number(singleData.sellPrice || 0) - Number(singleData.costPrice || 0)).toFixed(2)}
                      className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary w-full" disabled={activeBtn}>
                    {activeBtn ? "Updating..." : "Update Product"}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: VARIANT PRODUCT TYPE */}
            {productType === "VARIANT" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-base-300 pb-2">
                  <h3 className="text-lg font-bold">Variant Product</h3>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="btn btn-sm bg-green-500 text-white text-[10px] sm:text-xs md:text-sm"
                  >
                    Add Variant
                  </button>
                </div>

                {variants.length === 0 ? (
                  <div className="p-4 rounded-xl border border-warning/40 bg-warning/10 text-warning-content flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base">No active variants found!</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        All variants of this product might be deleted or not created yet. Please restore variants from the deleted table or click "Add Variant" to create a new one.
                      </p>
                    </div>
                  </div>
                ) : (
                  variants.map((variant, vIndex) => {
                    const isMultipleSizes = variant.items.length > 1;

                    return (
                      <div
                        key={variant.id}
                        className="p-4 rounded-xl border border-base-300 bg-base-100 space-y-4 relative shadow-sm"
                      >
                        <div className="flex items-center justify-between bg-base-200 p-2 rounded-lg">
                          <span className="font-semibold text-sm">Variant #{variants.length - vIndex}</span>
                          {!variant.isExisting && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(variant.id)}
                              className="btn btn-sm bg-red-500 text-white text-[10px] sm:text-xs md:text-sm"
                            >
                              Remove Variant
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">Color Code</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={variant.colorCode || ""} onChange={(e) => handleVariantChange(variant.id, "colorCode", e.target.value)} className="w-12 h-12 p-1 rounded-lg border border-base-300 cursor-pointer bg-base-100"/>
                              <input
                                type="text"
                                value={variant.colorCode || ""}
                                onChange={(e) => handleVariantChange(variant.id, "colorCode", e.target.value)}
                                placeholder="#000000"
                                className="input input-bordered w-full uppercase font-mono"
                              />
                            </div>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">Product Images *</span>
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleVariantImageUpload(variant.id, e)}
                              className="file-input file-input-bordered w-full"
                            />

                            {variant.images && variant.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {variant.images.map((imgObj, imgIdx) => (
                                  <div key={imgIdx} className="relative w-16 h-16 border rounded-lg overflow-hidden bg-base-200 p-1">
                                    <img
                                      src={resolveImageUrl(imgObj)}
                                      alt={`Variant Image ${imgIdx}`}
                                      className="w-full h-full object-cover rounded"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeVariantImage(variant.id, imgIdx)}
                                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold hover:bg-red-700"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">Status</span>
                            </label>
                            <select
                              value={variant.isActive}
                              onChange={(e) => handleVariantChange(variant.id, "isActive", e.target.value)}
                              className="select select-bordered w-full"
                            >
                              <option value="true">ACTIVE</option>
                              <option value="false">INACTIVE</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between pt-2 border-t border-base-200">
                            <h4 className="text-sm font-bold">Option / Size Fields</h4>
                            <button
                              type="button"
                              onClick={() => handleAddSize(variant.id)}
                              className="btn btn-sm bg-green-500 text-white text-[10px] sm:text-xs md:text-sm"
                            >
                              Add Size
                            </button>
                          </div>

                          {variant.items.map((item) => (
                            <div key={item.id} className="p-3 bg-base-200 rounded-lg space-y-3 relative">
                              {!item.isExisting && (
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSize(variant.id, item.id)}
                                    className="btn btn-sm bg-red-500 text-white text-[10px] sm:text-xs md:text-sm"
                                  >
                                    Remove Size
                                  </button>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {isMultipleSizes && (
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text font-medium">Variant Name</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.varientName}
                                      onChange={(e) =>
                                        handleItemChange(variant.id, item.id, "varientName", e.target.value)
                                      }
                                      placeholder="e.g. TSH-XL"
                                      className="input input-bordered w-full"
                                    />
                                  </div>
                                )}

                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text font-medium">Size / Weight</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={item.size}
                                    onChange={(e) => handleItemChange(variant.id, item.id, "size", e.target.value)}
                                    placeholder="e.g. M, XL, 500g"
                                    className="input input-bordered w-full"
                                  />
                                </div>

                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text font-medium">Stock *</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={item.stock}
                                    onChange={(e) => handleItemChange(variant.id, item.id, "stock", e.target.value)}
                                    placeholder="0"
                                    className="input input-bordered w-full"
                                    required
                                  />
                                </div>

                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text font-medium">Cost Price *</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={item.costPrice}
                                    onChange={(e) => handleItemChange(variant.id, item.id, "costPrice", e.target.value)}
                                    placeholder="0.00"
                                    className="input input-bordered w-full"
                                    required
                                  />
                                </div>

                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text font-medium">Sell Price *</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={item.sellPrice}
                                    onChange={(e) => handleItemChange(variant.id, item.id, "sellPrice", e.target.value)}
                                    placeholder="0.00"
                                    className="input input-bordered w-full"
                                    required
                                  />
                                </div>

                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text font-medium">Profit</span>
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="0.00"
                                    value={(Number(item.sellPrice || 0) - Number(item.costPrice || 0)).toFixed(2)}
                                    className="input input-bordered w-full bg-base-300 cursor-not-allowed"
                                    readOnly
                                  />
                                </div>

                                {isMultipleSizes && (
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text font-medium">Item Status</span>
                                    </label>
                                    <select
                                      value={item.isActive}
                                      onChange={(e) => handleItemChange(variant.id, item.id, "isActive", e.target.value)}
                                      className="select select-bordered w-full"
                                    >
                                      <option value="true">ACTIVE</option>
                                      <option value="false">INACTIVE</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}

                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary w-full" disabled={activeBtn}>
                    {activeBtn ? "Updating..." : "Update Product"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;