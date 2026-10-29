import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, Check } from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    navigateTo,
    appliedPromo,
    applyPromo,
    discountAmount,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoFeedback(res);
  };

  const estimatedTax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const shippingFee = cartSubtotal > 50 || cartSubtotal === 0 ? 0 : 9.99;
  const finalTotal = Math.max(0, Math.round((cartSubtotal - discountAmount + estimatedTax + shippingFee) * 100) / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => navigateTo({ name: 'home' })}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Shopping Bag & Review</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-blue-600 font-semibold font-mono mb-1">
            Khizar Tech Store · Order Review
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">
            Your Shopping Bag
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-slate-500 hover:text-red-500 transition-colors cursor-pointer self-start sm:self-auto font-medium"
          >
            Clear All Items
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-2xl max-w-2xl mx-auto p-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your shopping bag is currently empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated catalog of custom AirPods, GaN chargers, 240W cables, and sleek accessories.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo({ name: 'category', categoryId: 'audio' })}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-md transition-colors cursor-pointer"
            >
              AirPods & Audio
            </button>
            <button
              onClick={() => navigateTo({ name: 'accessories' })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              Explore Accessories Hub
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                        <ProductVisual
                          productId={item.product.id}
                          imageSrc={item.product.image}
                          name={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-semibold text-blue-600 font-mono">
                          {item.product.subcategory}
                        </span>
                        <h3
                          onClick={() => navigateTo({ name: 'product', productId: item.product.id })}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {item.product.name}
                        </h3>

                        {/* Selected Options */}
                        {Object.keys(item.selectedOptions).length > 0 && (
                          <div className="text-xs text-slate-500 mt-1">
                            {Object.entries(item.selectedOptions)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' · ')}
                          </div>
                        )}

                        <div className="text-xs text-slate-500 font-mono mt-1">
                          Unit price: ${item.product.price}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls and price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                          ${item.product.price * item.quantity}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Warranty & Free Shipping Callout */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">Khizar Tech 2-year warranty and free 30-day returns included on all gear</span>
              </div>
              <button
                onClick={() => navigateTo({ name: 'accessories' })}
                className="text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
              >
                + Add accessories
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. KHIZAR10)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 uppercase focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded-md transition-colors cursor-pointer shadow-2xs"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p
                    className={`text-[11px] ${
                      promoFeedback.success ? 'text-emerald-600 font-medium' : 'text-red-500'
                    }`}
                  >
                    {promoFeedback.message}
                  </p>
                )}
                {appliedPromo && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Coupon {appliedPromo} applied (-${discountAmount})</span>
                  </div>
                )}
              </form>

              {/* Calculation Table */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-mono text-slate-900 font-semibold tabular-nums">${cartSubtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Promotional Discount</span>
                    <span className="font-mono tabular-nums">-${discountAmount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span>Express Air Shipping</span>
                  <span className="font-mono text-emerald-600 font-semibold tabular-nums">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-slate-900 tabular-nums">${estimatedTax}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-blue-600 font-mono text-xl tabular-nums">
                    ${finalTotal}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigateTo({ name: 'checkout', step: 'shipping' })}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="text-[11px] text-center text-slate-400">
                Cash on Delivery (COD) only · Pay upon physical delivery to courier
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
