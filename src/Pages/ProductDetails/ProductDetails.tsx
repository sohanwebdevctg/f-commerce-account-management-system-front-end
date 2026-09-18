import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  FaArrowLeft,
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaBoxOpen,
  FaLayerGroup,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

// Interfaces for Variant & Product Structure
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface ColorOption {
  colorName: string;
  colorCode: string;
  images: string[];
  variants: ProductVariant[];
}

export interface IProductCreator {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface IProductDetails {
  id: string;
  name: string;
  sku: string;
  mainImage: string;
  additionalImages?: string[];
  category: string;
  basePrice: number;
  totalStock?: number;
  totalOrders: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
  hasColors: boolean;
  colors?: ColorOption[];
  hasVariants?: boolean;
  variants?: ProductVariant[];
  createdBy: IProductCreator;
  createdAt: string;
  updatedAt: string;
}

// Dummy Product Data with Colors & Variants
const mockProductData: IProductDetails = {
  id: "prod-101",
  name: "Lux Soft Rose Beauty Soap",
  sku: "LX-SOAP-01",
  mainImage: "https://via.placeholder.com/600x600/f472b6/ffffff?text=Lux+Rose+Pink",
  category: "Beauty & Care",
  basePrice: 85,
  totalStock: 15,
  totalOrders: 120,
  status: "ACTIVE",
  description: "Lux Soft Rose Beauty Soap leaves your skin soft, smooth and fragrant with natural rose extracts.",
  hasColors: true,
  colors: [
    {
      colorName: "Rose Pink",
      colorCode: "#f472b6",
      images: [
        "https://via.placeholder.com/600x600/f472b6/ffffff?text=Rose+Pink+Main",
        "https://via.placeholder.com/600x600/fbcfe8/ffffff?text=Rose+Pink+Back",
      ],
      variants: [
        { id: "v1", name: "100g Pack", price: 85, stock: 15 },
        { id: "v2", name: "150g Combo", price: 130, stock: 8 },
      ],
    },
    {
      colorName: "Purple Orchid",
      colorCode: "#c084fc",
      images: [
        "https://via.placeholder.com/600x600/c084fc/ffffff?text=Purple+Main",
        "https://via.placeholder.com/600x600/e9d5ff/ffffff?text=Purple+Side",
      ],
      variants: [
        { id: "v3", name: "100g Pack", price: 90, stock: 10 },
        { id: "v4", name: "150g Combo", price: 140, stock: 5 },
      ],
    },
  ],
  createdBy: {
    name: "Sabbir Hossain",
    email: "sabbir@store.com",
    avatar: "https://i.pravatar.cc/150?img=11",
    role: "STAFF/ADMIN",
  },
  createdAt: "2026-02-10 10:30 AM",
  updatedAt: "2026-02-10 10:30 AM",
};

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [currentUserRole] = useState<"ADMIN" | "MODERATOR" | "STAFF">("ADMIN");
  const [product] = useState<IProductDetails>(mockProductData);

  // Dynamic Selection States
  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(
    product.colors ? product.colors[0] : undefined
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.colors
      ? product.colors[0]?.variants[0]
      : product.variants
      ? product.variants[0]
      : undefined
  );
  const [activeImage, setActiveImage] = useState<string>(product.mainImage);

  // Sync state on color change
  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    if (color.images && color.images.length > 0) {
      setActiveImage(color.images[0]);
    }
    if (color.variants && color.variants.length > 0) {
      setSelectedVariant(color.variants[0]);
    }
  };

  // Gallery Images computation
  const galleryImages: string[] = selectedColor?.images && selectedColor.images.length > 0
    ? selectedColor.images
    : product.additionalImages && product.additionalImages.length > 0
    ? [product.mainImage, ...product.additionalImages]
    : [product.mainImage];

  const currentStock = selectedVariant ? selectedVariant.stock : (product.totalStock ?? 0);
  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;

  const canModify = currentUserRole === "ADMIN" || currentUserRole === "MODERATOR";

  return (
    <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Bar: Back & Update Button (Exact Same) */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/dashboard/products")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-100 transition cursor-pointer"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>

          {canModify && (
            <button
              onClick={() => navigate(`/dashboard/products/edit/${id || product.id}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-100 transition cursor-pointer"
            >
              <FaEdit className="text-xs" /> Update Product
            </button>
          )}
        </div>

        {/* Main Card Wrapper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Title & Status (Exact Same) */}
          <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <FaBoxOpen className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
                <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200">
                <FaLayerGroup /> {product.category}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  product.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {product.status === "ACTIVE" ? <FaCheckCircle /> : <FaTimesCircle />}
                {product.status}
              </span>
            </div>
          </div>

          {/* Created By (Staff/Admin) Section (Exact Same) */}
          <div className="p-6 sm:p-8 bg-gray-50/40 border-b border-gray-100">
            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/80">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                CREATED BY ({product.createdBy.role})
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={product.createdBy.avatar}
                  alt={product.createdBy.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-800">
                    {product.createdBy.name}
                  </h4>
                  <p className="text-xs text-gray-400">{product.createdBy.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Center Content: Frontend Modal Interactive Style */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-gray-100 items-start">
            
            {/* Gallery Left */}
            <div className="md:col-span-5 space-y-3">
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shadow-inner">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Dynamic Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        activeImage === img
                          ? "border-emerald-500 scale-95 shadow-xs"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Pricing, Color Swatches & Size Options */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">PRICE</p>
                  <p className="text-base font-extrabold text-gray-800 mt-0.5">৳{currentPrice}</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">STOCK</p>
                  <p className="text-base font-extrabold text-gray-800 mt-0.5">
                    {currentStock} pcs
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">ORDERS</p>
                  <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {product.totalOrders}
                  </p>
                </div>
              </div>

              {/* Color Selection (Swatches with active state) */}
              {product.hasColors && product.colors && (
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700">Select Color:</span>
                    <span className="font-semibold text-rose-500">
                      {selectedColor?.colorName}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor?.colorName === color.colorName;
                      return (
                        <button
                          key={color.colorName}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          title={color.colorName}
                          className={`w-8 h-8 rounded-full transition-all transform flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-rose-500 scale-110 shadow-xs"
                              : "hover:scale-105 opacity-90 hover:opacity-100"
                          }`}
                          style={{
                            backgroundColor: color.colorCode || "#ccc",
                          }}
                        >
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Option / Size Selection */}
              {product.hasColors && (selectedColor?.variants || product.variants) && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">
                    Select Option / Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(selectedColor?.variants || product.variants)?.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            isSelected
                              ? "border-gray-900 bg-gray-900 text-white shadow-xs"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5 border-t border-gray-100 pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  DESCRIPTION
                </p>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                  {product.description}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Timestamps Grid: Created Date & Last Updated (Exact Same) */}
          <div className="p-6 sm:p-8 bg-gray-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Created Date */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-2xs">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <FaCalendarAlt className="text-base" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Created Date</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {product.createdAt}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-2xs">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <FaClock className="text-base" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Last Updated</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {product.updatedAt}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;