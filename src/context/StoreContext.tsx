import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, OrderDetails, PageRoute, Product } from '../types/store';
import { PRODUCTS } from '../data/products';

interface StoreContextType {
  route: PageRoute;
  navigateTo: (newRoute: PageRoute) => void;
  routeToPath: (route: PageRoute) => string;
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

// Initial demo order for customer reference
const INITIAL_DEMO_ORDER: OrderDetails = {
  date: 'October 27, 2026',
  items: [
    {
      id: 'volt-140w-gan-station-Space Gray Aluminum',
      product: PRODUCTS.find((p) => p.id === 'volt-140w-gan-station') || PRODUCTS[0],
      quantity: 1,
      selectedOptions: { Edition: 'Anodized Slate & Brass', 'Wattage Output': '140W GaN Station' },
    },
    {
      id: 'nexus-240w-thunderbolt4-2.0m',
      product: PRODUCTS.find((p) => p.id === 'nexus-240w-thunderbolt4') || PRODUCTS[1],
      quantity: 2,
      selectedOptions: { Length: '2.0 Meters (6.6ft)', Edition: 'Space Titanium Weave' },
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
  paymentMethod: 'cod',
  status: 'Order Placed',
  estimatedDelivery: '3 - 4 Business Days',
};

// Convert route to real descriptive URL path
export function routeToPath(route: PageRoute): string {
  switch (route.name) {
    case 'home':
      return '/';
    case 'category':
      return route.subcategory
        ? `/categories/${route.categoryId}/${encodeURIComponent(route.subcategory)}`
        : `/categories/${route.categoryId}`;
    case 'accessories':
      return route.subcategory
        ? `/accessories/${encodeURIComponent(route.subcategory)}`
        : '/accessories';
    case 'product':
      return `/products/${route.productId}`;
    case 'cart':
      return '/cart';
    case 'checkout':
      return route.step && route.step !== 'shipping' ? `/checkout/${route.step}` : '/checkout';
    case 'deals':
      return '/deals';
    case 'about':
      return '/about';
    default:
      return '/';
  }
}

// Parse pathname and any legacy hash into a strongly typed PageRoute
export function parseLocation(): PageRoute {
  if (typeof window === 'undefined') return { name: 'home' };

  // 1. First gracefully inspect legacy hash URLs (e.g. #/products/..., #category/..., #product/...)
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) {
    const hashParts = hash.split('/').filter(Boolean);
    const hashSection = hashParts[0];
    if ((hashSection === 'category' || hashSection === 'categories') && hashParts[1]) {
      return {
        name: 'category',
        categoryId: hashParts[1] as any,
        subcategory: hashParts[2] ? decodeURIComponent(hashParts[2]) : undefined,
      };
    }
    if ((hashSection === 'product' || hashSection === 'products') && hashParts[1]) {
      return { name: 'product', productId: hashParts[1] };
    }
    if (hashSection === 'accessories') {
      return { name: 'accessories', subcategory: hashParts[1] ? decodeURIComponent(hashParts[1]) : undefined };
    }
    if (hashSection === 'cart') return { name: 'cart' };
    if (hashSection === 'checkout') {
      const step = (hashParts[1] as any) || 'shipping';
      return { name: 'checkout', step };
    }
    if (hashSection === 'deals') return { name: 'deals' };
    if (hashSection === 'about') return { name: 'about' };
  }

  // 2. Parse standard HTML5 pathname
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!path) return { name: 'home' };

  const parts = path.split('/');
  const section = parts[0];

  // /categories/:categoryId or legacy /category/:categoryId
  if ((section === 'categories' || section === 'category') && parts[1]) {
    return {
      name: 'category',
      categoryId: parts[1] as any,
      subcategory: parts[2] ? decodeURIComponent(parts[2]) : undefined,
    };
  }

  // /products/:productId or legacy /product/:productId
  if ((section === 'products' || section === 'product') && parts[1]) {
    return { name: 'product', productId: parts[1] };
  }

  // /accessories or /accessories/:subcategory
  if (section === 'accessories') {
    return {
      name: 'accessories',
      subcategory: parts[1] ? decodeURIComponent(parts[1]) : undefined,
    };
  }

  if (section === 'cart') {
    return { name: 'cart' };
  }

  if (section === 'checkout') {
    const step = (parts[1] as any) || 'shipping';
    return { name: 'checkout', step };
  }

  if (section === 'deals') {
    return { name: 'deals' };
  }

  if (section === 'about') {
    return { name: 'about' };
  }

  return { name: 'home' };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<PageRoute>(() => {
    const initial = parseLocation();
    // If user arrived with a legacy hash URL, normalize browser address bar to clean real URL path
    if (typeof window !== 'undefined' && window.location.hash) {
      const cleanPath = routeToPath(initial);
      window.history.replaceState(null, '', cleanPath);
    }
    return initial;
  });

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

  // Sync route on browser back and forward button clicks
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
    const targetPath = routeToPath(newRoute);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
      setRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        routeToPath,
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
