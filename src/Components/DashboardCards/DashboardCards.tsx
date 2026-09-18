import { 
  FaWallet, 
  FaDollarSign, 
  FaChartLine, 
  FaBoxes, 
  FaTrashAlt, 
  FaShoppingCart, 
  FaUserCog, 
  FaUsers, 
  FaArrowUp, 
  FaArrowDown 
} from "react-icons/fa";

const DashboardCards = () => {
  // আপনার দেওয়া ক্রমানুযায়ী ৮টি ফেক ডাটা কার্ড
  const cardData = [
    {
      id: 1,
      title: "Total Invest",
      value: "৳ 5,00,000",
      change: "+4.2%",
      isPositive: true,
      icon: <FaWallet className="text-xl text-indigo-600" />,
      iconBg: "bg-indigo-100",
    },
    {
      id: 2,
      title: "Total Revenue / Income",
      value: "৳ 4,85,110",
      change: "+12.5%",
      isPositive: true,
      icon: <FaDollarSign className="text-xl text-emerald-600" />,
      iconBg: "bg-emerald-100",
    },
    {
      id: 3,
      title: "Net Profit / Loss",
      value: "৳ 87,450",
      change: "-3.1%", // উদাহরণ হিসেবে লস দেখানো হলো (ডাউন অ্যারো আসবে)
      isPositive: false,
      icon: <FaChartLine className="text-xl text-rose-600" />,
      iconBg: "bg-rose-100",
    },
    {
      id: 4,
      title: "Total Products",
      value: "1,240 Pcs",
      change: "+2.4%",
      isPositive: true,
      icon: <FaBoxes className="text-xl text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      id: 5,
      title: "Waste Products",
      value: "18 Pcs",
      change: "-1.2%",
      isPositive: false,
      icon: <FaTrashAlt className="text-xl text-amber-600" />,
      iconBg: "bg-amber-100",
    },
    {
      id: 6,
      title: "Total Sell",
      value: "850 Orders",
      change: "+8.7%",
      isPositive: true,
      icon: <FaShoppingCart className="text-xl text-purple-600" />,
      iconBg: "bg-purple-100",
    },
    {
      id: 7,
      title: "Total User",
      value: "12 Admins",
      change: "0%",
      isPositive: true,
      icon: <FaUserCog className="text-xl text-teal-600" />,
      iconBg: "bg-teal-100",
    },
    {
      id: 8,
      title: "Total Customer",
      value: "3,420 Users",
      change: "+15.3%",
      isPositive: true,
      icon: <FaUsers className="text-xl text-cyan-600" />,
      iconBg: "bg-cyan-100",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* মোবাইল: ১টি, ট্যাবলেট: ২টি, বড় স্ক্রিন: ৩টি কলাম */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-3 rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                {card.value}
              </h3>
              
              {/* কন্ডিশন অনুযায়ী আপ/ডাউন অ্যারো এবং কালার */}
              <span
                className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.isPositive 
                    ? "text-emerald-600 bg-emerald-50" 
                    : "text-rose-600 bg-rose-50"
                }`}
              >
                {card.isPositive ? (
                  <FaArrowUp className="mr-1 text-[10px]" />
                ) : (
                  <FaArrowDown className="mr-1 text-[10px]" />
                )}
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;