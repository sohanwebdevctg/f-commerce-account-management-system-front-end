import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus, FaSearch, FaTimes, FaEye, FaTrash, FaChevronLeft, FaChevronRight,FaExclamationTriangle,FaUser } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

export type TransactionType = "INVESTMENT" | "INCOME" | "EXPENSE";

export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: number;
  note?: string;
  createdById: string;
  createdBy: {
    name: string;
    email: string;
    profileImage?: string;
  };
  orderId?: string;
  createdAt: string;
}

// ডমি ডাটা (API সিমুলেশনের জন্য)
const mockTransactions: ITransaction[] = [
  {
    id: "tx-101",
    type: "INVESTMENT",
    amount: 50000,
    note: "Initial business investment",
    createdById: "usr-1",
    createdBy: {
      name: "Anisur Rahman",
      email: "anis@store.com",
      profileImage: "https://i.pravatar.cc/150?img=11",
    },
    createdAt: "2026-02-01",
  },
  {
    id: "tx-102",
    type: "INCOME",
    amount: 12500,
    note: "Payment received for Order #ORD-501",
    createdById: "usr-2",
    createdBy: {
      name: "Sabbir Hossain",
      email: "sabbir@store.com",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    orderId: "ord-501",
    createdAt: "2026-02-10",
  },
  {
    id: "tx-103",
    type: "EXPENSE",
    amount: 3200,
    note: "Office electricity bill and internet bill",
    createdById: "usr-3",
    createdBy: {
      name: "Mehedi Hasan",
      email: "mehedi@store.com",
    },
    createdAt: "2026-02-15",
  },
  {
    id: "tx-104",
    type: "EXPENSE",
    amount: 1500,
    note: "Courier charges for product delivery",
    createdById: "usr-2",
    createdBy: {
      name: "Sabbir Hossain",
      email: "sabbir@store.com",
      profileImage: "https://i.pravatar.cc/150?img=12",
    },
    createdAt: "2026-02-20",
  },
];

const TransactionsTable: React.FC = () => {
  const navigate = useNavigate();

  // ডমি কারেন্ট ইউজার রোল (ADMIN / MODERATOR / STAFF)
  const [currentUserRole] = useState<"ADMIN" | "MODERATOR" | "STAFF">("ADMIN");

  const [transactions, setTransactions] = useState<ITransaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<ITransaction | null>(null);

  // Filter Handler (User name or Transaction type search)
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleOpenDeleteModal = (tx: ITransaction) => {
    setTransactionToDelete(tx);
    setIsDeleteModalOpen(true);
  };

  const ConfirmDelete = () => {
    if (transactionToDelete) {
      setTransactions((prev) => prev.filter((item) => item.id !== transactionToDelete.id));
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  const canDelete = currentUserRole === "ADMIN";

  // Type Badge Style Generator
  const renderTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "INVESTMENT":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            INVESTMENT
          </span>
        );
      case "INCOME":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            INCOME
          </span>
        );
      case "EXPENSE":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
            EXPENSE
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <GrTransaction className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Transaction Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Track income, expense, and investment records
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/transactions/create")}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-100 cursor-pointer"
          >
            <FaPlus className="text-xs" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Search & Total Badge Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Search Input with Clear (X) Button */}
          <div className="relative flex-1 max-w-md w-full">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search by user, type, or amount..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200/60 transition cursor-pointer"
                title="Clear Search"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Total Count Badge */}
          <div className="text-xs font-medium text-gray-500 flex items-center justify-between sm:justify-end gap-2 bg-gray-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border border-gray-100 sm:border-none">
            <span>Total Transactions:</span>
            <span className="font-bold text-gray-800 bg-white sm:bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 sm:border-none">
              {filteredTransactions.length}
            </span>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center whitespace-nowrap">#</th>
                  <th className="py-4 px-6 whitespace-nowrap">User Details</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">Type</th>
                  <th className="py-4 px-6 text-right whitespace-nowrap">Amount (৳)</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">Created Date</th>
                  <th className="py-4 px-6 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {currentData.length > 0 ? (
                  currentData.map((tx, index) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Serial Index */}
                      <td className="py-4 px-6 text-center font-medium text-gray-500 whitespace-nowrap">
                        {startIndex + index + 1}
                      </td>

                      {/* User Profile & Name */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {tx.createdBy.profileImage ? (
                            <img
                              src={tx.createdBy.profileImage}
                              alt={tx.createdBy.name}
                              className="w-9 h-9 rounded-full object-cover border border-emerald-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
                              <FaUser />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{tx.createdBy.name}</p>
                            <p className="text-xs text-gray-400">{tx.createdBy.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Transaction Type Badge */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {renderTypeBadge(tx.type)}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right font-bold text-gray-800 whitespace-nowrap">
                        ৳{tx.amount.toLocaleString("en-BD")}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6 text-center text-xs text-gray-500 whitespace-nowrap">
                        {tx.createdAt}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => navigate(`/dashboard/transactions/${tx.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <FaEye className="text-xs" /> View
                          </button>

                          {/* Delete Button (Only Admin) */}
                          {canDelete && (
                            <button
                              onClick={() => handleOpenDeleteModal(tx)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            >
                              <FaTrash className="text-xs" /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                      No transactions found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && transactionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-xl" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Delete Transaction?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Are you sure you want to delete transaction of <span className="font-semibold text-gray-700">"৳{transactionToDelete.amount}"</span> created by {transactionToDelete.createdBy.name}?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={ConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition shadow-md shadow-rose-100 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TransactionsTable;