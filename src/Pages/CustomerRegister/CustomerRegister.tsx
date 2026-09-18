import { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaCity, FaMapMarkerAlt, FaUserPlus } from "react-icons/fa";

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
}

const CustomerRegister = () => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");

    // Basic Validation
    if (!formData.name || !formData.phone || !formData.city || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setBtnLoading(true);
      // API integration for backend will be placed here
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Customer registered successfully!");
      
      // Reset Form
      setFormData({ name: "", phone: "", email: "", city: "", address: "" });
    } catch (err) {
      setError("Failed to register customer. Please try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-200 mb-4">
            <FaUserPlus className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Customer Registration</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter customer details to create a new profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaUser className="text-sm" />
              </div>
              <input
                type="text"
                name="name"
                maxLength={100}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaPhone className="text-sm" />
              </div>
              <input
                type="tel"
                name="phone"
                maxLength={20}
                placeholder="01700000000"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Address (Optional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Email Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope className="text-sm" />
              </div>
              <input
                type="email"
                name="email"
                maxLength={100}
                placeholder="customer@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FaCity className="text-sm" />
              </div>
              <input
                type="text"
                name="city"
                maxLength={100}
                placeholder="Dhaka"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Full Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Full Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                <FaMapMarkerAlt className="text-sm" />
              </div>
              <textarea
                name="address"
                rows={3}
                placeholder="House #12, Road #5, Block #B, Dhanmondi"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-700 transition resize-none"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${
              btnLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg shadow-red-200 transform active:scale-[0.99]"
            }`}
          >
            {btnLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Registering...</span>
              </div>
            ) : (
              <>
                <FaUserPlus />
                <span>Register Customer</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegister;