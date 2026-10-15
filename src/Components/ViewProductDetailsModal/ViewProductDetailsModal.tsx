import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";


interface ViewProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductId: string | null;
  cartItems: any[];
  handleAddToCart: (item: any) => void;
}

const getSinglePublicProduct = async (id: string) => {
  const response = await axiosInstance.get(`/products/public/${id}`);
  return response.data?.data;
};


const ViewProductDetailsModal = ({ isOpen, onClose, selectedProductId, cartItems, handleAddToCart}: ViewProductDetailsModalProps) => {

  const { data: product, isLoading, isError} = useQuery({
  queryKey: ["public-product", selectedProductId],
  queryFn: () => getSinglePublicProduct(selectedProductId as string),
  enabled: !!selectedProductId && isOpen, // It will be called only if the modal opens and the ID exists
});

  // console.log("Fetched Product Data:", product);

  // State to retain the color if the user selects a different one
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // State to persist the size selected by the user
  const [selectedVariantItem, setSelectedVariantItem] = useState<any>(null);

  // State to maintain the selection when the user clicks on another image
  const [activeImage, setActiveImage] = useState<string>("");

  // Nothing will render if the modal is closed or the ID is missing
  if (!isOpen || !selectedProductId) return null;

// Direct derived data variable the conditional check
const currentVariant = selectedVariant || product?.variants?.[0] || null;
const currentVariantItem = 
  currentVariant?.variantItems?.find((item: any) => item?.id === selectedVariantItem?.id) ||
  currentVariant?.variantItems?.[0] ||
  null;
const currentImage = activeImage || currentVariant?.images?.[0]?.productImage || product?.thumbnailImage || "";


// Dynamic image gallery array
const galleryImages: string[] =  currentVariant?.images?.map((img: any) => img.productImage) || (product?.thumbnailImage ? [product.thumbnailImage] : []);

// Dynamic Stock Calculation Logic
const cartItemInList = cartItems?.find((item) => item.variantItemId && item.variantItemId === currentVariantItem?.id);
const cartQuantity = cartItemInList ? cartItemInList.quantity : 0;
const originalStock = currentVariantItem?.stock || 0;
const availableStock = originalStock - cartQuantity;

// Add to cart button handler function
const handleAddToCartClick = () => {
  if (availableStock <= 0) return;

  const itemToAdd = {
    productId: product?.id || selectedProductId,
  productName: product?.name,
  variantItemId: currentVariantItem?.id,
  variantName: currentVariantItem?.variantName,
  colorCode: currentVariant?.colorCode,
  size: currentVariantItem?.size,
  sellPrice: currentVariantItem?.sellPrice || 0, 
  quantity: 1,
  totalPrice: (currentVariantItem?.sellPrice || 0) * 1,
  image: currentImage,
  };

  handleAddToCart(itemToAdd);

  // SweetAlert2 Toast Notification
  Swal.fire({
    icon: "success",
    title: "Item added to cart!",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
};

// isLoading condition
if (isLoading) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
        <p className="text-sm font-medium text-gray-600 animate-pulse">Product data is loading...</p>
      </div>
    </div>
  );
}

// isError condition
if (isError) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
        <p className="text-sm font-medium text-red-500">There was a problem loading the data!</p>
        <button onClick={onClose} className="mt-3 px-4 py-1.5 bg-gray-100 text-xs font-semibold text-gray-700 rounded-lg hover:bg-gray-200">
          Close
        </button>
      </div>
    </div>
  );
}



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
  <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative">
    {/* Close Button */}
    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-sm font-bold cursor-pointer z-10">✕</button>

    <div className="space-y-5">
      {/* Top Section: Images & Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Dynamic Image Gallery Container */}
        <div className="flex flex-col h-full justify-between space-y-3">
          {/* Main Large Image */}
          <div className="w-full flex-1 min-h-[240px] max-h-[300px] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-inner flex items-center justify-center">
            <img
              src={currentImage}
              alt={product?.name || "Product"}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails Gallery (১টির বেশি ছবি থাকলে কেবল দেখাবে) */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 h-12 flex-shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-11 h-11 rounded-lg overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${
                    currentImage === img
                      ? "border-red-500 shadow-sm scale-95"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Category & Product Name */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {product?.category?.name || "General"}
              </span>
              <h2 className="text-base font-bold text-gray-800 mt-1">
                {product?.name}
              </h2>
              {product?.shortDescription && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {product?.shortDescription}
                </p>
              )}
            </div>

            {/* Minimal Price & Stock Display (No heavy background) */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-red-600">
                ৳{currentVariantItem?.sellPrice || 0}
              </span>
              {currentVariantItem?.regularPrice > currentVariantItem?.sellPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{currentVariantItem?.regularPrice}
                </span>
              )}
              <span className={`ml-auto text-sm font-semibold px-2 py-0.5 rounded-full ${ availableStock > 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}> {availableStock > 0 ? `Stock: ${availableStock}` : "Out of Stock"}</span>
            </div>
            {/* Color Palette & N/A Button (Mixed Variant Logic) */}
            {product?.variants && product.variants.some((v: any) => v?.colorCode && v?.colorCode.trim() !== "") && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-600">
                  Color:
                </label>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {/* ১. যাদের কালার কোড আছে, তাদের জন্য কালার সার্কেল */}
                  {product.variants.map((variant: any, idx: number) => {
                    if (!variant?.colorCode || variant?.colorCode.trim() === "") return null;

                    const isSelected = currentVariant?.colorCode === variant?.colorCode;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setActiveImage(variant?.images?.[0]?.productImage || "");
                          setSelectedVariantItem(variant?.variantItems?.[0] || null);
                        }}
                        className={`w-5 h-5 rounded-full border transition cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "border-red-500 ring-2 ring-red-200 scale-110"
                            : "border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: variant?.colorCode }}
                        title={variant?.colorCode}
                      />
                    );
                  })}

                  {/* ২. যদি মিক্সড হয় (অর্থাৎ কালার ওয়ালা ভেরিয়েন্টের পাশাপাশি কালার ছাড়াও ভেরিয়েন্ট থাকে), তবে "N/A" বাটন দেখাবে */}
                  {product.variants.some((v: any) => v?.colorCode && v?.colorCode.trim() !== "") && 
                   product.variants.some((v: any) => !v?.colorCode || v?.colorCode.trim() === "") && (
                    (() => {
                      const noColorVariant = product.variants.find((v: any) => !v?.colorCode || v?.colorCode.trim() === "");
                      const isSelected = !currentVariant?.colorCode || currentVariant?.colorCode.trim() === "";

                      return (
                        <button
                          onClick={() => {
                            if (noColorVariant) {
                              setSelectedVariant(noColorVariant);
                              setActiveImage(noColorVariant?.images?.[0]?.productImage || "");
                              setSelectedVariantItem(noColorVariant?.variantItems?.[0] || null);
                            }
                          }}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "border-red-500 bg-red-50 text-red-600 ring-2 ring-red-200 scale-105"
                              : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="No Color / Standard"
                        >NO
                        </button>
                      );
                    })()
                  )}
                </div>
              </div>
            )}
          {/* Size Buttons (Only render if at least one item has a valid size) */}
            {currentVariant?.variantItems && currentVariant.variantItems.some((item: any) => item?.size && String(item.size).trim() !== "") && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-600">
                  Size:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentVariant?.variantItems?.map((item: any, idx: number) => {
                    // যদি নির্দিষ্ট কোনো আইটেমের সাইজ না থাকে বা ফাঁকা হয়, তবে রেন্ডার করবে না
                    if (!item?.size || String(item.size).trim() === "") return null;

                    const isSelected = currentVariantItem?.id === item?.id;

                    return (
                      <button
                        key={item?.id || idx}
                        onClick={() => setSelectedVariantItem(item)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition cursor-pointer ${
                          isSelected
                            ? "border-red-600 text-red-600 bg-red-50/50 shadow-sm"
                            : "border-gray-300 text-gray-700 bg-white hover:border-gray-500"
                        }`}
                      >
                        {item?.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Width Description Section */}
      <div className="border-t border-gray-100 pt-3 space-y-1.5">
        <div className="text-xs text-gray-600 leading-relaxed max-h-28 overflow-y-auto pr-1">
          {product?.description ? (
            <p>{product?.description}</p>
          ) : (
            <p className="text-gray-400 italic">No description available for this product.</p>
          )}
        </div>
      </div>
      {/* Action Button Section (Only Add to Cart) */}
      <div className="border-t border-gray-100 pt-3">
        <button type="button" onClick={handleAddToCartClick} disabled={availableStock <= 0} className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs shadow-md transition cursor-pointer text-center ${ availableStock > 0 ? "bg-red-500 hover:bg-green-600 shadow-red-100 active:scale-[0.99]" : "bg-gray-300 cursor-not-allowed"}`}> {availableStock > 0 ? "Add to Cart" : "Out of Stock"}</button>
      </div>
    </div>
  </div>
</div>
  );
};

export default ViewProductDetailsModal;