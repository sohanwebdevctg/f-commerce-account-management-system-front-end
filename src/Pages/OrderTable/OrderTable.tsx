import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router";


const OrderTable = () => {

  const {role, id, token, email} = useAuth();
  // search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>(
    role === "STAFF" ? "PROCESSING" : "PENDING"
  );


  return (
    <div className="p-4 sm:p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200 mt-5">
          {/* Search & Tab Filters Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Search Input (Mobile = full width, SM = auto/w-72) */}
        <div className="w-full lg:w-80">
          <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search by name or number..." className="input input-bordered input-sm w-full focus:outline-none"/>
        </div>
        {/* search and status */}
        <div className="flex justify-between items-center gap-2 p-1 w-full sm:w-auto">
          <button className="btn bg-red-500 btn-sm text-white w-1/2 lg:w-auto" onClick={() => {setSearchTerm(""); setSelectedType("")}}>Reset</button>
          {/* create order */}
            {(role === "ADMIN" || role === "MODERATOR" || role === "STAFF") && id && email && token && (
              <Link to="/">
                <button className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-none p-4 w-full">
                  CreateOrder
                </button>
              </Link>
            )}
          {/* order type */}
          <div className="flex flex-col -mt-3.5 w-full">
            <span className="text-xs font-semibold mb-0.5">OrderType</span>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                className="select select-bordered select-sm w-full">
                  {role === "STAFF" ? (
                <>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                </>) : (
                  <>
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="RETURNED">RETURNED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </>
                )}
              </select>
          </div>
        </div>
      </div>
    
          {/* Table Container */}
          <div className="overflow-x-auto w-full rounded-xl border border-base-200">
            <table className="table w-full bg-base-100">
              {/* Table Head */}
              <thead className="bg-base-200/50 text-base-content/70 text-xs uppercase">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Number</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">TotalAmount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
    
              {/* Table Body */}
              <tbody>
                {
                  <tr className="hover:bg-base-200/30 transition-colors border-b border-base-200">
                    <td>1</td>
                    <td>Sakib</td>
                    <td>01738292837</td>
                    <td>Dhaka</td>
                    <td>1</td>
                    <td>20</td>
                    <td>
                        <select 
                          // defaultValue={category.status} 
                          name="" className="select select-bordered select-xs w-28 focus:outline-none"
                          // onChange={(e) => updateCategoryStatusMutation({ id: category.id, status: e.target.value })}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="RETURNED">RETURNED</option>
                          </select>
                        </td>
                      {/* Action Buttons */}
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <Link to={`/dashboard/orders/:id`}>
                              <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                                View
                              </button>
                            </Link>
                            <button className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none" 
                            // onClick={() => handleDelete(category.id)}
                            >Delete</button>
                          </div>
                        </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
    </div>
  );
};

export default OrderTable;