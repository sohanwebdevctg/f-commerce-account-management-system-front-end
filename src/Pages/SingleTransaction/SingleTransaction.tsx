import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { Link, useParams } from "react-router";

// Fetch Single transaction Function
const fetchSingleTransaction = async (id: string) => {
  const response = await axiosInstance.get(`/transactions/${id}`);
  return response.data?.data;
};

const SingleTransaction = () => {

  const { id } = useParams<{ id: string }>();

  // TanStack Query
  const { data: transaction, isLoading, isError, error } = useQuery({
    queryKey: ["singleTransaction", id],
    queryFn: () => fetchSingleTransaction(id as string),
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
        <Link to="/dashboard/transactionTable" className="btn btn-outline btn-sm mt-4">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-6 p-4">
      {isLoading ? (
        <div className="text-center py-10 font-medium text-gray-500">
          Loading transaction details...
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-error font-medium">
          Error loading transaction details!
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          {/* Category Details Section */}
          <div className="card-body w-full">
            
            {/* Created By Info */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Created By:{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {transaction?.createdBy?.name || transaction?.createdBy?.email || "Unknown"}
              </span>
            </div>

            {/* Category Name */}
            <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mt-1">${transaction?.amount || "N/A"}
            </h2>
            {/* Description */}
            <p className="text-gray-600 text-sm mt-1">
              {transaction?.note || "No note provided."}
            </p>

            <div className="divider my-2"></div>

            {/* Additional Info Data */}
            <div className="space-y-2 text-sm text-gray-600">
              {/* type */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Type:</span>
                <span
                  className={"badge badge-sm font-semibold badge-success text-white"}
                >
                  {transaction?.type || "N/A"}
                </span>
              </div>
              {/* Created At */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Created At:</span>
                <span>
                  {transaction?.createdAt
                    ? new Date(transaction.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Last Updated */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Last Updated:</span>
                <span>
                  {transaction?.updatedAt
                    ? new Date(transaction.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="card-actions justify-end mt-4">
              <Link to={`/dashboard/updateTransaction/${transaction.id}`}>
                <button className="btn btn-sm bg-emerald-600 text-white">Edit Transaction</button>
              </Link>
              <Link to="/dashboard/transactionTable">
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

export default SingleTransaction;