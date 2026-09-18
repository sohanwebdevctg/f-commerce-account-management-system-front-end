import { useState } from "react";
import { FaShoppingCart,FaChevronRight,FaChevronLeft,FaTimes,FaTrash,FaPlus,FaMinus,FaUserPlus,FaUser,FaPhone,FaEnvelope,FaCity,FaMapMarkerAlt,
} from "react-icons/fa";
import type { Product, ColorOption, ProductVariant } from "../../mockData/products";

export interface CartItem {
  id: string; // Unique combination key (e.g. "prodId-color-variant")
  product: Product;
  selectedColor?: ColorOption;
  selectedVariant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface CartDrawerProps {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const CartDrawer = ({
  cartItems,
  isCartOpen,
  setIsCartOpen,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) => {
  // Customer Checkout Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.phone || !formData.city || !formData.address) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      setBtnLoading(true);
      // Backend API call here
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Order submitted successfully!");
      onClearCart();
      setIsModalOpen(false);
      setIsCartOpen(false);
      setFormData({ name: "", phone: "", email: "", city: "", address: "" });
    } catch (err) {
      setFormError("Failed to submit order.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      {/* Floating Right Side Cart Button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-red-500 text-white py-4 px-3 rounded-l-2xl shadow-xl hover:bg-red-600 transition-all z-40 flex flex-col items-center gap-2"
      >
        {/* {isCartOpen ? <FaChevronRight /> : <FaChevronLeft />} */}
        <div className="relative">
          <FaShoppingCart className="text-xl" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-red-500">
              {totalQuantity}
            </span>
          )}
        </div>
      </button>

      {/* Backdrop Overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Slide-over Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-red-500 text-lg" />
            <h3 className="font-bold text-gray-800 text-base">Order Summary</h3>
            <span className="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full">
              {totalQuantity} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Order Table */}
<div className="flex-1 overflow-y-auto overflow-x-auto p-4">
  {cartItems.length === 0 ? (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
      <FaShoppingCart className="text-4xl text-gray-300" />
      <p className="text-sm">Your order list is empty.</p>
    </div>
  ) : (
    /* min-w-[380px] যোগ করা হয়েছে যেন ছোট স্ক্রিনে ডানে-বামে স্ক্রোল করার মতো সাইজ থাকে */
    <table className="w-full text-left text-sm text-gray-600 min-w-[380px]">
      <thead className="text-[11px] uppercase bg-gray-50 text-gray-500 border-b">
        <tr>
          <th className="py-2.5 px-2">Item Details</th>
          <th className="py-2.5 px-1 text-center">Qty</th>
          <th className="py-2.5 px-1 text-right">Total</th>
          <th className="py-2.5 px-1 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {cartItems.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50/80 transition">
            <td className="py-3 px-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={item.image}
                  alt=""
                  className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                />
                <div>
                  {/* line-clamp-2 দেওয়া হয়েছে যেন প্রোডাক্টের নাম না কেটে নিচে ২ লাইনে সুন্দরভাবে বসে */}
                  <p className="font-semibold text-gray-800 text-xs line-clamp-2 leading-tight">
                    {item.product.name}
                  </p>
                  <div className="text-[10px] text-gray-400">
                    {item.selectedColor && (
                      <span className="mr-1.5">
                        Color: {item.selectedColor.colorName}
                      </span>
                    )}
                    {item.selectedVariant && (
                      <span>Variant: {item.selectedVariant.name}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-500">
                    ৳{item.unitPrice} each
                  </span>
                </div>
              </div>
            </td>
            <td className="py-3 px-1 text-center">
              <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="p-1 hover:bg-white rounded text-xs transition text-gray-600"
                >
                  <FaMinus className="text-[9px]" />
                </button>
                <span className="text-xs font-bold w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="p-1 hover:bg-white rounded text-xs transition text-gray-600"
                >
                  <FaPlus className="text-[9px]" />
                </button>
              </div>
            </td>
            <td className="py-3 px-1 text-right font-bold text-gray-800 text-xs whitespace-nowrap">
              ৳{item.unitPrice * item.quantity}
            </td>
            <td className="py-3 px-1 text-center">
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-gray-300 hover:text-red-500 p-1 transition"
              >
                <FaTrash className="text-xs" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

        {/* Drawer Footer & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t bg-gray-50 space-y-4">
            <div className="flex justify-between items-center text-base font-bold text-gray-800">
              <span>Total Amount:</span>
              <span className="text-red-500">৳{totalAmount}</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-red-200 transition transform active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>

      {/* Customer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-red-200 mb-3">
                <FaUserPlus className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Customer Information</h2>
              <p className="text-gray-500 text-xs mt-1">
                Total Payable Amount: <span className="font-bold text-gray-800">৳{totalAmount}</span>
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaUser className="text-xs" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaPhone className="text-xs" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="01700000000"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Email (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope className="text-xs" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">City *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaCity className="text-xs" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="Dhaka"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700"
                    value={formData.city}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Full Address *</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                    <FaMapMarkerAlt className="text-xs" />
                  </div>
                  <textarea
                    name="address"
                    rows={2}
                    placeholder="House, Road, Area details"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700 resize-none"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={btnLoading}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 font-bold text-white rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                {btnLoading ? "Confirming Order..." : `Confirm Order (৳${totalAmount})`}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;