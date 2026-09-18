import { useState, useEffect } from "react";
import { FaSearch, FaBoxes } from "react-icons/fa";

interface ProductSearchProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSearch: (query: string) => void;
}

const ProductSearch = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearch,
}: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Real-time search with 300ms Debounce delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 space-y-4">
      {/* Real-time Search Field */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <FaSearch className="text-base" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name..."
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Horizontal Filter Bar */}
      <div>
        <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <FaBoxes />
          <span>Categories</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-red-500 text-white shadow-md shadow-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;