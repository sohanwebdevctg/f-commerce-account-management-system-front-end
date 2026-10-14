import { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";
import {useMutation, useQuery } from "@tanstack/react-query";

// basic data
interface BasicData {
  name: string;
  brand: string;
  categoryId: string;
  isActive: string;
  shortDescription: string;
  description: string;
  thumbnailImage: File | null;
}

// Single Product State
interface SingleProductData {
  colorCode: string;
  images: File[];
  size: string;
  stock: string;
  costPrice: string;
  sellPrice: string;
  // minimumPrice: string;
  // maximumPrice: string;
  // vatPercent: string;
  // discountPercent: string;
  isActive: string;
}

interface VariantItem {
  id: number;
  size: string;
  stock: string;
  costPrice: string;
  sellPrice: string;
  // minimumPrice: string;
  // maximumPrice: string;
  // vatPercent: string;
  // discountPercent: string;
  varientName: string;
  isActive: string;
}

interface Variant {
  id: number;
  colorCode: string;
  images: File[];
  isActive: string;
  items: VariantItem[];
}


// Get all public categories for Create Product Dropdown
const getPublicCategories = async () => {
  const response = await axiosInstance.get("/categories/active");
  return response.data;
};

const CreateProduct = () => {
  const [productType, setProductType] = useState("SINGLE");
  const [activeBtn, setActiveBtn] = useState(false);

  // SweetAlert Toast Notification Config
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });

  // TanStack Query for Public Categories
const {  data: categoryResponse,  isLoading: isCategoryLoading} = useQuery({
  queryKey: ["publicCategories"],
  queryFn: getPublicCategories,
});

// Extract the category list from the response (based on your API response structure)
const categories = categoryResponse?.data || [];

// Auto Variant Name Helper Function
const generatevarientNameCode = (productName: string) => {
  const prefix = (productName || "PRD").slice(0, 3).toUpperCase();
  const randomNum = Math.floor(10 + (crypto.getRandomValues(new Uint32Array(1))[0] % 90));
  return `${prefix}-${randomNum}`;
};

  // 1. Basic Information State (Thumbnail সহ)
  const [basicData, setBasicData] = useState<BasicData>({
    name: "",
    brand: "",
    categoryId: "",
    isActive: "true",
    shortDescription: "",
    description: "",
    thumbnailImage: null,
  });

// 2. Single Product State (Multiple Images সহ)
const [singleData, setSingleData] = useState<SingleProductData>({
  colorCode: "",
  images: [],
  size: "",
  stock: "",
  costPrice: "",
  sellPrice: "",
  // minimumPrice: "",
  // maximumPrice: "",
  // vatPercent: "",
  // discountPercent: "",
  isActive: "true",
});

  // 3. Multiple Variant State (images Array সহ)
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: crypto.getRandomValues(new Uint32Array(1))[0],
      colorCode: "",
      images: [], // একাধিক ছবির জন্য
      isActive: "true",
      items: [
        {
          id: crypto.getRandomValues(new Uint32Array(1))[0],
          size: "",
          stock: "",
          costPrice: "",
          sellPrice: "",
          // minimumPrice: "",
          // maximumPrice: "",
          // vatPercent: "",
          // discountPercent: "",
          varientName: generatevarientNameCode(""),
          isActive: "true",
        },
      ],
    },
  ]);

  // Basic Information Change Handler
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicData((prev) => ({ ...prev, [name]: value }));
  };

  // Single Product Change Handler
  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSingleData((prev) => ({ ...prev, [name]: value }));
  };

  // Thumbnail Handlers
const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files && e.target.files[0]
  if (file) {
    setBasicData((prev) => ({ ...prev, thumbnailImage: file }));
  }
};

 const removeThumbnail = () => {
  setBasicData((prev) => ({ ...prev, thumbnailImage: null }));
  
  // ইনপুট ফিল্ডটি খালি করে দেওয়ার জন্য (যাতে নতুন ইমেজ আবার সিলেক্ট করা যায়)
  const thumbnailInput = document.getElementById("thumbnailInput") as HTMLInputElement;
  if (thumbnailInput) {
    thumbnailInput.value = "";
  }
};

  // Single Product Image Handlers
  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSingleData((prev) => ({...prev, images: [...prev.images, ...filesArray],
      }));
    e.target.value = "";
    }};

  const removeSingleImage = (index:number) => {
    setSingleData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Variant Image Handlers
  const handleVariantImageUpload = (variantId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setVariants((prev) => prev.map((item) => item.id === variantId ? { ...item, images: [...item.images, ...filesArray] } : item));
    e.target.value = "";
    }
  };

  const removeVariantImage = (variantId:number, imageIndex:number) => {
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

    // ১. নতুন ভ্যারিয়েন্ট সেকশন যুক্ত করার ফাংশন (Prepend: সবার উপরে যুক্ত হবে)
const handleAddVariant = () => {
  const newVariant = {
    id: crypto.getRandomValues(new Uint32Array(1))[0],
    colorCode: "",
    images: [], // productImage: null এর জায়গায় images: []
    isActive: "true",
    items: [
      {
        id: crypto.getRandomValues(new Uint32Array(1))[0],
        size: "",
        stock: "",
        costPrice: "",
        sellPrice: "",
        // minimumPrice: "",
        // maximumPrice: "",
        // vatPercent: "",
        // discountPercent: "",
        varientName: generatevarientNameCode(basicData.name),
        isActive: "true",
      },
    ],
  };
  setVariants([newVariant, ...variants]);
};

// ২. নির্দিষ্ট ভ্যারিয়েন্ট সেকশন মুছে ফেলার ফাংশন
const handleRemoveVariant = (variantId:number) => {
  if (variants.length === 1) {
    Toast.fire({ icon: "warning", title: "It is mandatory to include at least one variant section!",});
    return;
  }
  setVariants(variants.filter((v) => v.id !== variantId));
};

    // ৩. নির্দিষ্ট ভ্যারিয়েন্টে নতুন সাইজ (Item) যুক্ত করার ফাংশন
const handleAddSize = (variantId:number) => {
  setVariants(
    variants.map((v) => {
      if (v.id === variantId) {
        const newItem = {
          id: crypto.getRandomValues(new Uint32Array(1))[0],
          size: "",
          stock: "",
          costPrice: "",
          sellPrice: "",
          // minimumPrice: "",
          // maximumPrice: "",
          // vatPercent: "",
          // discountPercent: "",
          varientName: generatevarientNameCode(basicData.name),
          isActive: "true",
        };
        return { ...v, items: [...v.items, newItem] };
      }
      return v;
    })
  );
};

// ৪. নির্দিষ্ট ভ্যারিয়েন্ট থেকে সাইজ (Item) মুছে ফেলার ফাংশন
const handleRemoveSize = (variantId:number, itemId: number) => {
  setVariants(
    variants.map((v) => {
      if (v.id === variantId) {
        if (v.items.length === 1) {
          Toast.fire({ icon: "warning", title: "At least one size item is required!",});
          return v;
        }
        return {
          ...v,
          items: v.items.filter((item) => item.id !== itemId),
        };
      }
      return v;
    })
  );
};

  // ৫. ভ্যারিয়েন্ট লেভেলের চেঞ্জ হ্যান্ডলার (Color, Image, Status এর জন্য)
const handleVariantChange = (variantId:number, field: string, value: string) => {
  setVariants(
    variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
  );
};

// ৬. সাইজ/আইটেম লেভেলের চেঞ্জ হ্যান্ডলার
const handleItemChange = (variantId: number, itemId: number, field: string, value: string) => {
  setVariants((prevVariants) =>
    prevVariants.map((v) => {
      if (v.id === variantId) {
        const updatedItems = v.items.map((item) => {
          if (item.id === itemId) {
            const updatedItem = { ...item, [field]: value };

            // সাইজ চেঞ্জ হলে: প্রোডাক্ট নাম (৩ অক্ষর) + সাইজ + র্যান্ডম ৩ ডিজিট নাম্বার (যেমন: TSH-XL038)
            if (field === "size") {
              if (value.trim() !== "") {
                const prefix = (basicData.name || "PRD").slice(0, 3).toUpperCase();
                const randomNum = Math.floor(100 + Math.random() * 900); // ৩ ডিজিটের র্যান্ডম নম্বর (100-999)
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

  // ১. resetForm ফাংশনটি এখানে ডিক্লেয়ার করুন
const resetForm = () => {
  setBasicData({
    name: "",
    brand: "",
    categoryId: "",
    isActive: "true",
    shortDescription: "",
    description: "",
    thumbnailImage: null,
  });

  setSingleData({
    colorCode: "",
    images: [],
    size: "",
    stock: "",
    costPrice: "",
    sellPrice: "",
    // minimumPrice: "",
    // maximumPrice: "",
    // vatPercent: "",
    // discountPercent: "",
    isActive: "true",
  });

  setVariants([
    {
      id: crypto.getRandomValues(new Uint32Array(1))[0],
      colorCode: "",
      images: [],
      isActive: "true",
      items: [
        {
          id: crypto.getRandomValues(new Uint32Array(1))[0],
          size: "",
          stock: "",
          costPrice: "",
          sellPrice: "",
          // minimumPrice: "",
          // maximumPrice: "",
          // vatPercent: "",
          // discountPercent: "",
          varientName: generatevarientNameCode(""),
          isActive: "true",
        },
      ],
    },
  ]);

  const thumbnailInput = document.getElementById("thumbnailInput") as HTMLInputElement;
  if (thumbnailInput) {
    thumbnailInput.value = "";
  }
};

  // Duplicate Color and Size Validation Helper
  const validateForm = () => {
    if (productType === "VARIANT") {
      // ১. প্রোডাক্টের অধীনে একাধিক ভ্যারিয়েন্টে একই ColorCode চেক করা
      const colorCodes = variants
        .map((v) => v.colorCode?.trim().toLowerCase())
        .filter(Boolean);

      const hasDuplicateColor = new Set(colorCodes).size !== colorCodes.length;

      if (hasDuplicateColor) {
        Toast.fire({
          icon: "error",
          title: "Duplicate color detected! A product cannot have multiple variants with the same color.",
        });
        return false;
      }

      // ২. প্রতিটি ভ্যারিয়েন্টের অধীনে ডুপ্লিকেট Size চেক করা
      for (let vIndex = 0; vIndex < variants.length; vIndex++) {
        const variant = variants[vIndex];
        const sizes = (variant.items || [])
          .map((item) => item.size?.trim().toLowerCase())
          .filter(Boolean);

        const hasDuplicateSize = new Set(sizes).size !== sizes.length;

        if (hasDuplicateSize) {
          Toast.fire({
            icon: "error",
            title: `Duplicate size detected in Variant #${variants.length - vIndex}! Each size must be unique.`,
          });
          return false;
        }
      }
    }
    return true;
  };

  // call mutation
  const { mutate: productMutation } = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data",},
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      // show toast
      Toast.fire({ icon: "success", title: data.message });
      resetForm();
      setTimeout(() => {
        setActiveBtn(false);
      }, 1500);
    },
    onError: (error: any) => {
      // console.log("MUTATION ERROR:", error.response?.data || error);
      // show toast
      const rawMessage = error.response?.data?.message || error.message || "";

      // Prisma বা DB-এর গার্বেজ/অস্পষ্ট এরোর ফিল্টার করে সুন্দর মেসেজ
      if (
        rawMessage.includes("Unique constraint failed") ||
        rawMessage.includes("variantItems")
      ) {
        Toast.fire({
          icon: "error",
          title: "Failed to create product due to duplicate variants or sizes!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: rawMessage || "Something went wrong! Please try again.",
        });
      }
      setTimeout(() => {
        setActiveBtn(false);
      }, 1500);
    },
  });

  // Submit Handler
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  // 🛑 ডুপ্লিকেট কালার এবং ডুপ্লিকেট সাইজ চেক
    if (!validateForm()) {
      return;
    }

  // 🛑 ১. Thumbnail Image চেক
    if (!basicData.thumbnailImage) {
      Toast.fire({
        icon: "error",
        title: "Product thumbnail image is required!",
      });
      return;
    }

    // 🛑 ২. Single Product-এর জন্য Gallery Images (productImage) চেক
    if (productType === "SINGLE") {
      if (!singleData.images || singleData.images.length === 0) {
        Toast.fire({
          icon: "error",
          title: "At least one product image is required!",
        });
        return;
      }
    }

    // 🛑 ৩. Variant Product-এর জন্য Gallery Images চেক
    if (productType === "VARIANT") {
      const hasVariantImages = variants.some((v) => v.images && v.images.length > 0);
      if (!hasVariantImages) {
        Toast.fire({
          icon: "error",
          title: "At least one product image is required for variants!",
        });
        return;
      }
    }

  const formData = new FormData();

  // ১. Basic Information Append
  formData.append("productType", productType);
  formData.append("name", basicData.name);
  formData.append("brand", basicData.brand || "");
  formData.append("categoryId", basicData.categoryId);
  formData.append("isActive", basicData.isActive);
  formData.append("shortDescription", basicData.shortDescription || "");
  formData.append("description", basicData.description || "");

  // Thumbnail Image
  if (basicData.thumbnailImage) {
    formData.append("thumbnailImage", basicData.thumbnailImage);
  }

  // ২. SINGLE Product-এর ক্ষেত্রে
  
    if (productType === "SINGLE") {
    // সরাসরি Root-এ পাঠাতে হবে যাতে ব্যাকএন্ড req.body থেকে সরাসরি পায়
    formData.append("colorCode", singleData.colorCode || "");
    formData.append("size", singleData.size || "");
    formData.append("stock", String(singleData.stock || 0));
    formData.append("costPrice", String(singleData.costPrice || 0));
    formData.append("sellPrice", String(singleData.sellPrice || 0));
    // minimumPrice: Number(singleData.minimumPrice || 0),
      // maximumPrice: Number(singleData.maximumPrice || 0),
      // vatPercent: Number(singleData.vatPercent || 0),
      // discountPercent: Number(singleData.discountPercent || 0),

    // Multiple Images (নামটি অবশ্যই 'productImage' হতে হবে)
    if (singleData.images && singleData.images.length > 0) {
      singleData.images.forEach((file) => {
        formData.append("productImage", file);
      });
    }
  }
  // ৩. VARIANT Product-এর ক্ষেত্রে
  else {

    // VARIANT Product-এর ক্ষেত্রে
if (productType === "VARIANT") {
  const variantsPayload = variants.map((v) => ({
    colorCode: v.colorCode,
    options: (v.items || []).map((item: any) => ({
      size: item.size,
      varientName: item.variantName || item.varientName || "",
      stock: Number(item.stock || 0),
      costPrice: Number(item.costPrice || 0),
      sellPrice: Number(item.sellPrice || 0),
      isActive: String(item.isActive) === "true" || item.isActive === true,
    })),
  }));

  formData.append("variants", JSON.stringify(variantsPayload));

  // 🛠️ সমাধান: প্রতিটি ভ্যারিয়েন্টের জন্য আলাদা ফিল্ড নাম দিয়ে ইমেজ অ্যাপেন্ড করুন
  variants.forEach((v, vIndex) => {
    if (v.images && v.images.length > 0) {
      v.images.forEach((file) => {
        formData.append(`variant_images_${vIndex}`, file); // ইনডেক্স অনুযায়ী নাম
      });
    }
  });
}
  }

  
  // 🔍 DEBUG LOGS
  console.log("--- SUBMITTED FORM DATA ---");
  // console.log("--- VARIANTS PAYLOAD ---", variants);
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
  // ৪. Call mutation with FormData
  setActiveBtn(true);
  productMutation(formData);

  
};

  return (
    <div className="mt-10 flex items-center justify-center bg-base-200 px-2 py-8">
      <div className="card w-full max-w-6xl bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-4 lg:p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Create Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: BASIC INFORMATION */}
            <div className="p-2 rounded-xl border border-base-300 bg-base-100 space-y-4">
              <h3 className="text-md font-bold border-b border-base-300 pb-2">
                Basic Information
              </h3>

              {/* Thumbnail Image */}
              <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Thumbnail Image *</span>
              </label>
              <input id="thumbnailInput" type="file" accept="image/*" onChange={handleThumbnailUpload} className="file-input file-input-bordered w-full"/>
                {/* Thumbnail Preview Box */}
                {basicData.thumbnailImage && (
                  <div className="mt-3 relative w-24 h-24 border rounded-lg overflow-hidden group">
                    <img src={URL.createObjectURL(basicData.thumbnailImage)} alt="Thumbnail Preview" className="w-full h-full object-cover"/>
                    <button type="button" onClick={removeThumbnail} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700">✕</button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Product Name *</span>
                  </label>
                  <input type="text" name="name" placeholder="Enter product name" value={basicData.name} onChange={handleBasicChange} className="input input-bordered w-full" required/>
                </div>

                {/* Brand */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Brand</span>
                  </label>
                  <input type="text" name="brand" placeholder="Enter brand name" value={basicData.brand} onChange={handleBasicChange} className="input input-bordered w-full"/>
                </div>
                {/* Category Dropdown */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Category *</span>
                  </label>
                  <select name="categoryId" value={basicData.categoryId} onChange={(e) => setBasicData((prev) => ({ ...prev, categoryId: e.target.value }))} className="select select-bordered w-full" required disabled={categories.length === 0}>
                    <option value="" disabled>
                    {isCategoryLoading 
                      ? "Loading categories..." 
                      : categories.length === 0 
                      ? "No active categories found" 
                      : "Select Category"}
                  </option>
                    {categories.map((cat: any) => (<option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>))}
                  </select>
                  {/* ক্যাটাগরি না থাকলে নিচে ওয়ার্নিং মেসেজ */}
                    {!isCategoryLoading && categories.length === 0 && (
                      <label className="label">
                        <span className="label-text-alt text-error font-medium text-xs">
                          ⚠️ No active categories available.
                        </span>
                      </label>
                    )}
                </div>
                {/* Product Status */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Status</span>
                  </label>
                  <select name="isActive" value={basicData.isActive} onChange={handleBasicChange} className="select select-bordered w-full">
                    <option value="true">ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </div>
                {/* Short Description */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Short Description</span>
                  </label>
                  <input type="text" name="shortDescription" placeholder="Enter short description" value={basicData.shortDescription} onChange={handleBasicChange} className="input input-bordered w-full"/>
                </div>
                {/* Description */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea name="description" placeholder="Enter description" value={basicData.description} onChange={handleBasicChange} className="textarea textarea-bordered w-full h-24"
                  ></textarea>
                </div>

                {/* Product Type Select */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">Product Type *</span>
                  </label>
                  <select name="productType" value={productType} onChange={(e) => setProductType(e.target.value)} className="select select-bordered w-full font-semibold">
                    <option value="SINGLE">SINGLE (Standard Product)</option>
                    <option value="VARIANT">VARIANT (Multiple Colors/Sizes)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: SINGLE PRODUCT TYPE */}
            {productType === "SINGLE" && (
              <div className="p-2 rounded-xl border border-base-300 bg-base-100 space-y-4">
                <h3 className="text-md font-bold border-b border-base-300 pb-2">
                  Single Product Details
                </h3>
                {/* Images */}
                <div className="form-control">
                  <label className="label"> <span className="label-text font-medium">Product Images</span></label>
                  <input type="file" accept="image/*" multiple onChange={handleSingleImageUpload} className="file-input file-input-bordered w-full"/>
                    {/* Single Product Image Gallery */}
                    {singleData.images.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {singleData.images.map((file, imgIndex) => (
                          <div key={imgIndex} className="relative w-20 h-20 border rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt={`Preview ${imgIndex}`} className="w-full h-full object-cover"/><button type="button" onClick={() => removeSingleImage(imgIndex)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700">✕</button></div>))}</div>)}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Color Code */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Color Code</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Color Picker */}
                      <input type="color" name="colorCode" value={singleData.colorCode || ""} onChange={handleSingleChange}  className="w-12 h-12 p-1 rounded-lg border border-base-300 cursor-pointer bg-base-100" />
                      {/* Text Input for HEX */}
                      <input  type="text" name="colorCode" value={singleData.colorCode || ""} onChange={handleSingleChange}  placeholder="#000000" className="input input-bordered w-full uppercase font-mono" />
                    </div>
                  </div>
                  {/* Size / Weight */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Size / Weight</span>
                    </label>
                    <input type="text" name="size" value={singleData.size} onChange={handleSingleChange} placeholder="e.g. XL, 500g" className="input input-bordered w-full"/>
                  </div>

                  {/* Stock Quantity */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Stock Quantity *</span>
                    </label>
                    <input type="number" name="stock" value={singleData.stock} onChange={handleSingleChange} placeholder="0" className="input input-bordered w-full" required/>
                  </div>

                  {/* Cost Price */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Cost Price *</span>
                    </label>
                    <input type="number" name="costPrice" value={singleData.costPrice} onChange={handleSingleChange} placeholder="0.00" className="input input-bordered w-full" required
                    />
                  </div>

                  {/* Sell Price */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Sell Price *</span>
                    </label>
                    <input type="number" name="sellPrice" value={singleData.sellPrice} onChange={handleSingleChange} placeholder="0.00" className="input input-bordered w-full" required
                    />
                  </div>
                  {/* profit */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Profit</span>
                    </label>
                    <input type="number" name="profit" placeholder="0.00" 
                    value={(Number(singleData.sellPrice || 0) - Number(singleData.costPrice || 0)).toFixed(2)} className="input input-bordered w-full" readOnly/>
                  </div>

                  {/* Min Price */}
                  {/* <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Min Price</span>
                    </label>
                    <input type="number" name="minimumPrice" value={singleData.minimumPrice} onChange={handleSingleChange} placeholder="0.00" className="input input-bordered w-full"/>
                  </div> */}

                  {/* Max Price */}
                  {/* <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Max Price</span>
                    </label>
                    <input type="number" name="maximumPrice" value={singleData.maximumPrice} onChange={handleSingleChange} placeholder="0.00" className="input input-bordered w-full"/>
                  </div> */}

                  {/* VAT Percent */}
                  {/* <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">VAT (%)</span>
                    </label>
                    <input type="number" name="vatPercent" value={singleData.vatPercent} onChange={handleSingleChange} placeholder="0" className="input input-bordered w-full"/>
                  </div> */}

                  {/* Discount Percent */}
                  {/* <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Discount (%)</span>
                    </label>
                    <input type="number" name="discountPercent" value={singleData.discountPercent} onChange={handleSingleChange} placeholder="0" className="input input-bordered w-full"
                    />
                  </div> */}
                  {/* Product Variant Status */}
                  {
                    productType === "SINGLE" && <div className="form-control hidden">
                    <label className="label">
                      <span className="label-text font-medium">Status</span>
                    </label>
                    <select name="isActive" value={singleData.isActive} onChange={handleSingleChange} className="select select-bordered w-full">
                      <option value="true">ACTIVE</option>
                      <option value="false">INACTIVE</option>
                    </select>
                  </div>
                  }
                  
                </div>
                

                {/* Submit Button Inside Single Section */}
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary w-full" disabled={activeBtn}>
                  {activeBtn ? "Created..." : "Create"}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: VARIANT PRODUCT TYPE */}
            {productType === "VARIANT" && (
            <div className="space-y-6">
              {/* Header with Add Variant Button */}
              <div className="flex items-center justify-between border-b border-base-300 pb-2">
                <h3 className="text-lg font-bold">Variant Product</h3>
                <button type="button" onClick={handleAddVariant} className="btn btn-sm bg-green-500 text-white text-[10px] sm:text-xs md:text-sm"> Add Variant
                </button>
              </div>

              {/* Loop through Variant Sections */}
              {variants.map((variant, vIndex) => (<div key={variant.id} className="p-4 rounded-xl border border-base-300 bg-base-100 space-y-4 relative shadow-sm">
              {/* Top Right Remove Variant Button */}
              <div className="flex items-center justify-between bg-base-200 p-2 rounded-lg">
                <span className="font-semibold text-sm">
                  Variant #{variants.length - vIndex}
                </span>
                {variants.length > 1 && (<button type="button" onClick={() => handleRemoveVariant(variant.id)} className="btn btn-sm bg-red-500 text-white text-[10px] sm:text-xs md:text-sm">Remove Variant</button>)}
              </div>

              {/* Color, Images & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Color Picker */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Color Code</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={variant.colorCode || ""} onChange={(e) => handleVariantChange(variant.id, "colorCode", e.target.value)}
                      className="w-12 h-12 p-1 rounded-lg border border-base-300 cursor-pointer bg-base-100"/>
                    <input type="text" value={variant.colorCode || ""} onChange={(e) => handleVariantChange(variant.id, "colorCode", e.target.value)} placeholder="#000000" className="input input-bordered w-full uppercase font-mono"/>
                  </div>
                </div>
                {/* Variant Images Multiple Gallery */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Product Images</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleVariantImageUpload(variant.id, e)}
                    className="file-input file-input-bordered w-full"
                  />

  {/* Variant Image Preview Grid */}
  {variant.images && variant.images.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {variant.images.map((file, imgIdx) => (
        <div key={imgIdx} className="relative w-16 h-16 border rounded-lg overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={`Variant Image ${imgIdx}`}
            className="w-full h-full object-cover"
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

                {/* Main Variant Status */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Status</span>
                  </label>
                  <select
                    value={variant.isActive}
                    onChange={(e) =>
                      handleVariantChange(variant.id, "isActive", e.target.value)
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="true">ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Size & Options List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pt-2 border-t border-base-200">
                  <h4 className="text-sm font-bold">Option / Size Fields</h4>
                  <button type="button" onClick={() => handleAddSize(variant.id)} className="btn btn-sm bg-green-500 text-white text-[10px] sm:text-xs md:text-sm">Add Size
                  </button>
                </div>

              {/* Loop through Size Items */}
              {variant.items.map((item) => (
                <div key={item.id}
                  className="p-3 bg-base-200 rounded-lg space-y-3 relative"
                >
                {/* Remove Size Button */}
                {variant.items.length > 1 && (<div className="flex justify-end"><button type="button" onClick={() => handleRemoveSize(variant.id, item.id)} className="btn btn-sm bg-red-500 text-white text-[10px] sm:text-xs md:text-sm">Remove Size</button></div>)}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Variant Name (সাইজ ১টির বেশি হলে অথবা সাইজ ইনপুট থাকলে দেখাবে) */}
                {/* Conditional Variant Name (কেবলমাত্র একাধিক সাইজ/আইটেম থাকলে শো করবে) */}
            {variant.items.length > 1 && (
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

                {/* Size */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Size / Weight
                    </span>
                  </label>
                  <input type="text" value={item.size} onChange={(e) => handleItemChange( variant.id, item.id, "size", e.target.value) } placeholder="e.g. M, XL, 500g" className="input input-bordered w-full"/>
                </div>

                {/* Stock */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Stock *</span>
                  </label>
                  <input type="number" value={item.stock} onChange={(e) => handleItemChange( variant.id, item.id, "stock", e.target.value)} placeholder="0" className="input input-bordered w-full" required/>
                </div>

                {/* Cost Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Cost Price *
                    </span>
                  </label>
                  <input type="number" value={item.costPrice} onChange={(e) => handleItemChange( variant.id, item.id, "costPrice", e.target.value) } placeholder="0.00" className="input input-bordered w-full" required/>
                </div>

                {/* Sell Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Sell Price *
                    </span>
                  </label>
                  <input type="number" value={item.sellPrice} onChange={(e) => handleItemChange( variant.id, item.id, "sellPrice", e.target.value) } placeholder="0.00" className="input input-bordered w-full" required
                  />
                </div>

                {/* Profit (Auto Calculated) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Profit</span>
                  </label>
                  <input type="number" placeholder="0.00" value={(Number(item.sellPrice || 0) - Number(item.costPrice || 0)).toFixed(2)} className="input input-bordered w-full bg-base-300 cursor-not-allowed"readOnly/>
                </div>

                {/* Min Price */}
                {/* <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Min Price</span>
                  </label>
                  <input type="number" value={item.minimumPrice} onChange={(e) => handleItemChange( variant.id, item.id, "minimumPrice", e.target.value) } placeholder="0.00" className="input input-bordered w-full"/>
                </div> */}

                {/* Max Price */}
                {/* <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Max Price</span>
                  </label>
                  <input type="number" value={item.maximumPrice} onChange={(e) => handleItemChange( variant.id, item.id, "maximumPrice", e.target.value) } placeholder="0.00" className="input input-bordered w-full"/>
                </div> */}

                {/* VAT Percent */}
                {/* <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">VAT (%)</span>
                  </label>
                  <input type="number" value={item.vatPercent} onChange={(e) => handleItemChange( variant.id, item.id, "vatPercent", e.target.value) } placeholder="0" className="input input-bordered w-full"/></div> */}

                {/* Discount Percent */}
                {/* <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Discount (%)</span>
                  </label>
                  <input type="number" value={item.discountPercent} onChange={(e) => handleItemChange( variant.id, item.id, "discountPercent", e.target.value) } placeholder="0" className="input input-bordered w-full"
                  />
                </div> */}

                {/* Conditional Item Status (কেবলমাত্র একাধিক সাইজ থাকলে শো করবে) */}
                {variant.items.length > 1 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Item Status</span>
                    </label>
                    <select value={item.isActive} onChange={(e) => handleItemChange( variant.id, item.id, "isActive", e.target.value)}className="select select-bordered w-full">
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
              ))}
              {/* Submit Button Inside Variant Section */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full" disabled={activeBtn}>{activeBtn ? "Created..." : "Create"}</button>
              </div>
            </div>
          )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;