import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2"; // SweetAlert2 Import
import { 
  FaArrowLeft, 
  FaPlus, 
  FaMoneyBillWave, 
  FaStickyNote, 
  FaShoppingBag,
  FaTags
} from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

export type TransactionType = "INVESTMENT" | "INCOME" | "EXPENSE";

// SweetAlert2 Toast Setup
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

const CreateTransaction: React.FC = () => {
  const navigate = useNavigate();

  // ডমি ইউজার রোল (ADMIN / MODERATOR / STAFF)
  const [currentUserRole] = useState<"ADMIN" | "MODERATOR" | "STAFF">("ADMIN");

  // ফর্মে ডাইনামিক অপশন (ADMIN হলে ৩টি, অন্যথায় ২টি)
  const availableTypes: TransactionType[] = currentUserRole === "ADMIN"
    ? ["INVESTMENT", "INCOME", "EXPENSE"]
    : ["INCOME", "EXPENSE"];

  // ফর্ম স্টেট
  const [type, setType] = useState<TransactionType>(availableTypes[0]);
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ফর্ম সাবমিট
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      setBtnLoading(true);

      // API Call Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // SweetAlert2 Toast
      Toast.fire({
        icon: "success",
        title: "Transaction created successfully!",
      });

      // ফর্ম ক্লিয়ার করা (একই পেজে রাখার জন্য navigate বাদ দেওয়া হয়েছে)
      setAmount("");
      setNote("");
      setOrderId("");
      setType(availableTypes[0]); 

    } catch (err) {
      setError("Failed to create transaction. Please try again.");
      
      Toast.fire({
        icon: "error",
        title: "Failed to create transaction.",
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-8">
        
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 border-4 border-emerald-100 shadow-sm">
            <GrTransaction />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Create Transaction</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Record a new income, expense, or investment
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs sm:text-sm flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-4 sm:space-y-5">
          
          {/* Transaction Type Select */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">Transaction Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaTags className="text-sm" />
              </div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm text-gray-700 transition cursor-pointer"
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">Amount (৳)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaMoneyBillWave className="text-sm" />
              </div>
              <input
                type="number"
                placeholder="e.g. 5000"
                min="1"
                step="any"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm text-gray-700 transition"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Order ID Input (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Order ID <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <FaShoppingBag className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="e.g. ord-501"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm text-gray-700 transition"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
          </div>

          {/* Note Input (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Note / Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-emerald-500">
                <FaStickyNote className="text-sm" />
              </div>
              <textarea
                rows={3}
                placeholder="Write reason or details about this transaction..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm text-gray-700 transition"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
              btnLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg shadow-emerald-200 transform active:scale-[0.99] cursor-pointer"
            }`}
          >
            {btnLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-xs sm:text-sm">Creating Transaction...</span>
              </div>
            ) : (
              <>
                <FaPlus className="text-xs sm:text-sm" />
                <span className="text-xs sm:text-sm">Create Transaction</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateTransaction;