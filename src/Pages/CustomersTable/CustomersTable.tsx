import { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight, FaEye, FaTimes } from "react-icons/fa";
import { Link } from "react-router";

type CustomerType = "REGULAR" | "VIP" | "FRAUD_RISK";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  customerType: CustomerType;
  totalOrders?: number;
  createdAt: string;
}

const CustomersTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 30; // প্রতি পেজে ৩০ জন

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const dummyData: Customer[] = Array.from({ length: 35 }, (_, index) => ({
          id: `uuid-${index + 100}`,
          name: `Customer ${index + 1}`,
          phone: `017000000${index < 10 ? "0" + index : index}`,
          email: index % 2 === 0 ? `customer${index + 1}@gmail.com` : undefined,
          city: index % 3 === 0 ? "Dhaka" : index % 3 === 1 ? "Chittagong" : "Sylhet",
          address: `House #${index + 10}, Road #${index + 2}, Sector 7`,
          customerType: index % 5 === 0 ? "VIP" : index % 7 === 0 ? "FRAUD_RISK" : "REGULAR",
          totalOrders: Math.floor(Math.random() * 15) + 1,
          createdAt: "2026-02-15T10:30:00.000Z",
        }));

        setCustomers(dummyData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage]);

  // কাস্টমার টাইপ চেঞ্জ
  const handleTypeChange = (id: string, newType: CustomerType) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, customerType: newType } : c))
    );
  };

  // সার্চ ক্লিয়ার হ্যান্ডলার
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // সার্চ ফিল্টার
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // পেজিনেশন হিসাব
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // ব্যাজ কালার
  const getTypeBadge = (type: CustomerType) => {
    switch (type) {
      case "VIP":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "FRAUD_RISK":
        return "bg-rose-100 text-rose-700 border-rose-200 font-bold animate-pulse";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-5">
        
        {/* হেডার ও সার্চ বার */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Customers List</h2>
            <p className="text-xs text-gray-500">Total Loaded: {filteredCustomers.length}</p>
          </div>

          {/* সার্চ বার ক্লিয়ার বাটনসহ */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search name, phone, city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
            
            {/* সার্চে টেক্সট থাকলে ক্লিয়ার (X) বাটন দেখাবে */}
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear Search"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>
        </div>

        {/* ক্লিন ডাটা টেবিল */}
        {loading ? (
          <div className="text-center py-10 text-xs text-gray-500">Loading Customers Data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase">
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3 text-center">Total Orders</th>
                  <th className="py-3 px-3">Customer Type</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {currentData.length > 0 ? (
                  currentData.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3 text-center font-semibold text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-gray-800">{customer.name}</p>
                      </td>
                      <td className="py-3 px-3 text-gray-700 font-medium">
                        {customer.phone}
                      </td>
                      <td className="py-3 px-3 text-gray-600 font-medium">
                        {customer.city}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {customer.totalOrders ?? 0}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={customer.customerType}
                          onChange={(e) => handleTypeChange(customer.id, e.target.value as CustomerType)}
                          className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${getTypeBadge(
                            customer.customerType
                          )}`}
                        >
                          <option value="REGULAR">REGULAR</option>
                          <option value="VIP">VIP</option>
                          <option value="FRAUD_RISK">FRAUD_RISK</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {/* ডায়নামিক ID ব্যবহার করা হয়েছে */}
                        <Link to={`/dashboard/customers/${customer.id}`}>
                          <button className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-2.5 py-1 rounded text-xs font-medium transition-all">
                            <FaEye /> View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-xs text-gray-400">
                      No customer found with "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* মাঝখান বরাবর পেজিনেশন (বাম পাশের টেক্সট বাদ দেওয়া হয়েছে) */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center mt-5 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-all"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-all"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomersTable;