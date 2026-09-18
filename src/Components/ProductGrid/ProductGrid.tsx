import { FaEye } from "react-icons/fa";
import type { Product } from "../../mockData/products";

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

const ProductGrid = ({ products, onViewDetails }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100 shadow-sm">
        No products found matching your search or category filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <span>Products</span>
        <span className="text-xs font-normal text-gray-500">
          ({products.length} items found)
        </span>
      </h3>

      {/* Responsive Grid: 1 -> 2 -> 3 -> 4 -> 5 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-3 aspect-square">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 text-[10px] font-semibold text-red-600 bg-red-50/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-red-100">
                  {product.category}
                </span>
              </div>

              {/* Title & Price */}
              <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 hover:line-clamp-none transition">
                {product.name}
              </h4>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-base font-bold text-gray-900">
                  ৳{product.basePrice}
                </p>
                {product.hasVariants && (
                  <span className="text-[10px] text-gray-400 font-medium">
                    Multiple Variants
                  </span>
                )}
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => onViewDetails(product)}
              className="w-full mt-4 py-2 bg-gray-900 hover:bg-red-500 text-white font-medium text-xs rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <FaEye />
              <span>View Details</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;