import { FaMinus, FaPlus, FaShoppingCart, FaTimes, FaTrash } from "react-icons/fa";

interface CartDrawerProps {
  cartItems: any[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  handleProductQuantity: (variantItemId: string, delta: number) => void;
  handleRemoveItem: (variantItemId: string) => void;
  handleClearCart: () => void;
  handleOpenCustomerModal: () => void;
}

const CartDrawer = ({cartItems, isCartOpen, setIsCartOpen, handleRemoveItem,handleProductQuantity, handleClearCart, handleOpenCustomerModal}: CartDrawerProps) => {

  // মোট আইটেম সংখ্যা হিসাব
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* ১. ডানপাশের ভাসমান কার্ট বাটন (Floating Button) */}
      <button onClick={() => setIsCartOpen(!isCartOpen)} className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-red-500 text-white py-4 px-3 rounded-l-2xl shadow-xl hover:bg-red-600 transition-all z-40 flex flex-col items-center gap-2 cursor-pointer">
        <div className="relative">
          <FaShoppingCart className="text-xl" />{totalQuantity > 0 && (<span className="absolute -top-2 -right-2 bg-white text-red-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-red-500">{totalQuantity}</span>)}
        </div>
      </button>

      {/* ২. ব্যাকড্রপ ওভারলে (বাইরে ক্লিক করলে বন্ধ হওয়ার জন্য) */}
      {isCartOpen && (<div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"/>)}

      {/* ৩. স্লাইড-ওভার ড্রয়ার প্যানেল (Slide Panel) */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ড্রয়ার হেডার */}
        <div className="p-5 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-red-500 text-lg" />
            <h3 className="font-bold text-gray-800 text-base">Order Summary</h3>
            <span className="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full">
              {totalQuantity} items
            </span>
          </div>

          {/* হেডার কন্ট্রোল: ক্লিয়ার বাটন এবং ক্লোজ বাটন */}
          <div className="flex items-center gap-3">
            {/* ক্লিয়ার কার্ট বাটন (শুধুমাত্র কার্টে আইটেম থাকলেই দেখাবে) */}
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-1 text-xs font-medium  text-white bg-red-500 px-2.5 py-1.5 rounded-lg transition cursor-pointer" title="Clear all items from cart">
                <FaTrash className="text-[8px]" /><span>Clear Cart</span>
              </button>)}
          </div>

          {/* ড্রয়ার ক্লোজ বাটন */}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition cursor-pointer"
            >
              <FaTimes />
            </button>
        </div>

        {/* টেবিল বডি অংশ */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <FaShoppingCart className="text-4xl text-gray-300" />
              <p className="text-sm">Your cart list is empty.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600 min-w-[400px]">
              <thead className="text-[11px] uppercase bg-gray-50 text-gray-500 border-b">
                <tr>
                  <th className="py-2.5 px-2">Item Details</th>
                  <th className="py-2.5 px-1 text-center">Color</th>
                  <th className="py-2.5 px-1 text-center">Size</th>
                  <th className="py-2.5 px-1 text-center">Qty</th>
                  <th className="py-2.5 px-1 text-right">Total</th>
                  <th className="py-2.5 px-1 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cartItems.map((item) => (
                  <tr key={item.variantItemId} className="hover:bg-gray-50/80 transition">
                    {/* প্রোডাক্ট ইমেজ ও নাম */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-xs line-clamp-2 leading-tight">
                            {item.productName}
                          </p>
                          <span className="text-[11px] font-medium text-gray-500">
                            ৳{item.sellPrice} price
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* কালার (না থাকলে N/A) */}
                    <td className="py-3 px-1 text-center">
                      {item.colorCode ? (
                        <span
                          className="inline-block w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: item.colorCode }}
                          title={item.colorCode}
                        />
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">N/A</span>
                      )}
                    </td>

                    {/* সাইজ (না থাকলে N/A) */}
                    <td className="py-3 px-1 text-center">
                      {item.size ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded text-gray-700">
                          {item.size}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">N/A</span>
                      )}
                    </td>

                    {/* কোয়ান্টিটি কন্ট্রোল (প্লাস/মাইনাস ও স্টক লিমিট) */}
                    <td className="py-3 px-1 text-center">
                      <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        {/* মাইনাস বাটন */}
                        <button
                          onClick={() => handleProductQuantity(item.variantItemId, -1)}
                          disabled={item.quantity <= 1}
                          className={`p-1 rounded text-xs transition ${
                            item.quantity <= 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "bg-red-500 text-white cursor-pointer"
                          }`}
                        >
                          <FaMinus className="text-[9px]" />
                        </button>

                        {/* বর্তমান কোয়ান্টিটি */}
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>

                        {/* প্লাস বাটন */}
                        <button
                          onClick={() => handleProductQuantity(item.variantItemId, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className={`p-1 rounded text-xs transition ${
                            item.quantity >= item.maxStock
                              ? "text-gray-300 cursor-not-allowed"
                              : "bg-green-500 text-white cursor-pointer"
                          }`}
                        >
                          <FaPlus className="text-[9px]" />
                        </button>
                      </div>
                    </td>

                    {/* সাব-টোটাল প্রাইস */}
                    <td className="py-3 px-1 text-right font-bold text-gray-800 text-xs whitespace-nowrap">
                      ৳{item.sellPrice * item.quantity}
                    </td>

                    {/* ডিলিট বাটন (ডিজাইন করা, ফাংশন ছাড়া) */}
                    <td className="py-3 px-1 text-center">
                      <div onClick={() => handleRemoveItem(item.variantItemId)} className="inline-flex items-center justify-center w-7 h-7 bg-red-100 hover:bg-red-200 rounded-lg text-red-500 transition cursor-pointer">
                        <FaTrash className="text-xs" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* ========================================== */}
        {/* ৪. ড্রয়ার ফুটার (টোটাল অ্যামাউন্ট ও চেকআউট বাটন) */}
        {/* ========================================== */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t bg-gray-50 flex flex-col gap-3">
            {/* টোটাল অ্যামাউন্ট হিসাব */}
            <div className="flex items-center justify-between text-gray-800">
              <span className="font-bold text-sm">Total Amount:</span>
              <span className="font-extrabold text-base text-red-600">
                ৳{cartItems.reduce((total, item) => total + (item.sellPrice * item.quantity), 0)}
              </span>
            </div>

            {/* প্রসিড টু চেকআউট বাটন */}
            <button onClick={() => { setIsCartOpen(false); handleOpenCustomerModal();}} className="w-full bg-red-500 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition cursor-pointer text-center">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;