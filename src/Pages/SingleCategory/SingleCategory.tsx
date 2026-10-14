import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";

// Fetch Single Category Function
const fetchSingleCategory = async (id: string) => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data?.data;
};

const SingleCategory = () => {
  const { id } = useParams<{ id: string }>();

  // TanStack Query
  const { data: category, isLoading, isError, error } = useQuery({
    queryKey: ["singleCategory", id],
    queryFn: () => fetchSingleCategory(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{(error as any)?.response?.data?.message || "Failed to load category details!"}</p>
        <Link to="/dashboard/categoriesTable" className="btn btn-outline btn-sm mt-4">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-6 p-4">
      {isLoading ? (
        <div className="text-center py-10 font-medium text-gray-500">
          Loading category details...
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-error font-medium">
          Error loading category details!
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          {/* Category Details Section */}
          <div className="card-body w-full">
            
            {/* Created By Info */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Created By:{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {category?.createdBy?.name || category?.createdBy?.email || "Unknown"}
              </span>
            </div>

            {/* Category Name */}
            <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mt-1">
              {category?.name || "N/A"}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-1">
              {category?.description || "No description provided."}
            </p>

            <div className="divider my-2"></div>

            {/* Additional Info Data */}
            <div className="space-y-2 text-sm text-gray-600">
              {/* Product Count */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Products:</span>
                <span className="badge badge-neutral badge-sm font-semibold">
                  {category?._count?.products || 0}
                </span>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <span
                  className={`badge badge-sm font-semibold ${
                    category?.status === "ACTIVE"
                      ? "badge-success text-white"
                      : "badge-error text-white"
                  }`}
                >
                  {category?.status || "N/A"}
                </span>
              </div>

              {/* Created At */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Created At:</span>
                <span>
                  {category?.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Last Updated */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Last Updated:</span>
                <span>
                  {category?.updatedAt
                    ? new Date(category.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="card-actions justify-end mt-4">
              <Link to={`/dashboard/updateCategory/${category.id}`}>
                <button className="btn btn-sm bg-emerald-600 text-white">Edit Category</button>
              </Link>
              <Link to="/dashboard/categoryTable">
                <button className="btn bg-rose-600 hover:bg-rose-700 text-white btn-sm">
                  Back
                </button>
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCategory;