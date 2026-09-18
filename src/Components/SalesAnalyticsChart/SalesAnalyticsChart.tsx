import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const analyticsData = [
  { month: "Jan", sales: 40000, profit: 24000 },
  { month: "Feb", sales: 30000, profit: 13980 },
  { month: "Mar", sales: 20000, profit: 9800 },
  { month: "Apr", sales: 27800, profit: 3908 },
  { month: "May", sales: 1890, profit: 4800 },
  { month: "Jun", sales: 2390, profit: 3800 },
  { month: "Jul", sales: 3490, profit: 4300 },
];

const SalesAnalyticsChart = () => {
  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="bg-white p-3 sm:p-5 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-4">
          Sales Analytics
        </h2>

        <div className="w-full h-52 sm:h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analyticsData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* Sales এর জন্য রেড গ্রেডিয়েন্ট */}
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>

                {/* Profit এর জন্য গ্রিন গ্রেডিয়েন্ট */}
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={35}
              />

              <Tooltip
                contentStyle={{ fontSize: "11px", padding: "4px 8px" }}
              />

              {/* Legend: কোনটি সেলস আর কোনটি প্রফিট তা নিচে ছোট করে নির্দেশ করবে */}
              <Legend
                wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }}
              />

              {/* Sales Area (Red) */}
              <Area
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorSales)"
              />

              {/* Profit Area (Green) */}
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsChart;