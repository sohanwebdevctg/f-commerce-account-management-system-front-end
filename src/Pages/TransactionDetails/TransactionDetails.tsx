import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { 
  FaArrowLeft, 
  FaEdit, 
  FaCalendarAlt, 
  FaClock, 
  FaStickyNote, 
  FaShoppingBag, 
  FaUser 
} from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

export type TransactionType = "INVESTMENT" | "INCOME" | "EXPENSE";

export interface ITransactionDetails {
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
  updatedAt: string;
}

// ডমি সিঙ্গেল ট্রানজেকশন ডাটা
const mockTransactionData: ITransactionDetails = {
  id: "tx-102",
  type: "INCOME",
  amount: 12500,
  note: "Payment received for completed Order #ORD-501 via Bkash Merchant account.",
  createdById: "usr-2",
  createdBy: {
    name: "Sabbir Hossain",
    email: "sabbir@store.com",
    profileImage: "https://i.pravatar.cc/150?img=12",
  },
  orderId: "ord-501",
  createdAt: "2026-02-10 10:30 AM",
  updatedAt: "2026-02-10 10:30 AM",
};

const TransactionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // ডমি রোল (ADMIN এবং MODERATOR আপডেট করতে পারবে)
  const [currentUserRole] = useState<"ADMIN" | "MODERATOR" | "STAFF">("ADMIN");
  const [transaction] = useState<ITransactionDetails>(mockTransactionData);

  const canModify = currentUserRole === "ADMIN" || currentUserRole === "MODERATOR";

  // Type Badge Helper
  const renderTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "INVESTMENT":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            INVESTMENT
          </span>
        );
      case "INCOME":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            INCOME
          </span>
        );
      case "EXPENSE":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
            EXPENSE
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Top Bar: Back & Update Button */}
        <div className="flex flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigate("/dashboard/transactions")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-100 transition cursor-pointer"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>

          {canModify && (
            <button
              onClick={() => navigate(`/dashboard/transactions/edit/${id || transaction.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-100 transition cursor-pointer"
            >
              <FaEdit className="text-xs" /> Update Transaction
            </button>
          )}
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Info */}
          <div className="p-4 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 border border-emerald-100">
                <GrTransaction />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Transaction Details</h2>
                <div>{renderTypeBadge(transaction.type)}</div>
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 p-3 sm:p-4 rounded-xl text-left sm:text-right w-full sm:w-auto">
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">Total Amount</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
                ৳{transaction.amount.toLocaleString("en-BD")}
              </p>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
            
            {/* Created By User Box */}
            <div className="bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Created By (Staff/Admin)
              </p>
              <div className="flex items-center gap-3">
                {transaction.createdBy.profileImage ? (
                  <img
                    src={transaction.createdBy.profileImage}
                    alt={transaction.createdBy.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-emerald-200"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    <FaUser />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{transaction.createdBy.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{transaction.createdBy.email}</p>
                </div>
              </div>
            </div>

            {/* Note & Description */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-100 shadow-2xs space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <FaStickyNote className="text-emerald-500" />
                <span>Transaction Note / Description</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 pt-1 leading-relaxed break-words">
                {transaction.note || "No additional note provided for this transaction."}
              </p>
            </div>

            {/* Order Relation (Responsive Flex Col for Mobile) */}
            {transaction.orderId && (
              <div className="bg-blue-50/50 p-3.5 sm:p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <FaShoppingBag />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500 font-medium">Associated Order</p>
                    <p className="text-xs sm:text-sm font-bold text-blue-600 break-all">Order ID: #{transaction.orderId}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/dashboard/orders/${transaction.orderId}`)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer text-center"
                >
                  View Order
                </button>
              </div>
            )}

            {/* Timestamps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
              <div className="bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <FaCalendarAlt />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500 font-medium">Created Date</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5 truncate">{transaction.createdAt}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <FaClock />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500 font-medium">Last Updated</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5 truncate">{transaction.updatedAt}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TransactionDetails;