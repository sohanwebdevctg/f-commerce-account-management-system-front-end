import { useState, useEffect } from "react";
import { FaTimes, FaShoppingCart, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import type { Product, ColorOption, ProductVariant } from "../../mockData/products";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (selectedItem: {
    product: Product;
    selectedColor?: ColorOption;
    selectedVariant?: ProductVariant;
    quantity: number;
    unitPrice: number;
    image: string;
  }) => { success: boolean; message?: string };
}

const ProductDetailsModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) => {
  if (!isOpen || !product) return null;

  // Selected State
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
  const [quantity, setQuantity] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "warning"; text: string } | null>(null);

  // Reset state on product change
  useEffect(() => {
    if (product) {
      const defaultColor = product.colors ? product.colors[0] : undefined;
      const defaultVariant = product.colors
        ? product.colors[0]?.variants[0]
        : product.variants
        ? product.variants[0]
        : undefined;

      setSelectedColor(defaultColor);
      setSelectedVariant(defaultVariant);
      setActiveImage(defaultColor?.images?.[0] || product.mainImage);
      setQuantity(1);
      setAlertMessage(null);
    }
  }, [product]);

  // When color changes, change images and default variant
  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    if (color.images && color.images.length > 0) {
      setActiveImage(color.images[0]);
    }
    if (color.variants && color.variants.length > 0) {
      setSelectedVariant(color.variants[0]);
    }
  };

  // Determine Images Array (Multi vs Single)
  const galleryImages: string[] = selectedColor?.images && selectedColor.images.length > 0
    ? selectedColor.images
    : product.additionalImages && product.additionalImages.length > 0
    ? [product.mainImage, ...product.additionalImages]
    : [product.mainImage];

  // Stock & Price Calculation
  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product.totalStock ?? 0;

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.basePrice;

  // Optional Original Price (If Discount Applies)
  const discountPercent = product.discountPercent || 0;
  const originalPrice = discountPercent > 0
    ? Math.round(currentPrice + (currentPrice * discountPercent) / 100)
    : currentPrice;

  // Handle Add To Cart / Buy Now
  const handleBuyNow = () => {
    if (currentStock <= 0) return;

    const result = onAddToCart({
      product,
      selectedColor,
      selectedVariant,
      quantity,
      unitPrice: currentPrice,
      image: activeImage,
    });

    if (result.success) {
      setAlertMessage({
        type: "success",
        text: "Item added to your order summary!",
      });
    } else {
      setAlertMessage({
        type: "warning",
        text: result.message || "This item/variant is already added to cart!",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition z-10 cursor-pointer"
        >
          <FaTimes className="text-lg" />
        </button>

        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Main Content Grid: Image Left, Details Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left Column: Dynamic Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${
                        activeImage === img
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

            {/* Right Column: Details & Options */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Category Badge */}
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>

                {/* Product Name */}
                <h2 className="text-xl font-bold text-gray-800 mt-2 leading-snug">
                  {product.name}
                </h2>

                {/* Pricing, Discount & Stock Section */}
                <div className="flex items-baseline gap-2.5 flex-wrap mt-3">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    ৳{currentPrice}
                  </span>

                  {/* Optional Discounted Price */}
                  {discountPercent > 0 && (
                    <span className="text-sm text-gray-400 line-through font-medium">
                      ৳{originalPrice}
                    </span>
                  )}

                  {/* Optional Discount Badge */}
                  {discountPercent > 0 && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* Stock Status */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ml-auto ${
                      currentStock > 0
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {currentStock > 0 ? `In Stock: ${currentStock}` : "Out of Stock"}
                  </span>
                </div>

                {/* Optional VAT Tag */}
                {product.vatPercent && product.vatPercent > 0 ? (
                  <p className="text-[11px] text-gray-500 font-medium mt-1">
                    (+{product.vatPercent}% VAT Included)
                  </p>
                ) : null}

                {/* Color Selection (Swatches Only - Clean Buttons) */}
                {product.hasColors && product.colors && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-700">Select Color:</span>
                      <span className="font-semibold text-red-500">
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
                            className={`w-7 h-7 rounded-full transition-all transform flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? "ring-2 ring-offset-2 ring-red-500 scale-110 shadow-sm"
                                : "hover:scale-105 opacity-90 hover:opacity-100"
                            }`}
                            style={{
                              backgroundColor: color.colorCode || "#ccc",
                            }}
                          >
                            {isSelected && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  color.colorCode?.toLowerCase() === "#ffffff" ||
                                  color.colorCode?.toLowerCase() === "#f8f9fa"
                                    ? "bg-black"
                                    : "bg-white"
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Variant / Size Selection (Clean Buttons - No Price Inside) */}
                {product.hasVariants && (selectedColor?.variants || product.variants) && (
                  <div className="mt-4 space-y-2">
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
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                              isSelected
                                ? "border-gray-900 bg-gray-900 text-white shadow-sm"
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
              </div>

              {/* Alert Message Box */}
              {alertMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    alertMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {alertMessage.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
                  <span>{alertMessage.text}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t">
                <button
                  onClick={handleBuyNow}
                  disabled={currentStock <= 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    currentStock > 0
                      ? "bg-red-500 hover:bg-red-600 shadow-red-200 active:scale-[0.99]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FaShoppingCart />
                  <span>{currentStock > 0 ? "Buy Now" : "Out of Stock"}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Full Description Section (Mobile Safe Layout) */}
          {product.description && (
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h3 className="text-sm font-bold text-gray-800">
                Product Description
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;


// import { useState, useEffect } from "react";
// import { FaTimes, FaShoppingCart, FaCheck, FaExclamationTriangle } from "react-icons/fa";
// import type { Product, ColorOption, ProductVariant } from "../../mockData/products";

// interface ProductDetailsModalProps {
//   product: Product | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onAddToCart: (selectedItem: {
//     product: Product;
//     selectedColor?: ColorOption;
//     selectedVariant?: ProductVariant;
//     quantity: number;
//     unitPrice: number;
//     image: string;
//   }) => { success: boolean; message?: string };
// }

// const ProductDetailsModal = ({
//   product,
//   isOpen,
//   onClose,
//   onAddToCart,
// }: ProductDetailsModalProps) => {
//   if (!isOpen || !product) return null;

//   // Selected State
//   const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(
//     product.colors ? product.colors[0] : undefined
//   );
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
//     product.colors
//       ? product.colors[0]?.variants[0]
//       : product.variants
//       ? product.variants[0]
//       : undefined
//   );
//   const [activeImage, setActiveImage] = useState<string>(product.mainImage);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [alertMessage, setAlertMessage] = useState<{ type: "success" | "warning"; text: string } | null>(null);

//   // Reset state on product change
//   useEffect(() => {
//     if (product) {
//       const defaultColor = product.colors ? product.colors[0] : undefined;
//       const defaultVariant = product.colors
//         ? product.colors[0]?.variants[0]
//         : product.variants
//         ? product.variants[0]
//         : undefined;

//       setSelectedColor(defaultColor);
//       setSelectedVariant(defaultVariant);
//       setActiveImage(defaultColor ? defaultColor.images[0] : product.mainImage);
//       setQuantity(1);
//       setAlertMessage(null);
//     }
//   }, [product]);

//   // When color changes, change images and default variant
//   const handleColorSelect = (color: ColorOption) => {
//     setSelectedColor(color);
//     setActiveImage(color.images[0]);
//     if (color.variants.length > 0) {
//       setSelectedVariant(color.variants[0]);
//     }
//   };

//   // Determine Images Array (Multi vs Single)
//   const galleryImages: string[] = selectedColor
//     ? selectedColor.images
//     : product.additionalImages && product.additionalImages.length > 0
//     ? [product.mainImage, ...product.additionalImages]
//     : [product.mainImage];

//   // Stock & Price Calculation
//   const currentStock = selectedVariant
//     ? selectedVariant.stock
//     : product.totalStock ?? 0;

//   const currentPrice = selectedVariant
//     ? selectedVariant.price
//     : product.basePrice;

//   // Handle Add To Cart / Buy Now
//   const handleBuyNow = () => {
//     if (currentStock <= 0) return;

//     const result = onAddToCart({
//       product,
//       selectedColor,
//       selectedVariant,
//       quantity,
//       unitPrice: currentPrice,
//       image: activeImage,
//     });

//     if (result.success) {
//       setAlertMessage({
//         type: "success",
//         text: "Item added to your order summary!",
//       });
//     } else {
//       setAlertMessage({
//         type: "warning",
//         text: result.message || "This item/variant is already added to cart!",
//       });
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
//       <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-3xl p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition z-10"
//         >
//           <FaTimes className="text-lg" />
//         </button>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
//           {/* Left Column: Dynamic Image Gallery */}
//           <div className="space-y-3">
//             <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
//               <img
//                 src={activeImage}
//                 alt={product.name}
//                 className="w-full h-full object-cover transition-all duration-300"
//               />
//             </div>

//             {/* Thumbnails (Hidden if only 1 single image) */}
//             {galleryImages.length > 1 && (
//               <div className="grid grid-cols-4 gap-2">
//                 {galleryImages.slice(0, 4).map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setActiveImage(img)}
//                     className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
//                       activeImage === img
//                         ? "border-red-500 shadow-sm"
//                         : "border-gray-200 opacity-70 hover:opacity-100"
//                     }`}
//                   >
//                     <img src={img} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Column: Details & Options */}
//           <div className="flex flex-col justify-between space-y-4">
//             <div>
//               <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-md">
//                 {product.category}
//               </span>
//               <h2 className="text-xl font-bold text-gray-800 mt-2">
//                 {product.name}
//               </h2>

//               <div className="flex items-center gap-3 mt-2">
//                 <span className="text-2xl font-black text-gray-900">
//                   ৳{currentPrice}
//                 </span>
//                 <span
//                   className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
//                     currentStock > 0
//                       ? "bg-green-50 text-green-600"
//                       : "bg-red-50 text-red-600"
//                   }`}
//                 >
//                   {currentStock > 0 ? `In Stock: ${currentStock}` : "Out of Stock"}
//                 </span>
//               </div>

//               {/* Color Selection (If Available) */}
//               {product.hasColors && product.colors && (
//                 <div className="mt-4">
//                   <label className="text-xs font-bold text-gray-700 block mb-2">
//                     Select Color: <span className="text-red-500">{selectedColor?.colorName}</span>
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     {product.colors.map((color) => (
//                       <button
//                         key={color.colorName}
//                         onClick={() => handleColorSelect(color)}
//                         className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
//                           selectedColor?.colorName === color.colorName
//                             ? "border-red-500 bg-red-50 text-red-600 shadow-sm"
//                             : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                         }`}
//                       >
//                         {color.colorCode && (
//                           <span
//                             className="w-3.5 h-3.5 rounded-full border border-gray-300"
//                             style={{ backgroundColor: color.colorCode }}
//                           />
//                         )}
//                         <span>{color.colorName}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Variant / Size Selection (If Available) */}
//               {product.hasVariants && (selectedColor?.variants || product.variants) && (
//                 <div className="mt-4">
//                   <label className="text-xs font-bold text-gray-700 block mb-2">
//                     Select Option / Size:
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     {(selectedColor?.variants || product.variants)?.map((v) => (
//                       <button
//                         key={v.id}
//                         onClick={() => setSelectedVariant(v)}
//                         className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
//                           selectedVariant?.id === v.id
//                             ? "border-gray-900 bg-gray-900 text-white"
//                             : "border-gray-200 text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                         {v.name} - ৳{v.price}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Alert Message Box */}
//             {alertMessage && (
//               <div
//                 className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
//                   alertMessage.type === "success"
//                     ? "bg-green-50 text-green-700 border border-green-200"
//                     : "bg-amber-50 text-amber-700 border border-amber-200"
//                 }`}
//               >
//                 {alertMessage.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
//                 <span>{alertMessage.text}</span>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="space-y-2 pt-2 border-t">
//               <button
//                 onClick={handleBuyNow}
//                 disabled={currentStock <= 0}
//                 className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition flex items-center justify-center gap-2 shadow-md ${
//                   currentStock > 0
//                     ? "bg-red-500 hover:bg-red-600 shadow-red-200 active:scale-[0.99]"
//                     : "bg-gray-300 cursor-not-allowed"
//                 }`}
//               >
//                 <FaShoppingCart />
//                 <span>{currentStock > 0 ? "Buy Now" : "Out of Stock"}</span>
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsModal;