import { useEffect, useState } from "react";
import SearchAndCategory from "../../Components/SearchAndCategory/SearchAndCategory";
import ProductCard from "../../Components/ProductCard/ProductCard";
import ViewProductDetailsModal from "../../Components/ViewProductDetailsModal/ViewProductDetailsModal";
import CartDrawer from "../../Components/CartDrawer/CartDrawer";
import Swal from "sweetalert2";
import CustomerModal from "../../Components/CustomerModal/CustomerModal";


const Home = () => {

  // search and category state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // view details modal state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // cart drawer open/close state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // customer modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);

  const handleOpenCustomerModal = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCloseCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  // ================= CART & LOCALSTORAGE STATE =================

  // initializing data from the browser's localStorage
const [cartItems, setCartItems] = useState<any[]>(() => {
  const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : [];
});


  // updating localStorage whenever cartItems change
  useEffect(() => {localStorage.setItem("cartItems", JSON.stringify(cartItems));}, [cartItems]);

  // add to cart function
  const handleAddToCart = (item: any) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (cartItem) => cartItem.variantItemId === item.variantItemId
      );

      if (existingIndex > -1) {
        return prevItems.map((cartItem, index) => {
          if (index === existingIndex) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          }
          return cartItem;
        });
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // --- কার্টের পরিমাণ বাড়ানো/কমানোর ফাংশন ---
  const handleProductQuantity = (variantItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.variantItemId === variantItemId) {
          const newQty = item.quantity + delta;
          if (newQty > item.maxStock && delta > 0) return item;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  // --- কার্ট থেকে আইটেম মুছে ফেলার ফাংশন ---
  const handleRemoveItem = (variantItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.variantItemId !== variantItemId));
    // SweetAlert2 Toast Notification
      Swal.fire({
        icon: "success",
        title: "Product Removed Successfully!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 100,
        timerProgressBar: true,
      });
  };

  // --- কার্ট সম্পূর্ণ খালি করার ফাংশন ---
  const handleClearCart = () => {
    setCartItems([]);
  };



  // ===================== Product Details Modal ==========================
  // handle open modal
  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  // handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="container mx-auto py-10">
      {/* search and category */}
      <SearchAndCategory searchTerm={searchTerm} setSearchTerm={setSearchTerm}selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}></SearchAndCategory>

      {/* product card */}
      <ProductCard searchTerm={searchTerm} selectedCategory={selectedCategory} onViewDetails={handleViewDetails}></ProductCard>

      {/* view product details modal */}
      <ViewProductDetailsModal key={selectedProductId || "modal"} isOpen={isModalOpen} onClose={handleCloseModal}selectedProductId={selectedProductId} cartItems={cartItems} handleAddToCart={handleAddToCart}/>

      {/* cart drawer */}
      <CartDrawer cartItems={cartItems} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} handleProductQuantity={handleProductQuantity} handleRemoveItem={handleRemoveItem} handleClearCart={handleClearCart} handleOpenCustomerModal={handleOpenCustomerModal}/>

      {/* customer modal */}
      <CustomerModal isCustomerModalOpen={isCustomerModalOpen} handleCloseCustomerModal={handleCloseCustomerModal} cartItems={cartItems}setCartItems={setCartItems}></CustomerModal>

    </div>
  );
};

export default Home;