import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FaEye } from "react-icons/fa";

// search and category props
interface ProductCardProps {
  searchTerm: string;
  selectedCategory: string;
  onViewDetails: (productId: string) => void;
}

// get public products
const getPublicProducts = async (selectedCategory: string, searchTerm: string) => {
  const response = await axiosInstance.get(
    `/products/public?category=${selectedCategory}&searchTerm=${searchTerm}`
  );
  return response.data?.data;
};

const ProductCard = ({searchTerm,selectedCategory,onViewDetails}: ProductCardProps) => {
  // Data fetching and state management with useQuery
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-products", selectedCategory, searchTerm],
    queryFn: () => getPublicProducts(selectedCategory, searchTerm),
  });

  // isLoading condition
  if (isLoading) {
    return (
      <div className="text-xs text-gray-500 py-4 font-medium">
        Loading products...
      </div>
    );
  }

  // isError condition
  if (isError) {
    return (
      <div className="text-xs text-red-500 py-4 font-medium">
        Failed to load products
      </div>
    );
  }

  return (
    <div className="mt-6">
      {productData && productData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-5">
          {productData.map((product: any) => {
            // ১. সব variantItems এক জায়গায় করা
            const allVariantItems =
              product.variants?.flatMap((v: any) => v.variantItems || []) || [];

            // ২. ইউনিক কালারগুলোর লিস্ট বের করা
            const colors = Array.from(
              new Set(
                product.variants
                  ?.map((v: any) => v.colorCode)
                  .filter((c: any) => c && c.trim() !== "") || []
              )
            );

            // ৩. ইউনিক সাইজগুলোর লিস্ট বের করা
            const sizes = Array.from(
              new Set(
                allVariantItems
                  .map((item: any) => item.size)
                  .filter((s: any) => s && s.trim() !== "") || []
              )
            );

            // ৪. প্রাইস ক্যালকুলেশন
            let displayPrice = "";
            if (allVariantItems.length > 0) {
              const prices = allVariantItems.map(
                (item: any) => Number(item.sellPrice) || 0
              );
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);

              if (product.productType === "VARIANT") {
                displayPrice =
                  minPrice === maxPrice
                    ? `৳${minPrice}`
                    : `৳${minPrice} - ৳${maxPrice}`;
              } else {
                displayPrice = `৳${minPrice}`;
              }
            } else {
              displayPrice = `৳${Number(product.sellPrice) || 0}`;
            }

            // ৫. স্টক ক্যালকুলেশন
            const totalStock =
              allVariantItems.length > 0
                ? allVariantItems.reduce(
                    (sum: number, item: any) =>
                      sum + (Number(item.stock) || 0),
                    0
                  )
                : Number(product.stock) || 0;

            // ৬. ডেসক্রিপশন ট্রাঙ্কেট
            const rawDesc = product.shortDescription || product.description || "";
            const displayDesc =
              rawDesc.length > 40 ? `${rawDesc.slice(0, 40)}...` : rawDesc;

            // ৭. ব্র্যান্ড
            const brandName =
              typeof product.brand === "object"
                ? product.brand?.name
                : product.brand;

            return (
              <div
                key={product.id || product._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-3 aspect-square w-full h-52">
                    <img
                      src={product.thumbnailImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Brand Name */}
                  {brandName && (
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md inline-block mb-1">
                      {brandName}
                    </span>
                  )}

                  {/* Product Title */}
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 hover:line-clamp-none transition">
                    {product.name}
                  </h4>

                  {/* Description */}
                  {displayDesc && (
                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                      {displayDesc}
                    </p>
                  )}

                  {/* Color Palette */}
                  {colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <span className="text-[11px] text-gray-400 font-medium mr-0.5">
                        Colors:
                      </span>
                      {colors.map((color: any, idx: number) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm inline-block shrink-0"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}

                  {/* Size Badge List */}
                  {sizes.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[11px] text-gray-400 font-medium mr-0.5">
                        Size:
                      </span>
                      {sizes.map((size: any, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-gray-600 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded uppercase"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Stock Display */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                    <p className="text-base font-bold text-gray-900">
                      {displayPrice}
                    </p>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        totalStock > 0
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {totalStock > 0 ? `Stock: ${totalStock}` : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => onViewDetails(product._id || product.id)}
                  className="w-full mt-4 py-2 bg-red-500 hover:bg-green-500 text-white font-medium text-xs rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <FaEye />
                  <span>View Details</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-gray-400 py-4 font-medium">
          No products available
        </div>
      )}
    </div>
  );
};

export default ProductCard;