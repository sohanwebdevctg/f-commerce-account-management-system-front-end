import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../Context/AuthContext";
import { FaChartLine, FaDollarSign, FaUsers, FaUserShield, FaUserTimes, FaWallet } from "react-icons/fa";


// Fetch Dashboard Summary Function
const fetchDashboardSummary = async () => {
  const response = await axiosInstance.get("/transactions/summary");
  return response.data?.data;
};

// Fetch all customers data
const fetchAllCustomers = async () => {
  const response = await axiosInstance.get('/customers');
  return response.data?.data;
};

const DashboardCards = () => {

  const { role } = useAuth();

  // 1. Transaction Summary Query
  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError, error: summaryError } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
  });

  // Customers Query (Variables renamed to avoid conflict)
  const { data: customersData, isLoading: isCustomerLoading, isError: isCustomerError, error: customerError } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchAllCustomers,
  });


  // Combined Loading state
  if (isSummaryLoading || isCustomerLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Combined Error state
  if (isSummaryError || isCustomerError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{(summaryError as any)?.response?.data?.message || (customerError as any)?.response?.data?.message || "Failed to load data!"}</p>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* transaction section start */}
      <div>
        <p className="border-b-[1.5px] border-red-500 w-full mb-2 text-xl">Transaction</p>
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
      {/* transaction section end */}
      {/* user section start */}
      {/* user section end */}
      {/* customer section start (Visible only to ADMIN and MODERATOR) */}
      {(role === "ADMIN" || role === "MODERATOR") && (
        <div>
          <p className="border-b-[1.5px] border-red-500 w-full mb-2 text-xl font-semibold text-gray-800">Customers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            
            {/* Regular Customers Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Regular Customers
                </span>
                <div className="p-3 rounded-lg bg-blue-100">
                  <FaUsers className="text-xl text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {customersData?.filter((customer: any) => customer.customerType === "REGULAR").length || 0}/{customersData?.length || 0}
                </h3>
              </div>
            </div>

            {/* VIP Customers Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  VIP Customers
                </span>
                <div className="p-3 rounded-lg bg-amber-100">
                  <FaUserShield className="text-xl text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {customersData?.filter((customer: any) => customer.customerType === "VIP").length || 0}/{customersData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Fraud Risk Customers Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fraud Risk Customers
                </span>
                <div className="p-3 rounded-lg bg-red-100">
                  <FaUserTimes className="text-xl text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {customersData?.filter((customer: any) => customer.customerType === "FRAUD_RISK").length || 0}/{customersData?.length || 0}
                </h3>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* customer section end */}
    </div>
  );
};

export default DashboardCards;