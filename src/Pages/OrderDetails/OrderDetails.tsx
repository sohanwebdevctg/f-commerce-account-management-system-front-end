import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";

// Fetch Order Detail
const fetchOrderDetails = async (id: string) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data?.data;
};

// quantity increment and decrement
const updateOrderQuantity = async ({ itemId, type }: { itemId: string; type: 'increment' | 'decrement' }) => {
  const response = await axiosInstance.patch(`/orders/items/${itemId}/quantity`, { type });
  return response.data;
};

// delete order (hard delete)
const deleteOrder = async (id: string) => {
  const response = await axiosInstance.delete(`/orders/items/${id}`);
  return response.data;
};

// update damage quantity
const updateDamageQuantity = async ({ itemId, damagedQuantity }: { itemId: string; damagedQuantity: number }) => {
  const response = await axiosInstance.patch(`/orders/items/${itemId}/damage`, { damagedQuantity });
  return response.data;
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {role} = useAuth();

  // SweetAlert Toast Notification Config
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  });

  // TanStack Query
  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: () => fetchOrderDetails(id as string),
    enabled: !!id,
  });


  // Handle Delete Confirmation
      const handleDelete = (itemId: string) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to delete this Product item?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteOrderMutation(itemId);
          }
        });
      };
    
      const queryClient = useQueryClient();
    
    // Quantity Update Mutation
  const { mutate: updateQuantityMutation } = useMutation({
    mutationFn: updateOrderQuantity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orderDetails", id] });
      Toast.fire({ icon: "success", title: data?.message || "Quantity updated successfully!" });
    },
    onError: (error: any) => {
      Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update quantity!" });
    },
  });

    // Delete Order Mutation
      const { mutate: deleteOrderMutation } = useMutation({
        mutationFn: deleteOrder,
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["orderDetails"] });
          // show toast
          Toast.fire({ icon: "success", title: data?.message || "Product item deleted successfully!"});
        },
        onError: (error: any) => {
          // show toast
        Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to delete Product item!"});
        },
      });

  
    // handle quantity change function common
  const handleQuantityChange = (itemId: string, currentQty: number, type: 'increment' | 'decrement') => {
  if (type === 'decrement' && currentQty <= 1) {
    Toast.fire({ icon: "warning", title: "Quantity cannot be less than 1!" });
    return;
  }
  // সরাসরি মিউটেশন কল হবে, আর ব্যাকএন্ড স্টক চেক করে রেসপন্স বা এরর দেবে
  updateQuantityMutation({ itemId, type });
};

  // Handle Damage Quantity Change with Confirmation
  const handleDamageChange = (itemId: string, selectedQty: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change Damage quantity?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // কনফার্ম করলে এপিআই হিট হবে
        updateDamageMutation({ itemId, damagedQuantity: selectedQty });
      }
    });
  };

  // Damage Quantity Update Mutation
  const { mutate: updateDamageMutation } = useMutation({
    mutationFn: updateDamageQuantity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orderDetails", id] });
      Toast.fire({ icon: "success", title: data?.message || "Damage quantity updated successfully!" });
    },
    onError: (error: any) => {
      Toast.fire({ icon: "error", title: error?.response?.data?.message || "Failed to update damage quantity!" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-gray-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p className="font-semibold text-lg">
          {(error as any)?.response?.data?.message || "Failed to load order details!"}
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm mt-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-6 p-4 space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none">Back</button>

      {/* কাস্টমার ও অর্ডার ইনফরমেশন কার্ড */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
          Order Summary & Customer Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p><strong className="text-gray-600">Invoice No:</strong> <span className="font-semibold text-primary">{order?.invoiceNo}</span></p>
            <p><strong className="text-gray-600">Customer Name:</strong> {order?.name}</p>
            <p><strong className="text-gray-600">Phone:</strong> {order?.phone}</p>
            <p><strong className="text-gray-600">Email:</strong> {order?.email || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <p><strong className="text-gray-600">City:</strong> {order?.city}</p>
            <p><strong className="text-gray-600">Delivery Address:</strong> {order?.address}</p>
            <p><strong className="text-gray-600">Order Date:</strong> {new Date(order?.createdAt).toLocaleString()}</p>
            <p>
              <strong className="text-gray-600">Status:</strong>{" "}
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                order?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order?.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                order?.status === 'RETURNED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {order?.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* অর্ডারকৃত প্রোডাক্টের টেবিল সেকশন */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
  <div className="p-4 bg-gray-50 border-b">
    <h3 className="font-bold text-gray-700">Ordered Products List</h3>
  </div>
  {/* এখানে overflow-x-auto এবং min-w-[700px] ব্যবহার করা হয়েছে যাতে মোবাইল স্ক্রিনে টেবিল ভেঙে না যায় */}
  <div className="overflow-x-auto w-full">
    <table className="table w-full min-w-[700px]">
      <thead>
        <tr className="bg-gray-100/60 text-gray-600 text-xs uppercase tracking-wider">
          <th className="w-2/5">Product</th>
          <th className="w-1/5">Color / Size</th>
          <th className="text-center w-1/5">Quantity</th>
          <th className="text-right w-1/5">Total Amount</th>
          {role !== 'STAFF' && (order?.status === 'ACCEPTED' || order?.status === 'RETURNED') && (<th className="text-center w-1/5">Actions</th>)}
        {role !== 'STAFF' && (order?.status === 'RETURNED') && (<th className="text-right w-1/5">Damage</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 text-sm">
        {order?.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map((item: any) => (
            <tr key={item.id} className="hover:bg-gray-50/50">
              {/* প্রোডাক্ট ইমেজ ও নাম */}
              <td>
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.productName} 
                      className="w-12 h-12 object-cover rounded-lg border shadow-sm flex-shrink-0" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                      No Image
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500">Unit Price: ৳{item.sellPrice}</p>
                  </div>
                </div>
              </td>

              {/* ভেরিয়েন্ট, কালার ও সাইজ */}
              <td>
                <div className="space-y-1 text-xs text-gray-600 whitespace-nowrap">
                  {item.variantName && <p><strong>Variant:</strong> {item.variantName}</p>}
                  {item.colorCode && (
                    <div className="flex items-center gap-1.5">
                      <strong>Color:</strong> 
                      <span 
                        className="w-3.5 h-3.5 rounded-full inline-block border shadow-inner flex-shrink-0" 
                        style={{ backgroundColor: item.colorCode }}
                        title={item.colorCode}
                      ></span>
                    </div>
                  )}
                  {item.size && <p><strong>Size:</strong> {item.size}</p>}
                  {!item.variantName && !item.colorCode && !item.size && (
                    <span className="text-gray-400">Standard</span>
                  )}
                </div>
              </td>

              {/* কোয়ান্টিটি এবং প্লাস-মাইনাস বাটন */}
              <td className="text-center">
                {role !== 'STAFF' && (order?.status === 'ACCEPTED' || order?.status === 'RETURNED') ? (
                  <div className="inline-flex items-center gap-1 p-1">
                    <button className="w-6 h-6 flex items-center justify-center bg-red-500 rounded text-xs font-bold text-white"
                    onClick={() => handleQuantityChange(item.id, item.quantity, 'decrement')}
                    >-</button>
                    <span className="w-6 text-center font-semibold text-gray-700">{item.quantity}</span>
                    <button className="w-6 h-6 flex items-center justify-center bg-green-500 rounded text-xs font-bold text-white"
                    onClick={() => handleQuantityChange(item.id, item.quantity, 'increment')}
                    >+</button>
                  </div>
                ) : (
                  <span className="font-semibold text-gray-700">{item.quantity}</span>
                )}
              </td>

              {/* মোট দাম */}
              <td className="text-right font-bold text-gray-800 whitespace-nowrap">
                ৳{item.totalPrice}
              </td>
              
              {/* অ্যাকশন বাটন (ডিলিট) */}
              {role !== 'STAFF' && (order?.status === 'ACCEPTED' || order?.status === 'RETURNED') && (
              <td>
                <button className="btn btn-xs bg-red-500 hover:bg-red-600 text-white border-none" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            )}

            {role !== 'STAFF' && order?.status === 'RETURNED' && (
            <td>
              <select 
                className="select select-bordered select-xs bg-gray-50 text-xs w-28" 
                value={item.damagedQuantity || 0} 
                onChange={(e) => handleDamageChange(item.id, Number(e.target.value))}
              >
                <option value={0}>0 Pcs (No Damage)</option>
                {[...Array(item.quantity)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Pcs
                  </option>
                ))}
              </select>
            </td>
          )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center py-12 bg-red-500 text-white font-bold text-base">
              No products available in this order!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

export default OrderDetails;