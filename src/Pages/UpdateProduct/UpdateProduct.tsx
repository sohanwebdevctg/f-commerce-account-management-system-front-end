import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaEdit, FaPlus, FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";

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

export interface IProductBasicState {
  thumbnailImage: File | string | null;
  name: string;
  shortDescription: string;
  description: string;
  brand: string;
  categoryId: string;
  productType: ProductType;
  isActive: boolean;
}

// প্রতিটা সাইজ/অপশনের ইন্টারফেস (ইমেজ অনুযায়ী)
export interface IVariantOption {
  id: string;
  variantName: string; // Auto Code
  size: string;
  isActive: boolean;
  stock: number | "";
  minPrice: number | "";
  maxPrice: number | "";
  costPrice: number | "";
  sellPrice: number | "";
  vatPercent: number | "";
  discountPercent: number | "";
}

// মূল কালার ভ্যারিয়েন্টের ইন্টারফেস
export interface IVariantGroup {
  id: string;
  colorCode: string;
  images: (File | string)[];
  options: IVariantOption[];
  isNew?: boolean;
}

const UpdateProduct = () => {
  const navigate = useNavigate();

  // Basic Information State
  const [basicData, setBasicData] = useState<IProductBasicState>({
    thumbnailImage: "https://via.placeholder.com/150",
    name: "Premium Oversized Hoodie",
    shortDescription: "Cozy winter fleece hoodie for unisex wear",
    description: "High quality cotton fleece hoodie for maximum comfort.",
    brand: "Nike",
    categoryId: "cat-clothing",
    productType: ProductType.VARIANT,
    isActive: true,
  });

  // Dynamic Nested Variants State
  // 1st Variant: 1 Option (Size XL)
  // 2nd Variant: 2 Options (Size M & Size L)
  const [variants, setVariants] = useState<IVariantGroup[]>([
    {
      id: "var-1",
      colorCode: "#ff0000",
      images: ["https://via.placeholder.com/150/ff0000/ffffff?text=Red"],
      options: [
        {
          id: "opt-1-1",
          variantName: "PRD-101",
          size: "XL",
          isActive: true,
          stock: 45,
          minPrice: 1500,
          maxPrice: 2000,
          costPrice: 1200,
          sellPrice: 1800,
          vatPercent: 5,
          discountPercent: 10,
        },
      ],
    },
    {
      id: "var-2",
      colorCode: "#000000",
      images: ["https://via.placeholder.com/150/000000/ffffff?text=Black"],
      options: [
        {
          id: "opt-2-1",
          variantName: "PRD-102-M",
          size: "M",
          isActive: true,
          stock: 30,
          minPrice: 1400,
          maxPrice: 1900,
          costPrice: 1100,
          sellPrice: 1650,
          vatPercent: 5,
          discountPercent: 5,
        },
        {
          id: "opt-2-2",
          variantName: "PRD-102-L",
          size: "L",
          isActive: true,
          stock: 50,
          minPrice: 1500,
          maxPrice: 2000,
          costPrice: 1150,
          sellPrice: 1700,
          vatPercent: 5,
          discountPercent: 5,
        },
      ],
    },
  ]);

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

  // Add Variant (Color Block)
  const addVariantGroup = () => {
    const newGroup: IVariantGroup = {
      id: Date.now().toString(),
      colorCode: "",
      images: [],
      isNew: true,
      options: [
        {
          id: Date.now().toString() + "-opt",
          variantName: `PRD-${Math.floor(100 + Math.random() * 900)}`,
          size: "",
          isActive: true,
          stock: "",
          minPrice: "",
          maxPrice: "",
          costPrice: "",
          sellPrice: "",
          vatPercent: "",
          discountPercent: "",
        },
      ],
    };
    setVariants((prev) => [newGroup, ...prev]);
  };

  const removeVariantGroup = (groupId: string) => {
    setVariants((prev) => prev.filter((item) => item.id !== groupId));
  };

  // Variant Image Upload Handlers
  const handleVariantImageUpload = (
    groupId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setVariants((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? { ...group, images: [...group.images, ...filesArray] }
            : group
        )
      );
    }
  };

  const removeVariantImage = (groupId: string, imageIndex: number) => {
    setVariants((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              images: group.images.filter((_, index) => index !== imageIndex),
            }
          : group
      )
    );
  };

  // Color Code Change
  const handleColorChange = (groupId: string, colorCode: string) => {
    setVariants((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, colorCode } : group
      )
    );
  };

  // Add Option (Size Block Inside a Color)
  const addOption = (groupId: string) => {
    setVariants((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const newOpt: IVariantOption = {
            id: Date.now().toString(),
            variantName: `PRD-${Math.floor(100 + Math.random() * 900)}`,
            size: "",
            isActive: true,
            stock: "",
            minPrice: "",
            maxPrice: "",
            costPrice: "",
            sellPrice: "",
            vatPercent: "",
            discountPercent: "",
          };
          return { ...group, options: [...group.options, newOpt] };
        }
        return group;
      })
    );
  };

  const removeOption = (groupId: string, optionId: string) => {
    setVariants((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          if (group.options.length <= 1) {
            Toast.fire({
              icon: "warning",
              title: "At least one option is required!",
            });
            return group;
          }
          return {
            ...group,
            options: group.options.filter((opt) => opt.id !== optionId),
          };
        }
        return group;
      })
    );
  };

  // Handle Option Fields Input
  const handleOptionChange = (
    groupId: string,
    optionId: string,
    field: keyof IVariantOption,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.map((opt) => {
              if (opt.id === optionId) {
                if (field === "isActive") {
                  return { ...opt, isActive: value === "true" };
                }
                return { ...opt, [field]: value };
              }
              return opt;
            }),
          };
        }
        return group;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setBtnLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Toast.fire({
        icon: "success",
        title: "Variant product updated successfully!",
      });
    } catch (err) {
      setError("Failed to update product. Please try again.");
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
          <h2 className="text-2xl font-bold text-gray-800">Update Variant Product</h2>
          <p className="text-gray-500 text-sm mt-1">
            Modify product information and variant details
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2.5">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFORMATION */}
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
              Basic Information
            </h3>

            {/* Thumbnail */}
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
                      src={
                        typeof basicData.thumbnailImage === "string"
                          ? basicData.thumbnailImage
                          : URL.createObjectURL(basicData.thumbnailImage)
                      }
                      alt="thumbnail"
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
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={basicData.name}
                  onChange={handleBasicChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Brand Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={basicData.brand}
                  onChange={handleBasicChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Category *
                </label>
                <select
                  name="categoryId"
                  required
                  value={basicData.categoryId}
                  onChange={handleBasicChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="cat-clothing">Clothing</option>
                  <option value="cat-shoes">Shoes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Product Status *
                </label>
                <select
                  name="isActive"
                  value={String(basicData.isActive)}
                  onChange={handleBasicChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white font-semibold outline-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                value={basicData.shortDescription}
                onChange={handleBasicChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={basicData.description}
                onChange={handleBasicChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none"
              />
            </div>

            {/* Product Type Read-Only */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Product Type *
              </label>
              <input
                type="text"
                readOnly
                disabled
                value="VARIANT (Standard Variant Product)"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-100 font-bold text-gray-700 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* DYNAMIC VARIANT COLOR BLOCKS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Product Variants</h3>
                <p className="text-[11px] text-gray-500">
                  Manage color variants and their options & pricing.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariantGroup}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <FaPlus className="text-[10px]" /> Add Variant
              </button>
            </div>

            {variants.map((group, groupIndex) => {
              const variantNumber = variants.length - groupIndex;

              return (
                <div
                  key={group.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-5"
                >
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-lg">
                      Variant #{variantNumber}
                    </span>

                    {group.isNew && (
                      <button
                        type="button"
                        onClick={() => removeVariantGroup(group.id)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        Remove Variant
                      </button>
                    )}
                  </div>

                  {/* Color & Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Color Code */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Color Plate / Code <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={group.colorCode || "#ffffff"}
                          onChange={(e) =>
                            handleColorChange(group.id, e.target.value)
                          }
                          className="w-10 h-9 p-0.5 rounded-xl border border-gray-200 cursor-pointer bg-white"
                        />
                        <input
                          type="text"
                          value={group.colorCode}
                          onChange={(e) =>
                            handleColorChange(group.id, e.target.value)
                          }
                          placeholder="#000000"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none font-mono uppercase"
                        />
                      </div>
                    </div>

                    {/* Images Upload */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Images
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="w-12 h-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 bg-white">
                          <span className="text-lg text-gray-400">+</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleVariantImageUpload(group.id, e)}
                            className="hidden"
                          />
                        </label>
                        {group.images.map((img, imgIdx) => {
                          const imgSrc = typeof img === "string" ? img : URL.createObjectURL(img);
                          return (
                            <div
                              key={imgIdx}
                              className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200"
                            >
                              <img src={imgSrc} alt="var" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeVariantImage(group.id, imgIdx)}
                                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-3.5 h-3.5 text-[8px] flex items-center justify-center cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* OPTIONS & PRICING LIST SECTION */}
                  <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Options & Pricing List
                      </h4>
                      <button
                        type="button"
                        onClick={() => addOption(group.id)}
                        className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FaPlus className="text-[9px]" /> Add Option
                      </button>
                    </div>

                    {/* OPTIONS ARRAY */}
                    <div className="space-y-4">
                      {group.options.map((opt, optIndex) => {
                        const cost = Number(opt.costPrice) || 0;
                        const sell = Number(opt.sellPrice) || 0;
                        const profit = sell > 0 && cost >= 0 ? sell - cost : 0;
                        const margin =
                          cost > 0 && profit > 0
                            ? ((profit / cost) * 100).toFixed(0)
                            : 0;

                        return (
                          <div
                            key={opt.id}
                            className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-600">
                                Option #{optIndex + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeOption(group.id, opt.id)}
                                className="text-[11px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                              >
                                Remove Option
                              </button>
                            </div>

                            {/* ROW 1: Variant Name, Size, Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Variant Name <span className="text-gray-400 font-normal">(Auto Code)</span>
                                </label>
                                <input
                                  type="text"
                                  value={opt.variantName}
                                  onChange={(e) =>
                                    handleOptionChange(group.id, opt.id, "variantName", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Size / Weight <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                  type="text"
                                  value={opt.size}
                                  onChange={(e) =>
                                    handleOptionChange(group.id, opt.id, "size", e.target.value)
                                  }
                                  placeholder="e.g. M, XL, 500g"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Status *
                                </label>
                                <select
                                  value={String(opt.isActive)}
                                  onChange={(e) =>
                                    handleOptionChange(group.id, opt.id, "isActive", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium outline-none bg-white"
                                >
                                  <option value="true">Active</option>
                                  <option value="false">Inactive</option>
                                </select>
                              </div>
                            </div>

                            {/* ROW 2: Stock, Min Price, Max Price */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Stock Quantity *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={opt.stock}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      group.id,
                                      opt.id,
                                      "stock",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="e.g. 20"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Min Price <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={opt.minPrice}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      group.id,
                                      opt.id,
                                      "minPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Max Price <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={opt.maxPrice}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      group.id,
                                      opt.id,
                                      "maxPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>
                            </div>

                            {/* ROW 3: Cost Price, Sell Price, Calculated Profit */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Cost Price *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={opt.costPrice}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      group.id,
                                      opt.id,
                                      "costPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Sell Price *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={opt.sellPrice}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      group.id,
                                      opt.id,
                                      "sellPrice",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Calculated Profit
                                </label>
                                <div className="w-full px-3 py-2 border border-emerald-200 bg-emerald-50/60 rounded-lg text-xs font-bold text-emerald-700 flex items-center justify-between">
                                  <span>৳ {profit.toFixed(2)}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-emerald-200">
                                    {margin}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* ROW 4: VAT, Discount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  VAT (%)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={opt.vatPercent}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      group.id,
                                      opt.id,
                                      "vatPercent",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="e.g. 5"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                  Discount (%)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={opt.discountPercent}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      group.id,
                                      opt.id,
                                      "discountPercent",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="e.g. 10"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
              <span>Updating Product...</span>
            ) : (
              <>
                <FaEdit />
                <span>Update Product</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;