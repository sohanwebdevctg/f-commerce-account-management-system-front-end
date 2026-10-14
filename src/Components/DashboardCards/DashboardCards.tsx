import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../Context/AuthContext";
import { FaChartLine, FaDollarSign, FaWallet } from "react-icons/fa";


// Fetch Dashboard Summary Function
const fetchDashboardSummary = async () => {
  const response = await axiosInstance.get("/transactions/summary");
  return response.data?.data;
};

const DashboardCards = () => {

  const { role } = useAuth();

  // TanStack Query
  const { data: summary, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
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
        <p>{(error as any)?.response?.data?.message || "Failed to load summary!"}</p>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* ১. সামারি কার্ড সেকশন */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        
        {/* Total Investment Card (Only visible to ADMIN) */}
        {role === "ADMIN" && summary?.totalInvestment !== undefined && (
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Invest
              </span>
              <div className="p-3 rounded-lg bg-indigo-100">
                <FaWallet className="text-xl text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                ৳ {summary?.totalInvestment ?? 0}
              </h3>
            </div>
          </div>
        )}

        {/* Total Revenue / Income Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Revenue / Income
            </span>
            <div className="p-3 rounded-lg bg-emerald-100">
              <FaDollarSign className="text-xl text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-800">
              ৳ {summary?.totalIncome ?? 0}
            </h3>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Expense
            </span>
            <div className="p-3 rounded-lg bg-rose-100">
              <FaChartLine className="text-xl text-rose-600" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-800">
              ৳ {summary?.totalExpense ?? 0}
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardCards;