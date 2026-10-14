import { useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// propsInterface
interface SearchAndCategoryProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
}

// Fetch Public Categories (Only active and not deleted categories)
const getPublicCategories = async () => {
  const response = await axiosInstance.get("/categories/public");
  return response.data?.data;
};

const SearchAndCategory = ({searchTerm, setSearchTerm, selectedCategory, setSelectedCategory}: SearchAndCategoryProps) => {

  // get category data
  const { data: categoryData, isLoading, isError } = useQuery({
    queryKey: ["public-categories"],
    queryFn: getPublicCategories,
  });

  // Auto select the first category when data loads
  useEffect(() => {
    if (categoryData && categoryData.length > 0 && !selectedCategory) {
      setSelectedCategory(categoryData[0].id);
    }
  }, [categoryData, selectedCategory, setSelectedCategory]);

  // isLoading Condition
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto p-3 scrollbar-none">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-9 w-24 bg-gray-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  // isError Condition
  if (isError) {
    return (
      <div className="text-xs text-red-500 p-3 font-medium">
        Failed to load categories
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* search section start */}
      <section>
        <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm m-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search products by name..." 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-sm text-gray-700 transition"
            />
            <button 
              onClick={() => setSearchTerm("")} 
              className="w-full sm:w-auto px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition shadow-sm whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>
      </section>
      {/* search section end */}

      {/* category buttons section start */}
      <section className="px-3 pb-3 mt-5">
        {categoryData && categoryData.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryData.map((category: { id: string; name: string }) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(
                    selectedCategory === category.id ? "" : category.id
                  );
                  setSearchTerm("");
                }}
                className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all duration-200 shadow-sm ${
                  selectedCategory === category.id
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400 py-1 font-medium">
            No categories available
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchAndCategory;