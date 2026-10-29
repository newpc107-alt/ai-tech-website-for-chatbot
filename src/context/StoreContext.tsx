import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, OrderDetails, PageRoute, Product } from '../types/store';
import { PRODUCTS } from '../data/products';

interface StoreContextType {
  route: PageRoute;
  navigateTo: (newRoute: PageRoute) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOptions?: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  orders: OrderDetails[];
  createOrder: (order: OrderDetails) => void;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string; discountPercent?: number };
  discountAmount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial demo order for immediate tracking demonstration
const INITIAL_DEMO_ORDER: OrderDetails = {
  orderId: 'ORD-84920',
  date: 'October 27, 2026',
  items: [
    {
      id: 'volt-140w-gan-station-Space Gray Aluminum',
      product: PRODUCTS.find((p) => p.id === 'volt-140w-gan-station') || PRODUCTS[0],
      quantity: 1,
      selectedOptions: { Finish: 'Space Gray Aluminum', 'Wattage Output': '140W GaN Station' },
    },
    {
      id: 'nexus-240w-thunderbolt4-2.0m',
      product: PRODUCTS.find((p) => p.id === 'nexus-240w-thunderbolt4') || PRODUCTS[1],
      quantity: 2,
      selectedOptions: { Length: '2.0 Meters (6.6ft)', Color: 'Space Titanium Weave' },
    },
  ],
  subtotal: 197,
  shipping: 0,
  tax: 15.76,
  discount: 19.7,
  total: 193.06,
  shippingAddress: {
    fullName: 'Khizar Rahman',
    email: 'khizar.tech@example.com',
    phone: '+1 (555) 892-4912',
    address: '100 Silicon Way, Suite 400',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
  },
  paymentMethod: 'card',
  status: 'Processing & Quality Check',
  estimatedDelivery: 'Oct 30 - Nov 01, 2026',
};

// Parse URL hash to route
function parseHash(hash: string): PageRoute {
  const clean = hash.replace(/^#\/?/, '');
  if (!clean) return { name: 'home' };

  const parts = clean.split('/');
  const section = parts[0];

  if (section === 'category' && parts[1]) {
    return { name: 'category', categoryId: parts[1] as any, subcategory: parts[2] ? decodeURIComponent(parts[2]) : undefined };
  }
  if (section === 'product' && parts[1]) {
    return { name: 'product', productId: parts[1] };
  }
  if (section === 'accessories') {
    return { name: 'accessories', subcategory: parts[1] ? decodeURIComponent(parts[1]) : undefined };
  }
  if (section === 'cart') {
    return { name: 'cart' };
  }
  if (section === 'checkout') {
    const step = (parts[1] as any) || 'shipping';
    return { name: 'checkout', step };
  }
  if (section === 'track') {
    return { name: 'track', orderId: parts[1] };
  }
  if (section === 'deals') {
    return { name: 'deals' };
  }
  if (section === 'about') {
    return { name: 'about' };
  }
  if (section === 'sheets') {
    return { name: 'sheets' };
  }

  return { name: 'home' };
}

// Convert route to hash string
function routeToHash(route: PageRoute): string {
  switch (route.name) {
    case 'home':
      return '';
    case 'category':
      return route.subcategory ? `category/${route.categoryId}/${encodeURIComponent(route.subcategory)}` : `category/${route.categoryId}`;
    case 'accessories':
      return route.subcategory ? `accessories/${encodeURIComponent(route.subcategory)}` : 'accessories';
    case 'product':
      return `product/${route.productId}`;
    case 'cart':
      return 'cart';
    case 'checkout':
      return `checkout/${route.step}`;
    case 'track':
      return route.orderId ? `track/${route.orderId}` : 'track';
    case 'deals':
      return 'deals';
    case 'about':
      return 'about';
    case 'sheets':
      return 'sheets';
    default:
      return '';
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<PageRoute>(() => parseHash(window.location.hash));
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_wishlist');
      return saved ? JSON.parse(saved) : ['aura-ii-earbuds', 'volt-140w-gan-station'];
    } catch {
      return ['aura-ii-earbuds', 'volt-140w-gan-station'];
    }
  });
  const [orders, setOrders] = useState<OrderDetails[]>([INITIAL_DEMO_ORDER]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Sync hash changes from browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kinetic_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kinetic_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const navigateTo = (newRoute: PageRoute) => {
    const hash = routeToHash(newRoute);
    window.location.hash = hash ? `#${hash}` : '#';
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1, selectedOptions: Record<string, string> = {}) => {
    // Generate default options if none selected
    const defaultedOptions: Record<string, string> = { ...selectedOptions };
    if (product.options) {
      product.options.forEach((opt) => {
        if (!defaultedOptions[opt.name] && opt.values.length > 0) {
          defaultedOptions[opt.name] = opt.values[0];
        }
      });
    }

    const optionsKey = Object.entries(defaultedOptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    const cartItemId = `${product.id}-${optionsKey || 'default'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity,
          selectedOptions: defaultedOptions,
        },
      ];
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const createOrder = (order: OrderDetails) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
    setAppliedPromo(null);
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KHIZAR10' || clean === 'KINETIC10' || clean === 'PORTFOLIO') {
      setAppliedPromo(clean);
      return { success: true, message: '10% Khizar Tech portfolio discount applied!', discountPercent: 10 };
    }
    if (clean === 'KHIZAR20' || clean === 'FIRST20') {
      setAppliedPromo(clean);
      return { success: true, message: '20% Khizar VIP welcome discount applied!', discountPercent: 20 };
    }
    return { success: false, message: 'Invalid discount code. Try "KHIZAR10"' };
  };

  const discountRate = (appliedPromo === 'KHIZAR20' || appliedPromo === 'FIRST20') ? 0.2 : appliedPromo ? 0.1 : 0;
  const discountAmount = Math.round(cartSubtotal * discountRate);

  return (
    <StoreContext.Provider
      value={{
        route,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        createOrder,
        appliedPromo,
        applyPromo,
        discountAmount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
