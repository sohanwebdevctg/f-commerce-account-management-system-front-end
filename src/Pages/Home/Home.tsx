import { useState, useMemo, useCallback } from "react";
// ১. ফেক ডাটা এবং টাইপ ইমপোর্ট
import { FAKE_PRODUCTS, CATEGORIES } from "../../mockData/products";
import type { Product, ColorOption, ProductVariant } from "../../mockData/products";

// ২. আমাদের সবকটি তৈরি করা কম্পোনেন্ট ইমপোর্ট
import ProductSearch from "../../Components/ProductSearch/ProductSearch";
import ProductGrid from "../../Components/ProductGrid/ProductGrid";
import ProductDetailsModal from "../../Components/ProductDetailsModal/ProductDetailsModal";
import CartDrawer from "../../Components/CartDrawer/CartDrawer";
import type { CartItem } from "../../Components/CartDrawer/CartDrawer";

const Home = () => {
  // --- স্টেট ম্যানেজমেন্ট ---
  
  // সিলেক্ট করা ক্যাটাগরি ও সার্চ টার্ম ফিল্টারিং স্টেট
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // বিস্তারিত দেখার জন্য সিলেক্ট করা প্রোডাক্ট এবং মোডাল ওপেন স্টেট
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // কার্ট ড্রয়ার ওপেন/ক্লোজ স্টেট এবং কার্ট আইটেমের তালিকা স্টেট
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // --- ১. ফিল্টারিং লজিক (Search & Category Filter) ---
const filteredProducts = useMemo(() => {
  return FAKE_PRODUCTS.filter((product) => {
    const matchesCategory = product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}, [selectedCategory, searchQuery]);

  // --- ২. মোডাল হ্যান্ডলার ---
  
  // প্রোডাক্টে ক্লিক করলে মোডাল ওপেন করার ফাংশন
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // মোডাল বন্ধ করার ফাংশন
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // --- ৩. কার্ট লজিক (Add to Cart / Duplicate Prevention) ---
  
  const handleAddToCart = useCallback(
    (selectedData: {
      product: Product;
      selectedColor?: ColorOption;
      selectedVariant?: ProductVariant;
      quantity: number;
      unitPrice: number;
      image: string;
    }) => {
      const { product, selectedColor, selectedVariant, quantity, unitPrice, image } =
        selectedData;

      // প্রোডাক্ট, কালার এবং ভ্যারিয়েন্টের সমন্বয়ে ইউনিক আইডি (Key) তৈরি
      const cartItemId = `${product.id}-${selectedColor?.colorName || "noColor"}-${
        selectedVariant?.id || "noVariant"
      }`;

      // চেক করছি প্রোডাক্টের নির্দিষ্ট ভ্যারিয়েন্টটি আগে থেকে কার্টে আছে কিনা
      const existingItem = cartItems.find((item) => item.id === cartItemId);

      if (existingItem) {
        // যদি আগেই যুক্ত থাকে, তবে ডুপ্লিকেট হবে না এবং Warning দেখাবে
        return {
          success: false,
          message: "This item variant is already in your cart list!",
        };
      }

      // কার্টে নতুন আইটেম যুক্ত করা (কিন্তু ড্রয়ার স্বয়ংক্রিয়ভাবে ওপেন হবে না)
      const newItem: CartItem = {
        id: cartItemId,
        product,
        selectedColor,
        selectedVariant,
        quantity,
        unitPrice,
        image,
      };

      setCartItems((prevItems) => [...prevItems, newItem]);
      
      return { success: true };
    },
    [cartItems]
  );

  // কার্টের পরিমাণ বাড়ানো বা কমানোর লজিক
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // কার্ট থেকে সিঙ্গেল আইটেম মুছে ফেলার লজিক
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // অর্ডার সফল হলে কার্ট খালি করার লজিক
  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">

      {/* প্রধান কন্টেন্ট সেকশন */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* ১. সার্চ ও ক্যাটাগরি ফিল্টার কম্পোনেন্ট */}
        <ProductSearch
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSearch={setSearchQuery}
        />

        {/* ২. প্রোডাক্ট গ্রিড লিস্ট কম্পোনেন্ট */}
        <ProductGrid
          products={filteredProducts}
          onViewDetails={handleViewDetails}
        />
      </main>

      {/* ৩. প্রোডাক্ট ডিটেইলস মোডাল (পপ-আপ) */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* ৪. রাইট সাইড স্লাইড-ওভার কার্ট ড্রয়ার ও অর্ডার ফরম মোডাল */}
      <CartDrawer
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default Home;