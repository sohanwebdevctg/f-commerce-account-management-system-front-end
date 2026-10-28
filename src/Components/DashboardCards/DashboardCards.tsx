import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../Context/AuthContext";
import { FaBox, FaBoxes, FaChartLine, FaCheck, FaCheckCircle, FaClock, FaDollarSign, FaSpinner, FaTimesCircle, FaTrashAlt, FaTruck, FaUndo, FaUserCheck, FaUserClock, FaUsers, FaUserShield, FaUserSlash, FaUserTimes, FaWallet } from "react-icons/fa";


// Fetch Dashboard Summary Function
const fetchDashboardSummary = async () => {
  const response = await axiosInstance.get("/transactions/summary");
  return response.data?.data;
};

// Fetch all orders Function
const fetchAllOrders = async () => {
  const response = await axiosInstance.get('/orders/summary');
  return response.data?.data;
};

// Fetch all users Function
const fetchAllUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data?.data;
}

// Fetch all categories data
const fetchAllCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data?.data;
}

// Fetch all products data
  const fetchAllProducts = async () => {
    const response = await axiosInstance.get('/products');
    return response.data?.data;
  }

// Fetch all customers data
const fetchAllCustomers = async () => {
  const response = await axiosInstance.get('/customers');
  return response.data?.data;
};


const DashboardCards = () => {

  const { role } = useAuth();

  // Transaction Summary Query
  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError, error: summaryError } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
  });

  // Order Query
  const { data: ordersData, isLoading: isOrderLoading, isError: isOrderError, error: orderError } = useQuery({
      queryKey: ["orders"],
      queryFn:fetchAllOrders,
    });

  // User Query
  const {data: usersData, isLoading: isUserLoading, isError: isUserError, error: userError} = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers
  });

    // Category Query
    const {data: categoriesData, isLoading: isCategoryLoading, isError: isCategoryError, error: categoryError} = useQuery({
      queryKey: ["categories"],
      queryFn: fetchAllCategories,
    });

  // Product Query
  const {data: productsData, isLoading: isProductLoading, isError: isProductError, error: productError} = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
  });

  // Customers Query
  const { data: customersData, isLoading: isCustomerLoading, isError: isCustomerError, error: customerError } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchAllCustomers,
  });

  console.log("Orders Summary Data:", ordersData);


  // Combined Loading state
  if (isSummaryLoading || isOrderLoading || isUserLoading || isCategoryLoading || isProductLoading || isCustomerLoading ) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Combined Error state
  if (isSummaryError || isOrderError || isUserError || isCategoryError || isProductError || isCustomerError ) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{(summaryError as any)?.response?.data?.message || (orderError as any)?.response?.data?.message || (customerError as any)?.response?.data?.message || (userError as any)?.response?.data?.message || (categoryError as any)?.response?.data?.message || (productError as any)?.response?.data?.message || "Failed to load data!"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* transaction section start */}
      <div>
        <p className="border-b-[1.5px] border-red-500 w-full mb-3 text-xl">Transaction</p>
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
      {/* order section start */}
      <div>
        <p className="border-b-[1.5px] border-red-500 w-full mb-3 text-xl">Orders</p>
        {
          (role === "ADMIN" || role === "MODERATOR") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {/* Pending Orders */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pending Orders
                  </span>
                  <div className="p-3 rounded-lg bg-amber-100">
                    <FaClock className="text-xl text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {ordersData?.pendingCount || 0}
                  </h3>
                </div>
              </div>
              {/* Accepted Orders */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Accepted Orders
                  </span>
                  <div className="p-3 rounded-lg bg-emerald-100">
                    <FaCheckCircle className="text-xl text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {ordersData?.acceptedCount || 0}
                  </h3>
                </div>
              </div>
              {/* Processing Orders */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Processing Orders
                </span>
                <div className="p-3 rounded-lg bg-blue-100">
                  <FaSpinner className="text-xl text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {ordersData?.processingCount || 0}
                </h3>
              </div>
            </div>
            {/* Confirmed Orders */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Confirmed Orders
                </span>
                <div className="p-3 rounded-lg bg-indigo-100">
                  <FaCheck className="text-xl text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {ordersData?.confirmedCount || 0}
                </h3>
              </div>
            </div>
            {/* Delivered Orders */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Delivered Orders
                  </span>
                  <div className="p-3 rounded-lg bg-teal-100">
                    <FaTruck className="text-xl text-teal-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {ordersData?.deliveredCount || 0}
                  </h3>
                </div>
              </div>
              {/* Returned Orders */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Returned Orders
                  </span>
                  <div className="p-3 rounded-lg bg-orange-100">
                    <FaUndo className="text-xl text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {ordersData?.returnedCount || 0}
                  </h3>
                </div>
              </div>
              {/* Removed / Cancelled Orders */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Removed / Cancelled Orders
                  </span>
                  <div className="p-3 rounded-lg bg-rose-100">
                    <FaTrashAlt className="text-xl text-rose-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {ordersData?.cancelledCount || 0}
                  </h3>
                </div>
              </div>
            </div>
          )
        }
        {
          (role === "STAFF") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {/* Processing Orders */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Processing Orders
                  </span>
                  <div className="p-3 rounded-lg bg-blue-100">
                    <FaSpinner className="text-xl text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {ordersData?.processingCount || 0}
                  </h3>
                </div>
              </div>

              {/* Confirmed Orders */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Confirmed Orders
                  </span>
                  <div className="p-3 rounded-lg bg-indigo-100">
                    <FaCheck className="text-xl text-indigo-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {ordersData?.confirmedCount || 0}
                  </h3>
                </div>
              </div>
            </div>
          )
        }
      </div>
      {/* order section end */}
      {/* user section start */}
      {(role === "ADMIN" || role === "MODERATOR") && (
        <div>
          <p className="border-b-[1.5px] border-red-500 w-full mb-3 text-xl font-semibold text-gray-800">Users</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            
            {/* Admin Users Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin Users
                </span>
                <div className="p-3 rounded-lg bg-purple-100">
                  <FaUserShield className="text-xl text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.filter((user: any) => user.role === "ADMIN").length || 0}/{usersData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Moderator Users Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Moderator Users
                </span>
                <div className="p-3 rounded-lg bg-blue-100">
                  <FaUsers className="text-xl text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.filter((user: any) => user.role === "MODERATOR").length || 0}/{usersData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Staff Users Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Staff Users
                </span>
                <div className="p-3 rounded-lg bg-cyan-100">
                  <FaWallet className="text-xl text-cyan-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.filter((user: any) => user.role === "STAFF").length || 0}/{usersData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Approved Users Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Approved Users
                </span>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <FaUserCheck className="text-xl text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.filter((user: any) => user.status === "APPROVED").length || 0}/{usersData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Pending Users Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pending Users
                </span>
                <div className="p-3 rounded-lg bg-amber-100">
                  <FaUserClock className="text-xl text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.filter((user: any) => user.status === "PENDING").length || 0}/{usersData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Rejected Users Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rejected Users
                </span>
                <div className="p-3 rounded-lg bg-rose-100">
                  <FaUserSlash className="text-xl text-rose-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.filter((user: any) => user.status === "REJECTED").length || 0}/{usersData?.length || 0}
                </h3>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* user section end */}
      {/* category section start */}
      {(role === "ADMIN" || role === "MODERATOR") && (
        <div>
          <p className="border-b-[1.5px] border-red-500 w-full mb-3 text-xl font-semibold text-gray-800">Categories</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            
            {/* Active Categories Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Categories
                </span>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <FaCheckCircle className="text-xl text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {categoriesData?.filter((category: any) => category.status === "ACTIVE" && !category.isDeleted).length || 0}/{categoriesData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Inactive Categories Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Inactive Categories
                </span>
                <div className="p-3 rounded-lg bg-amber-100">
                  <FaTimesCircle className="text-xl text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {categoriesData?.filter((category: any) => category.status === "INACTIVE" && !category.isDeleted).length || 0}/{categoriesData?.length || 0}
                </h3>
              </div>
            </div>
            {/* Deleted Categories Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Deleted Categories
                </span>
                <div className="p-3 rounded-lg bg-rose-100">
                  <FaTrashAlt className="text-xl text-rose-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {categoriesData?.filter((category: any) => category.isDeleted).length || 0}/{categoriesData?.length || 0}
                </h3>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* category section end */}
      {/* product section start */}
      {(role === "ADMIN" || role === "MODERATOR") && (
        <div>
          <p className="border-b-[1.5px] border-red-500 w-full mb-3 text-xl font-semibold text-gray-800">Products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {/* Active Products Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Products
                </span>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <FaCheckCircle className="text-xl text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {productsData?.filter((product: any) => product.isActive && !product.isDeleted).length || 0}/{productsData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Inactive Products Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Inactive Products
                </span>
                <div className="p-3 rounded-lg bg-amber-100">
                  <FaTimesCircle className="text-xl text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {productsData?.filter((product: any) => !product.isActive && !product.isDeleted).length || 0}/{productsData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Single Products Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Single Products
                </span>
                <div className="p-3 rounded-lg bg-blue-100">
                  <FaBox className="text-xl text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {productsData?.filter((product: any) => product.productType === "SINGLE").length || 0}/{productsData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Variant Products Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Variant Products
                </span>
                <div className="p-3 rounded-lg bg-indigo-100">
                  <FaBoxes className="text-xl text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {productsData?.filter((product: any) => product.productType === "VARIANT").length || 0}/{productsData?.length || 0}
                </h3>
              </div>
            </div>

            {/* Deleted Products Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Deleted Products
                </span>
                <div className="p-3 rounded-lg bg-rose-100">
                  <FaTrashAlt className="text-xl text-rose-600" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {productsData?.filter((product: any) => product.isDeleted).length || 0}/{productsData?.length || 0}
                </h3>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* product section end */}
      {/* customer section start */}
      {(role === "ADMIN" || role === "MODERATOR") && (
        <div>
          <p className="border-b-[1.5px] border-red-500 w-full mb-3 text-xl font-semibold text-gray-800">Customers</p>
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