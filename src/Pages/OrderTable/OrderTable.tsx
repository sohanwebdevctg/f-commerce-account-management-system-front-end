import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router";
import axiosInstance from "../../api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// get all orders data
const getAllOrders = async ( searchTerm: string, selectedType: string) => {
  const params = new URLSearchParams();
  
  if (searchTerm) params.append("searchTerm", searchTerm);
  if (selectedType) params.append("type", selectedType);

  const response = await axiosInstance.get(`/orders?${params.toString()}`);
  return response.data?.data;
};

// update order status
const updateOrderStatus = async ({ id, status }: { id: string; status: string }) => { const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
  return response.data;
};

// delete order (soft delete)
const deleteOrder = async (id: string) => {
  const response = await axiosInstance.delete(`/orders/${id}`);
  return response.data;
};

const OrderTable = () => {

  const {role, id, token, email} = useAuth();
  // search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>(
    role === "STAFF" ? "PROCESSING" : "PENDING"
  );

  // SweetAlert Toast Notification Config
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });

  // TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders", searchTerm, selectedType],
    queryFn: () => getAllOrders(searchTerm, selectedType),
  });

    // Status Update Mutation
  const queryClient = useQueryClient();
  const { mutate: updateOrderStatusMutation } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // show toast
      Toast.fire({ icon: "success", title: data?.message || "order status updated successfully!"});
    },
    onError: (error: any) => {
        // show toast
    Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update status!"});
    },
  });

  // Handle Delete Confirmation
    const handleDelete = (orderId: string) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this Order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteOrderMutation(orderId);
        }
      });
    };

  // Delete Order Mutation
      const { mutate: deleteOrderMutation } = useMutation({
        mutationFn: deleteOrder,
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          // show toast
          Toast.fire({ icon: "success", title: data?.message || "Order deleted successfully!"});
        },
        onError: (error: any) => {
          // show toast
        Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to delete Order!"});
        },
      });

  console.log(data);


  return (
    <div className="p-4 sm:p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200 mt-5">
          {/* Search & Tab Filters Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Search Input (Mobile = full width, SM = auto/w-72) */}
        <div className="w-full lg:w-80">
          <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search by name or number or invoice..." className="input input-bordered input-sm w-full focus:outline-none"/>
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
                  <th className="py-3 px-4">InvoiceNo</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Number</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">TotalAmount</th>
                  {selectedType !== "CANCELLED" && (
                    <th className="py-3 px-4">Status</th>
                  )}
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
    
              {/* Table Body */}
              <tbody>
                {
                  isLoading ? (
  <tr>
    <td colSpan={9} className="text-center py-6">
      Loading orders...
    </td>
  </tr>
) : isError ? (
  <tr>
    <td colSpan={9} className="text-center py-6 text-error">
      Error loading orders!
    </td>
  </tr>
) : data?.length === 0 ? (
  <tr>
    <td colSpan={9} className="text-center py-6 text-gray-500 font-medium">
      No orders found!
    </td>
  </tr>
) : data?.map((order: any, index: number) => (
  <tr className="hover:bg-base-200/30 transition-colors border-b border-base-200">
    <td className="py-3 px-4 font-semibold text-sm">{index + 1}</td>
    {/* Invoice No */}
    <td className="py-3 px-4 font-semibold text-sm text-primary">{order.invoiceNo}</td>
    {/* Customer Name */}
      <td className="py-3 px-4 font-semibold text-sm">
        {order.name}
      </td>
      {/* Phone Number */}
      <td className="py-3 px-4 font-semibold text-sm">
        {order.phone}
      </td>
      {/* City */}
      <td className="py-3 px-4 font-semibold text-sm">
        {order.city}
      </td>
      {/* Quantity */}
      <td className="py-3 px-4 font-semibold text-sm">
        {order.quantity}
      </td>
      {/* Total Amount */}
      <td className="py-3 px-4 font-semibold text-sm">
        ৳{order.amount}
      </td>
      {/* Status (Dropdown or Badge) */}
      {selectedType !== "CANCELLED" && (
        <td>
          <select defaultValue={order.status} className="select select-bordered select-xs w-28 focus:outline-none" onChange={(e) => updateOrderStatusMutation({ id: order.id, status: e.target.value })}>
            {role === "STAFF" ? (
              <>
                <option value="PROCESSING">PROCESSING</option>
                <option value="CONFIRMED">CONFIRMED</option>
              </>
            ) : (
              <>
                <option value="PENDING">PENDING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="RETURNED">RETURNED</option>
              </>
            )}
          </select>
        </td>
      )}
      {/* Action Buttons */}
      <td className="py-3 px-4">
        <div className="flex items-center justify-center gap-2">
          <Link to={`/dashboard/orders/${order.id}`}>
            <button className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none">View
            </button>
          </Link>

          {/* কন্ডিশনাল ডিলিট বাটন: প্রসেসিং বা রিটার্ন হলে দেখাবে */}
          {selectedType !== "CANCELLED" && (role === "ADMIN" || role === "MODERATOR") && (order.status === "PENDING" || order.status === "RETURNED") && (
            <button 
              className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none"
              onClick={() => handleDelete(order.id)}
            >
              Delete
            </button>
          )}
        </div>
      </td>
  </tr>
))

                }
              </tbody>
            </table>
          </div>
    </div>
  );
};

export default OrderTable;