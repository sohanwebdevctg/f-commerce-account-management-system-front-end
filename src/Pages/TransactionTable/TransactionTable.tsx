import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";

// get all transaction data
const getAllTransactions = async ( searchTerm: string, startDate: string, endDate: string, selectedType: string) => {
  const params = new URLSearchParams();
  
  if (searchTerm) params.append("searchTerm", searchTerm);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (selectedType) params.append("type", selectedType);

  const response = await axiosInstance.get(`/transactions?${params.toString()}`);
  return response.data;
};

const TransactionTable = () => {

  const { role } = useAuth();
  const isAdmin = role === "ADMIN";
  
  // search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  // TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions", searchTerm, startDate, endDate, selectedType],
    queryFn: () => getAllTransactions(searchTerm, startDate, endDate, selectedType),
  });

  return (
    <div className="p-4 sm:p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200 mt-5">
      {/* Search & Filters Container */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
  
        {/* ADMIN Search Input (শুধুমাত্র অ্যাডমিনের জন্য দৃশ্যমান থাকবে) */}
        {isAdmin && (
          <div className="w-full xl:w-72">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="input input-bordered input-sm w-full focus:outline-none"
            />
          </div>
        )}

        {/* Controls Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 lg:gap-2 w-full xl:w-auto items-center">
          {/* Create Transaction Button */}
          <div className="flex flex-row justify-end md:mt-5">
            <Link to="/dashboard/createTransaction" className="w-full">
              <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none w-full">
                Create Transaction
              </button>
            </Link>
          </div>
          
          {/* Reset Button */}
          <div className="flex flex-row justify-end md:mt-5">
            <button 
              className="btn bg-red-500 btn-sm text-white w-full" 
              onClick={() => { setSearchTerm(""); setStartDate(""); setEndDate(""); setSelectedType(""); }}
            >
              Reset
            </button>
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold mb-1 text-base-content/70">From</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered input-sm w-full"/>
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold mb-1 text-base-content/70">To</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered input-sm w-full"/>
          </div>

          {/* Transaction Type Select */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold mb-1">Type</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select select-bordered select-sm w-full">
              <option value="">All</option>
              {isAdmin && (<option value="INVESTMENT">INVESTMENT</option>)}
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>
          </div>
        </div>
      </div>
    
      {/* Table Container */}
      <div className="overflow-x-auto overflow-y-auto w-full rounded-xl border border-base-200">
        <table className="table w-full bg-base-100">
          {/* Table Head */}
          <thead className="bg-base-200/50 text-base-content/70 text-xs uppercase">
            <tr>
              <th className="py-3 px-4">#</th>
              {isAdmin && (<th className="py-3 px-4">Name</th>)}
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center py-6">
                  Loading transactions...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center py-6 text-error">
                  Error loading transactions!
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center py-6 text-gray-500 font-medium">
                  No transactions found. Please click Reset or create a new transaction! 
                </td>
              </tr>
            ) : (
              data?.data?.map((transaction: any, index: number) => (
                <tr key={transaction.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200">
                  <td className="font-semibold text-sm">{index + 1}</td>
                  
                  {/* Name (Only for ADMIN) */}
                  {isAdmin && (
                    <td className="font-semibold text-sm">
                      <div>
                        <div className="font-bold text-sm">{transaction.createdBy?.name || "N/A"}</div>
                        <div className="text-xs text-base-content/60">{transaction.createdBy?.email || "N/A"}</div>
                      </div>
                    </td>
                  )}

                  {/* Amount */}
                  <td className="font-semibold text-sm">{transaction.amount}</td>
                  
                  {/* Transaction Type */}
                  <td className="font-semibold text-sm">{transaction.type}</td>
                  
                  {/* Date */}
                  <td className="font-semibold text-sm whitespace-nowrap">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </td>
                  
                  {/* Action Buttons */}
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/dashboard/singleTransaction/${transaction.id}`}>
                        <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">View</button>
                      </Link>
                      <Link to={`/dashboard/updateTransaction/${transaction.id}`}>
                        <button className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none">Edit</button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;