export type CategoryId = 'audio' | 'smartphones' | 'chargers' | 'cables' | 'protection' | 'stands';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  subcategories: string[];
  featuredImage: string;
}

export interface ProductVariantOptions {
  name: string; // e.g. "Color", "Length", "Wattage", "Storage"
  values: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: CategoryId;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  tag?: string; // e.g. "Best Seller", "New Arrival", "Flagship"
  description: string;
  keyFeatures: string[];
  specs: Record<string, string>;
  options?: ProductVariantOptions[];
  inStock: boolean;
  stockCount?: number;
  companionProductIds?: string[];
  reviews?: ReviewItem[];
}

export interface CartItem {
  id: string; // unique item id combining product.id and serialized selected options
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export interface OrderDetails {
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'cod';
  status: 'Order Placed';
  estimatedDelivery: string;
}

export type PageRoute =
  | { name: 'home' }
  | { name: 'category'; categoryId: CategoryId; subcategory?: string }
  | { name: 'accessories'; subcategory?: string }
  | { name: 'product'; productId: string }
  | { name: 'cart' }
  | { name: 'checkout'; step: 'shipping' | 'payment' | 'confirmation'; order?: OrderDetails }
  | { name: 'deals' }
  | { name: 'about' };
