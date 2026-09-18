import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaPlus, FaBoxOpen, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

// Toast Notification Config (Swal)
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

export enum ProductType {
  SINGLE = "SINGLE",
  VARIANT = "VARIANT",
}

// Helper to generate variant name: First 3 letters of product name + 2 digit random number
const generateVariantNameCode = (productName: string) => {
  const prefix = (productName || "PRD").slice(0, 3).toUpperCase();
  const randomNum = Math.floor(10 + Math.random() * 90); // 2 digit number (10-99)
  return `${prefix}-${randomNum}`;
};

// 1. Basic Information State Interface
export interface IProductBasicState {
  thumbnailImage: File | null;
  name: string;
  shortDescription: string;
  description: string;
  brand: string;
  categoryId: string;
  productType: ProductType;
  isActive: boolean;
}

// 2. Single Product Field Interface (Variant Name Removed)
export interface ISingleProductState {
  images: File[];
  colorCode: string;
  size: string;
  minPrice: number | "";
  maxPrice: number | "";
  costPrice: number | "";
  sellPrice: number | "";
  stock: number | "";
  vatPercent: number | "";
  discountPercent: number | "";
  isActive: boolean;
}

// 3. Size Level Item Interface
export interface ISizeItemState {
  id: string;
  size: string;
  variantName: string; // Auto-generated code
  minPrice: number | "";
  maxPrice: number | "";
  costPrice: number | "";
  sellPrice: number | "";
  stock: number | "";
  vatPercent: number | "";
  discountPercent: number | "";
  isActive: boolean;
}

// 4. Variant Main Block Interface
export interface IVariantItemState {
  id: string;
  colorCode: string;
  images: File[];
  sizes: ISizeItemState[];
}

const CreateProduct = () => {
  const navigate = useNavigate();

  // Basic Info State
  const [basicData, setBasicData] = useState<IProductBasicState>({
    thumbnailImage: null,
    name: "",
    shortDescription: "",
    description: "",
    brand: "",
    categoryId: "",
    productType: ProductType.SINGLE,
    isActive: true,
  });

  // Single Product State
  const [singleData, setSingleData] = useState<ISingleProductState>({
    images: [],
    colorCode: "",
    size: "",
    minPrice: "",
    maxPrice: "",
    costPrice: "",
    sellPrice: "",
    stock: "",
    vatPercent: "",
    discountPercent: "",
    isActive: true,
  });

  const [singleProfit, setSingleProfit] = useState({ amount: 0, margin: 0 });

  // Variants State
  const [variants, setVariants] = useState<IVariantItemState[]>([
    {
      id: Date.now().toString(),
      colorCode: "",
      images: [],
      sizes: [
        {
          id: Date.now().toString() + "-sz",
          size: "",
          variantName: generateVariantNameCode(""),
          minPrice: "",
          maxPrice: "",
          costPrice: "",
          sellPrice: "",
          stock: "",
          vatPercent: "",
          discountPercent: "",
          isActive: true,
        },
      ],
    },
  ]);

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Update Variant Name Prefix if basic product name changes
  useEffect(() => {
    if (basicData.productType === ProductType.VARIANT) {
      setVariants((prev) =>
        prev.map((v) => ({
          ...v,
          sizes: v.sizes.map((sz) => ({
            ...sz,
            variantName: sz.variantName || generateVariantNameCode(basicData.name),
          })),
        }))
      );
    }
  }, [basicData.name]);

  // Basic Info Handlers
  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBasicData((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBasicData((prev) => ({
        ...prev,
        thumbnailImage: e.target!.files![0],
      }));
    }
  };

  const removeThumbnail = () => {
    setBasicData((prev) => ({ ...prev, thumbnailImage: null }));
  };

  // Single Product Handlers
  const handleSingleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSingleData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSingleData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    }
  };

  const removeSingleImage = (index: number) => {
    setSingleData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Profit Calculation for Single Product
  useEffect(() => {
    const cost = Number(singleData.costPrice) || 0;
    const sell = Number(singleData.sellPrice) || 0;
    if (sell > 0 && cost >= 0) {
      const profit = sell - cost;
      const margin = cost > 0 ? (profit / cost) * 100 : 0;
      setSingleProfit({ amount: profit, margin: Number(margin.toFixed(2)) });
    } else {
      setSingleProfit({ amount: 0, margin: 0 });
    }
  }, [singleData.costPrice, singleData.sellPrice]);

  // ================= VARIANT HANDLERS =================

  const addVariant = () => {
    const newVariant: IVariantItemState = {
      id: Date.now().toString(),
      colorCode: "",
      images: [],
      sizes: [
        {
          id: Date.now().toString() + "-sz",
          size: "",
          variantName: generateVariantNameCode(basicData.name),
          minPrice: "",
          maxPrice: "",
          costPrice: "",
          sellPrice: "",
          stock: "",
          vatPercent: "",
          discountPercent: "",
          isActive: true,
        },
      ],
    };
    setVariants((prev) => [newVariant, ...prev]);
  };

  const removeVariant = (variantId: string) => {
    if (variants.length === 1) {
      Toast.fire({
        icon: "warning",
        title: "At least one variant block is required!",
      });
      return;
    }
    setVariants((prev) => prev.filter((item) => item.id !== variantId));
  };

  const handleVariantColorChange = (variantId: string, value: string) => {
    setVariants((prev) =>
      prev.map((item) =>
        item.id === variantId ? { ...item, colorCode: value } : item
      )
    );
  };

  const handleVariantImageUpload = (
    variantId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setVariants((prev) =>
        prev.map((item) =>
          item.id === variantId
            ? { ...item, images: [...item.images, ...filesArray] }
            : item
        )
      );
    }
  };

  const removeVariantImage = (variantId: string, imageIndex: number) => {
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

  const addSizeToVariant = (variantId: string) => {
    const newSize: ISizeItemState = {
      id: Date.now().toString(),
      size: "",
      variantName: generateVariantNameCode(basicData.name),
      minPrice: "",
      maxPrice: "",
      costPrice: "",
      sellPrice: "",
      stock: "",
      vatPercent: "",
      discountPercent: "",
      isActive: true,
    };

    setVariants((prev) =>
      prev.map((item) =>
        item.id === variantId
          ? { ...item, sizes: [...item.sizes, newSize] }
          : item
      )
    );
  };

  const removeSizeFromVariant = (variantId: string, sizeId: string) => {
    setVariants((prev) =>
      prev.map((item) => {
        if (item.id === variantId) {
          if (item.sizes.length === 1) {
            Toast.fire({
              icon: "warning",
              title: "At least one option item is required in a variant!",
            });
            return item;
          }
          return {
            ...item,
            sizes: item.sizes.filter((sz) => sz.id !== sizeId),
          };
        }
        return item;
      })
    );
  };

  const handleSizeChange = (
    variantId: string,
    sizeId: string,
    field: keyof ISizeItemState,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === variantId) {
          return {
            ...variant,
            sizes: variant.sizes.map((sz) => {
              if (sz.id === sizeId) {
                return {
                  ...sz,
                  [field]: field === "isActive" ? value === "true" : value,
                };
              }
              return sz;
            }),
          };
        }
        return variant;
      })
    );
  };

  const resetForm = () => {
    setBasicData({
      thumbnailImage: null,
      name: "",
      shortDescription: "",
      description: "",
      brand: "",
      categoryId: "",
      productType: ProductType.SINGLE,
      isActive: true,
    });
    setSingleData({
      images: [],
      colorCode: "",
      size: "",
      minPrice: "",
      maxPrice: "",
      costPrice: "",
      sellPrice: "",
      stock: "",
      vatPercent: "",
      discountPercent: "",
      isActive: true,
    });
    setVariants([
      {
        id: Date.now().toString(),
        colorCode: "",
        images: [],
        sizes: [
          {
            id: Date.now().toString() + "-sz",
            size: "",
            variantName: generateVariantNameCode(""),
            minPrice: "",
            maxPrice: "",
            costPrice: "",
            sellPrice: "",
            stock: "",
            vatPercent: "",
            discountPercent: "",
            isActive: true,
          },
        ],
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ==========================================
  // ১. SINGLE PRODUCT-এর ক্ষেত্রে যা ব্যাকএন্ডে পাঠাবেন
  // ==========================================
  if (basicData.productType === ProductType.SINGLE) {
    const singlePayload = {
      ...basicData,
      ...singleData
    };

    console.log("--- 📦 SINGLE PRODUCT PAYLOAD ---");
    console.log(singlePayload);
  }

  // ==========================================
  // ২. VARIANT PRODUCT-এর ক্ষেত্রে যা ব্যাকএন্ডে পাঠাবেন
  // ==========================================
  if (basicData.productType === ProductType.VARIANT) {
    const variantPayload = {
      ...basicData,
      variants: variants.map((v) => ({
        colorCode: v.colorCode || null,
        images: v.images, // Note: রিয়েল এপিআইতে ইমেজ আপলোড হয়ে URL অ্যারে হবে
        options: v.sizes.map((sz) => ({
          variantName: sz.variantName,
          size: sz.size || null,
          minPrice: sz.minPrice,
          maxPrice: sz.maxPrice,
          costPrice: sz.costPrice,
          sellPrice: sz.sellPrice,
          stock: sz.stock,
          vatPercent: sz.vatPercent,
          discountPercent: sz.discountPercent,
          isActive: sz.isActive
        }))
      }))
    };

    console.log("--- 🎨 VARIANT PRODUCT PAYLOAD ---");
    console.log(variantPayload);
  }

    try {
      setBtnLoading(true);

      // এখানে আপনার রিয়েল axios/fetch API hit হবে
    // await api.post('/products', payload);

      await new Promise((resolve) => setTimeout(resolve, 1200));
      Toast.fire({ icon: "success", title: "Product created successfully!" });
      resetForm();

    } catch (err) {
      setError("Failed to create product. Please try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 border-4 border-emerald-100 shadow-sm">
            <FaBoxOpen />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Product</h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to create a new product
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* BASIC INFORMATION */}
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
              Basic Information
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">
                Thumbnail Image *
              </label>
              <div className="flex items-center gap-3">
                {!basicData.thumbnailImage ? (
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 bg-white transition-all">
                    <span className="text-xl text-gray-400">+</span>
                    <span className="text-[10px] text-gray-500 font-medium">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white">
                    <img
                      src={URL.createObjectURL(basicData.thumbnailImage)}
                      alt="thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={basicData.name}
                  onChange={handleBasicChange}
                  placeholder="e.g. Premium T-Shirt"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Brand Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  name="brand"
                  value={basicData.brand}
                  onChange={handleBasicChange}
                  placeholder="e.g. Nike, Adidas"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
                <select
                  name="categoryId"
                  required
                  value={basicData.categoryId}
                  onChange={handleBasicChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="cat-clothing">Clothing</option>
                  <option value="cat-shoes">Shoes</option>
                  <option value="cat-gadgets">Gadgets</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status *</label>
                <select
                  name="isActive"
                  value={String(basicData.isActive)}
                  onChange={handleBasicChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Short Description <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                type="text"
                name="shortDescription"
                value={basicData.shortDescription}
                onChange={handleBasicChange}
                placeholder="Brief highlight of the product..."
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea
                name="description"
                rows={3}
                value={basicData.description}
                onChange={handleBasicChange}
                placeholder="Write detailed specifications..."
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Product Type *</label>
              <select
                name="productType"
                value={basicData.productType}
                onChange={handleBasicChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              >
                <option value={ProductType.SINGLE}>SINGLE (Standard Flat Product)</option>
                <option value={ProductType.VARIANT}>VARIANT (Multiple Colors/Sizes)</option>
              </select>
            </div>
          </div>

          {/* SINGLE PRODUCT DETAILS */}
          {basicData.productType === ProductType.SINGLE && (
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                Single Product Details
              </h3>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Product Images</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 bg-white transition-all">
                    <span className="text-xl text-gray-400">+</span>
                    <span className="text-[10px] text-gray-500 font-medium">Upload</span>
                    <input type="file" multiple accept="image/*" onChange={handleSingleImageUpload} className="hidden" />
                  </label>

                  {singleData.images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white">
                      <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeSingleImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Color Code <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="colorCode" value={singleData.colorCode || "#ffffff"} onChange={handleSingleChange} className="w-10 h-9 p-0.5 rounded-xl border border-gray-200 cursor-pointer bg-white" />
                    <input type="text" name="colorCode" value={singleData.colorCode} onChange={handleSingleChange} placeholder="#000000" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none uppercase font-mono" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Size / Weight <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="size" value={singleData.size} onChange={handleSingleChange} placeholder="e.g. M, XL, 500g" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Status *</label>
                  <select name="isActive" value={String(singleData.isActive)} onChange={handleSingleChange} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white font-semibold outline-none">
                    <option value="true">Active</option>
                    <option value="false">Deactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Minimum Price <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="number" name="minPrice" min="0" value={singleData.minPrice} onChange={handleSingleChange} placeholder="0.00" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Maximum Price <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="number" name="maxPrice" min="0" value={singleData.maxPrice} onChange={handleSingleChange} placeholder="0.00" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Cost Price *</label>
                  <input type="number" name="costPrice" required min="0" value={singleData.costPrice} onChange={handleSingleChange} placeholder="0.00" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Sell Price *</label>
                  <input type="number" name="sellPrice" required min="0" value={singleData.sellPrice} onChange={handleSingleChange} placeholder="0.00" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Calculated Profit</label>
                  <div className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold flex justify-between items-center ${singleProfit.amount >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    <span>৳ {singleProfit.amount.toFixed(2)}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-current">{singleProfit.margin}%</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Stock Quantity *</label>
                  <input type="number" name="stock" required min="0" value={singleData.stock} onChange={handleSingleChange} placeholder="e.g. 50" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">VAT (%)</label>
                  <input type="number" name="vatPercent" min="0" max="100" value={singleData.vatPercent} onChange={handleSingleChange} placeholder="e.g. 5" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Discount (%)</label>
                  <input type="number" name="discountPercent" min="0" max="100" value={singleData.discountPercent} onChange={handleSingleChange} placeholder="e.g. 10" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* VARIANT PRODUCT DETAILS */}
          {basicData.productType === ProductType.VARIANT && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Product Variants</h3>
                  <p className="text-[11px] text-gray-500">
                    Add color/image blocks with auto-generated variant codes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <FaPlus className="text-[10px]" /> Add Variant
                </button>
              </div>

              {variants.map((item, index) => {
                const variantNumber = variants.length - index;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border-2 border-gray-200 shadow-sm space-y-5 relative"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-lg">
                        Color Group #{variantNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(item.id)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FaTrash className="text-[10px]" /> Remove Variant
                      </button>
                    </div>

                    {/* Color & Images Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100 items-start">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Color Plate / Code <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={item.colorCode || "#ffffff"}
                            onChange={(e) => handleVariantColorChange(item.id, e.target.value)}
                            className="w-10 h-9 p-0.5 rounded-xl border border-gray-200 cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={item.colorCode}
                            onChange={(e) => handleVariantColorChange(item.id, e.target.value)}
                            placeholder="#000000"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase font-mono"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Images for this Color
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="w-14 h-14 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-white rounded-xl cursor-pointer hover:border-emerald-500 transition-all">
                            <span className="text-base text-gray-400">+</span>
                            <span className="text-[9px] text-gray-500 font-medium">Upload</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleVariantImageUpload(item.id, e)}
                              className="hidden"
                            />
                          </label>

                          {item.images.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-white"
                            >
                              <img
                                src={URL.createObjectURL(img)}
                                alt="variant preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantImage(item.id, imgIndex)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Options / Sizes List */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Options & Pricing List
                        </h4>
                        <button
                          type="button"
                          onClick={() => addSizeToVariant(item.id)}
                          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <FaPlus className="text-[9px]" /> Add Option
                        </button>
                      </div>

                      {item.sizes.map((sz, szIdx) => {
                        const cost = Number(sz.costPrice) || 0;
                        const sell = Number(sz.sellPrice) || 0;
                        const profit = sell > 0 && cost >= 0 ? sell - cost : 0;
                        const margin = cost > 0 && profit > 0 ? ((profit / cost) * 100).toFixed(2) : 0;

                        return (
                          <div
                            key={sz.id}
                            className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-3 relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-bold text-gray-500">
                                Option #{szIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeSizeFromVariant(item.id, sz.id)}
                                className="text-[11px] font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                              >
                                Remove Option
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Variant Name Field inside 1 column */}
                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Variant Name <span className="text-gray-400 font-normal">(Auto Code)</span>
                                </label>
                                <input
                                  type="text"
                                  readOnly
                                  value={sz.variantName}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-100 font-bold text-gray-700 outline-none cursor-not-allowed uppercase"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Size / Weight <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                  type="text"
                                  value={sz.size}
                                  onChange={(e) =>
                                    handleSizeChange(item.id, sz.id, "size", e.target.value)
                                  }
                                  placeholder="e.g. M, XL, 500g"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Status *
                                </label>
                                <select
                                  value={String(sz.isActive)}
                                  onChange={(e) =>
                                    handleSizeChange(item.id, sz.id, "isActive", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white font-semibold outline-none"
                                >
                                  <option value="true">Active</option>
                                  <option value="false">Deactive</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Stock Quantity *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={sz.stock}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      item.id,
                                      sz.id,
                                      "stock",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="e.g. 20"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Min Price <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={sz.minPrice}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      item.id,
                                      sz.id,
                                      "minPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Max Price <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={sz.maxPrice}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      item.id,
                                      sz.id,
                                      "maxPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Cost Price *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={sz.costPrice}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      item.id,
                                      sz.id,
                                      "costPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Sell Price *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={sz.sellPrice}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      item.id,
                                      sz.id,
                                      "sellPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Calculated Profit
                                </label>
                                <div
                                  className={`w-full px-3 py-2 border rounded-xl text-xs font-bold flex justify-between items-center ${
                                    profit >= 0
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                      : "bg-red-50 border-red-200 text-red-700"
                                  }`}
                                >
                                  <span>৳ {profit.toFixed(2)}</span>
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-white border border-current">
                                    {margin}%
                                  </span>
                                </div>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  VAT (%)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={sz.vatPercent}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      item.id,
                                      sz.id,
                                      "vatPercent",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="e.g. 5"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                                  Discount (%)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={sz.discountPercent}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      item.id,
                                      sz.id,
                                      "discountPercent",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="e.g. 10"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
              btnLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg shadow-emerald-200 transform active:scale-[0.99] cursor-pointer"
            }`}
          >
            {btnLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Product...</span>
              </div>
            ) : (
              <>
                <FaPlus />
                <span>Create Product</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateProduct;