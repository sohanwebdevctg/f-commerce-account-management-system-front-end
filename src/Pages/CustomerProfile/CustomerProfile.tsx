import { useParams, Link } from "react-router";
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaShoppingBag } from "react-icons/fa";

// ডমি অর্ডার হিস্টোরি ডাটা
const mockOrders = [
  { id: "ORD-9901", date: "2026-02-28", items: 3, total: 2450, status: "Delivered" },
  { id: "ORD-9852", date: "2026-02-15", items: 1, total: 850, status: "Delivered" },
  { id: "ORD-9740", date: "2026-01-20", items: 5, total: 5100, status: "Delivered" },
  { id: "ORD-9611", date: "2026-01-05", items: 2, total: 1300, status: "Cancelled" },
  { id: "ORD-9502", date: "2025-12-18", items: 4, total: 3200, status: "Delivered" },
  { id: "ORD-9410", date: "2025-11-30", items: 2, total: 1900, status: "Delivered" },
  { id: "ORD-9305", date: "2025-11-12", items: 1, total: 600, status: "Delivered" },
];

const CustomerProfile = () => {
  // রাউটের ব্যাকএন্ডের জন্য ID ব্যাকগ্রাউন্ডে থাকবে, কিন্তু ইউআই-তে হাইড করা হয়েছে
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-4 max-w-5xl mx-auto">
      {/* লাল ব্যাক বাটন */}
      <div>
        <Link
          to="/dashboard/customers"
          className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 px-3 py-1.5 rounded-lg shadow-sm transition-all"
        >
          <FaArrowLeft className="text-xs" /> Back
        </Link>
      </div>

      {/* ১ কলামের লেআউট (সব ডিসপ্লেতে উপরে-নিচে) */}
      <div className="flex flex-col gap-5">
        
        {/* ১. কাস্টমার ইনফরমেশন কার্ড */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          
          {/* কাস্টমার নাম ও টাইপ (আইডি রিমুভ করা হয়েছে) */}
          <div className="border-b border-gray-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Customer Name</h3>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">
              VIP CUSTOMER
            </span>
          </div>

          {/* টোটাল অর্ডার, অ্যামাউন্ট ও জয়েনিং ডেট */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-gray-500 font-medium text-[11px] sm:text-xs">Total Orders</p>
              <p className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5">12</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-gray-500 font-medium text-[11px] sm:text-xs">Total Spent</p>
              <p className="text-sm sm:text-base font-bold text-gray-800 mt-0.5">৳ 15,400</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2 sm:col-span-1 flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-500 font-medium text-[11px]">Joined Date</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">15 Feb, 2026</p>
              </div>
            </div>
          </div>

          {/* কন্টাক্ট ও এড্রেস ইনফো */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2.5">
              <FaPhone className="text-emerald-500 shrink-0 text-xs" />
              <div>
                <p className="text-[10px] text-gray-400">Phone</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">01700000000</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <FaEnvelope className="text-emerald-500 shrink-0 text-xs" />
              <div className="truncate">
                <p className="text-[10px] text-gray-400">Email</p>
                <p className="truncate text-xs sm:text-sm font-medium text-gray-800">customer@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-emerald-500 shrink-0 mt-1 text-xs" />
              <div>
                <p className="text-[10px] text-gray-400">City & Address</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">Dhaka</p>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  House #10, Road #2, Sector 7, Uttara
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ২. অর্ডার হিস্টোরি টেবিল */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <FaShoppingBag className="text-emerald-600" /> Order History
            </h4>
            <span className="text-xs text-gray-400 font-medium">
              Total ({mockOrders.length})
            </span>
          </div>

          {/* স্ক্রোল-যোগ্য টেবিল */}
          <div className="max-h-[500px] overflow-x-auto overflow-y-auto border border-gray-100 rounded-lg">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase z-10">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-center">Items</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-emerald-600">
                      {order.id}
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {order.date}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-gray-700">
                      {order.items}
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-800">
                      ৳ {order.total}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;