import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend} from "recharts";

// January to December balanced fake data for sales and profit
const analyticsData = [
  { month: "Jan", sales: 35000, profit: 21000 },
  { month: "Feb", sales: 28000, profit: 16500 },
  { month: "Mar", sales: 42000, profit: 35000 },
  { month: "Apr", sales: 31000, profit: 18200 },
  { month: "May", sales: 48000, profit: 29000 },
  { month: "Jun", sales: 39000, profit: 22500 },
  { month: "Jul", sales: 52000, profit: 52000 },
  { month: "Aug", sales: 45000, profit: 27000 },
  { month: "Sep", sales: 58000, profit: 35000 },
  { month: "Oct", sales: 49000, profit: 29500 },
  { month: "Nov", sales: 62000, profit: 38000 },
  { month: "Dec", sales: 70000, profit: 42000 },
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
            <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Red gradient for sales */}
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>

                {/* Green gradient for profit */}
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10 }} interval="preserveStartEnd"/>

              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={35}/>

              <Tooltip contentStyle={{ fontSize: "11px", padding: "4px 8px" }}/>

              {/* Legend: It will briefly indicate below which figure represents sales and which represents profit */}
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }}/>

              {/* Sales Area (Red) */}
              <Area type="monotone" dataKey="sales" name="Sales" stroke="#ef4444" fillOpacity={1} fill="url(#colorSales)"/>

              {/* Profit Area (Green) */}
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsChart;