export interface ProductVariant {
  id: string;
  name: string; // e.g., "5 Kg", "10 Kg", "500g"
  price: number;
  stock: number;
}

export interface ColorOption {
  colorName: string;
  colorCode?: string;
  images: string[]; // 4 images for this color
  variants: ProductVariant[];
}

export interface Product {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  hasVariants: boolean;
  hasColors: boolean;
  totalStock?: number; // Simple single product-এর মোট স্টক
  mainImage: string; // প্রধান ১টি মাত্র ছবি
  additionalImages?: string[]; // অপশনাল: মাল্টিপল ছবি থাকলে (যেমন ২-৪টি)
  variants?: ProductVariant[]; // অপশনাল: কালার ছাড়া কেজি/গ্রাম/সাইজ ভ্যারিয়েন্ট
  colors?: ColorOption[]; // অপশনাল: কালার ভিত্তিক ভ্যারিয়েন্ট ও ছবি
}

export const CATEGORIES = ["Beauty & Care", "Grocery", "Vehicles"];

export const FAKE_PRODUCTS: Product[] = [
  // ১. কালার + সাইজ + মাল্টিপল ছবি (Lux Soap - ১২টি ছবি ৪টি করে কালারে ভাগ করা)
  {
    id: 1,
    name: "Lux Soft Rose Beauty Soap",
    category: "Beauty & Care",
    basePrice: 85,
    hasVariants: true,
    hasColors: true,
    mainImage: "/lux-1.png",
    colors: [
      {
        colorName: "Rose Pink",
        colorCode: "#FFC0CB",
        images: ["/lux-1.png", "/lux-2.png", "/lux-3.png", "/lux-4.png"],
        variants: [
          { id: "v1-p-1", name: "100g Pack", price: 85, stock: 15 },
          { id: "v1-p-2", name: "150g Combo", price: 120, stock: 8 },
        ],
      },
      {
        colorName: "Velvet White",
        colorCode: "#FFFFFF",
        images: ["/lux-5.png", "/lux-6.png", "/lux-7.png", "/lux-8.png"],
        variants: [
          { id: "v1-w-1", name: "100g Pack", price: 85, stock: 20 },
          { id: "v1-w-2", name: "150g Combo", price: 120, stock: 0 },
        ],
      },
      {
        colorName: "Orchid Purple",
        colorCode: "#DA70D6",
        images: ["/lux-9.png", "/lux-10.png", "/lux-11.png", "/lux-12.png"],
        variants: [
          { id: "v1-pr-1", name: "100g Pack", price: 90, stock: 5 },
          { id: "v1-pr-2", name: "150g Combo", price: 130, stock: 12 },
        ],
      },
    ],
  },

  // ২. কালার ছাড়া কেজি/গ্রাম ভ্যারিয়েন্ট + ১টি মাত্র ছবি (Grocery Item)
  {
    id: 2,
    name: "Premium Miniket Rice",
    category: "Grocery",
    basePrice: 350,
    hasVariants: true,
    hasColors: false,
    mainImage: "/lux-1.png", // ১টি মাত্র ছবি (নিচে থাম্বনেইল থাকবে না)
    variants: [
      { id: "v2-1", name: "5 Kg Bag", price: 350, stock: 10 },
      { id: "v2-2", name: "10 Kg Bag", price: 680, stock: 4 },
      { id: "v2-3", name: "25 Kg Sack", price: 1650, stock: 2 },
    ],
  },

  // ৩. একদম সিম্পল প্রোডাক্ট - ১টি মাত্র ছবি, কোনো ভ্যারিয়েন্ট নেই (Single Image & Single Stock)
  {
    id: 3,
    name: "Diecast Miniature Car",
    category: "Vehicles",
    basePrice: 1500,
    hasVariants: false,
    hasColors: false,
    totalStock: 3,
    mainImage: "/car.png", // ১টি মাত্র ছবি
  },
];