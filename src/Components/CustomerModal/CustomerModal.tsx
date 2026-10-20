import { FaTimes, FaUser, FaPhone, FaEnvelope, FaCity, FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router";

interface CustomerModalProps {
  isCustomerModalOpen: boolean;
  handleCloseCustomerModal: () => void;
  cartItems: any[];
}

const CustomerModal = ({ isCustomerModalOpen, handleCloseCustomerModal, cartItems }: CustomerModalProps) => {

  const {role, id} = useAuth();
  const [activeBtn, setActiveBtn] = useState(false);
  const navigate = useNavigate();

  // SweetAlert Toast Notification Config
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    // calculate total quantity
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + (item.sellPrice * item.quantity),0);

  // call customer mutation
    const {mutate: customerMutation} = useMutation({mutationFn: async(data: {name: string; phone: string, email?: string;}) => {
        const response = await axiosInstance.post('/customers', data)
        return response.data;
      },
      onSuccess: (data) => {

        if (data.success === true) {

        // orderPayload
        const orderPayload = {
          customerId: data.data.id,
          name: data.data.name, 
          phone: data.data.phone, 
          email: data.data.email, 
          city: (document.querySelector('input[name="city"]') as HTMLInputElement)?.value, 
          address: (document.querySelector('textarea[name="address"]') as HTMLTextAreaElement)?.value,
          cartItems: cartItems,
          quantity: totalQuantity,
          amount: totalAmount,
          createdById: id || null
        };

        // এবার অর্ডার মিউটেশন কল হবে
        orderMutation(orderPayload);
      }
        
      },
      onError: (error: any) => {
        // show toast
      Toast.fire({ icon: "error", title: error.response?.data?.message || error.message});
      setActiveBtn(false);
      }
    });

      // call order mutation
  const { mutate: orderMutation } = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    },
    onSuccess: (data) => {
      // show toast
      Toast.fire({ icon: "success", title: data.message });
      localStorage.removeItem('cartItems');
      // button show
      setTimeout(() => {setActiveBtn(false)}, 1500);
      // close customer modal
      handleCloseCustomerModal();
      // navigate the user
      if (role === "ADMIN" || role === "MODERATOR" || role === "STAFF") {
        navigate("/dashboard/orderTable");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
    // show toast
    Toast.fire({ icon: "error", title: error.response?.data?.message || error.message});
    setTimeout(() => {setActiveBtn(false)}, 1500);
    }
  });

  

  // checking customer modal
  if (!isCustomerModalOpen) return null;

  // submit form data
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>):Promise<void> => {

    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim() || undefined;
    const city = (form.elements.namedItem('city') as HTMLInputElement).value;
    const address = (form.elements.namedItem('address') as HTMLInputElement).value;
    
    // --- Phone number validation logic ---
    // Check if the phone number is exactly 11 digits long
    if (phone.length !== 11) {
      Toast.fire({ icon: "error", title: "The mobile number must be 11 digits long!"});
      return;
    }

    // Check if the phone number starts with '01' (Bangladeshi standard)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
    Toast.fire({ icon: "error", title: "Enter a valid Bangladeshi mobile number (e.g., 017XXXXXXXX)" });
      return;
    }
  
  // loading state start
  setActiveBtn(true);

  // call customer mutation
  customerMutation({name,phone, email});

  
  }

  return (
    <div onClick={handleCloseCustomerModal} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* close button */}
        <button onClick={handleCloseCustomerModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 cursor-pointer transition"><FaTimes className="text-lg" /></button>

        {/* header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Customer Information</h2>
          <p className="text-gray-500 text-xs mt-1">
            Total Payable Amount: <span className="font-bold text-gray-800">৳{totalAmount}</span>
          </p>
        </div>

        {/* customer form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Full Name *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaUser className="text-xs" />
              </div>
              <input type="text" name="name" placeholder="Enter full name" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700" required/>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Phone Number *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaPhone className="text-xs" />
              </div>
              <input type="text" name="phone" maxLength={11} placeholder="Enter Your Mobile Number (e.g. 017xxxxxxxx)" 
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 11);}}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700"
              required/>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Email (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope className="text-xs" />
              </div>
              <input type="email" name="email" placeholder="Enter Your Email" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700"
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
              <input type="text" name="city" placeholder="Enter Your City" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700"
              required/>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Full Address *</label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                <FaMapMarkerAlt className="text-xs" />
              </div>
              <textarea rows={4} name="address" placeholder="House, Road, Area details" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-xs text-gray-700 resize-none" required></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full py-3.5 bg-red-500 hover:bg-green-500 font-bold text-white rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2 cursor-pointer" disabled={activeBtn}>
            {activeBtn ? "Confirmed..." : `Confirm Order (৳${cartItems.reduce((total, item) => total + (item.sellPrice * item.quantity), 0)})`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;