import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderDetails } from '../types/store';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Banknote,
  Home,
  Truck,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import {
  getNextSequentialOrderId,
  commitNextSequentialOrderId,
  sendOrderToWebhook,
  WebhookOrderPayload,
  WEBHOOK_URL,
} from '../services/webhookService';

interface CheckoutPageProps {
  initialStep?: 'shipping' | 'payment' | 'confirmation';
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ initialStep = 'shipping' }) => {
  const {
    cart,
    cartSubtotal,
    cartCount,
    discountAmount,
    createOrder,
    navigateTo,
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>(initialStep);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  // Shipping form state with required customer & address details
  const [formData, setFormData] = useState({
    fullName: 'Khizar Rahman',
    email: 'khizar.tech@example.com',
    phone: '+1 (555) 892-4912',
    address: '100 Silicon Way, Suite 400',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
  });

  const [createdOrder, setCreatedOrder] = useState<OrderDetails | null>(null);

  const estimatedTax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const shippingFee = cartSubtotal > 50 || cartSubtotal === 0 ? 0 : 9.99;
  const finalTotal = Math.max(
    0,
    Math.round((cartSubtotal - discountAmount + estimatedTax + shippingFee) * 100) / 100
  );

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim() ||
      !formData.country.trim()
    ) {
      alert('Please fill out all required shipping and contact fields.');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    setIsPlacingOrder(true);

    try {
      // 1. Calculate sequential numeric Order ID (starts at 1001, then 1002, 1003...)
      const numericOrderId = getNextSequentialOrderId();
      const formattedOrderId = String(numericOrderId);

      // Commit the counter increment so next order will be numericOrderId + 1
      commitNextSequentialOrderId(numericOrderId);

      const orderDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const newOrder: OrderDetails = {
        orderId: formattedOrderId,
        date: orderDate,
        items: [...cart],
        subtotal: cartSubtotal,
        shipping: shippingFee,
        tax: estimatedTax,
        discount: discountAmount,
        total: finalTotal,
        shippingAddress: { ...formData },
        paymentMethod: 'cod',
        status: 'Order Placed',
        estimatedDelivery: '3 - 4 Business Days via Air Express',
      };

      // 2. Build structured webhook payload matching all user required terms
      // Product Name string summary (e.g., "Volt 65W GaN Dual Port Travel Wall Brick, Nexus 240W Thunderbolt 4")
      const productNamesSummary = cart
        .map((item) => (item.quantity > 1 ? `${item.product.name} (x${item.quantity})` : item.product.name))
        .join(', ');

      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

      const webhookPayload: WebhookOrderPayload = {
        // Specific exact keys requested:
        'Order ID': numericOrderId,
        'Customer Name': formData.fullName.trim(),
        'Customer Email': formData.email.trim(),
        'Phone number': formData.phone.trim(),
        'Street address': formData.address.trim(),
        'City': formData.city.trim(),
        'Postal zip code': formData.postalCode.trim(),
        'Country': formData.country.trim(),
        'Product Name': productNamesSummary,
        'Quantity of the Product': totalQuantity,
        'Order Date': orderDate,
        'Price': finalTotal,

        // Standard camelCase equivalents & comprehensive item array for workflows:
        orderId: formattedOrderId,
        customerName: formData.fullName.trim(),
        customerEmail: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        streetAddress: formData.address.trim(),
        city: formData.city.trim(),
        postalZipCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        orderDate,
        totalPrice: finalTotal,
        subtotal: cartSubtotal,
        shipping: shippingFee,
        tax: estimatedTax,
        discount: discountAmount,
        paymentMethod: 'Cash on Delivery',
        status: 'Order Placed',
        items: cart.map((it) => ({
          id: it.product.id,
          productName: it.product.name,
          quantity: it.quantity,
          unitPrice: it.product.price,
          totalPrice: it.product.price * it.quantity,
          selectedOptions: it.selectedOptions || {},
        })),
      };

      // 3. Send POST request to user webhook: http://localhost:5678/webhook-test/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4
      const webhookResponse = await sendOrderToWebhook(webhookPayload);
      setWebhookStatus(webhookResponse.message);

      // 4. Save order to store and clear cart
      createOrder(newOrder);
      setCreatedOrder(newOrder);

      // 5. Complete process to order received screen
      setStep('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error during checkout order placement:', err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // If cart is empty and not on confirmation page, offer return
  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your bag is currently empty</h2>
        <p className="text-xs text-slate-500">
          Add hardware devices or accessories before initiating checkout.
        </p>
        <button
          onClick={() => navigateTo({ name: 'accessories' })}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md cursor-pointer shadow-xs"
        >
          Explore Accessories Hub
        </button>
      </div>
    );
  }

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
        <button
          onClick={() => navigateTo({ name: 'cart' })}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Shopping Bag
        </button>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold capitalize">Checkout: {step}</span>
      </nav>

      {/* Checkout Progress Stepper */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="w-full absolute top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

          {/* Step 1: Shipping */}
          <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                step === 'shipping'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              1
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Delivery Details</span>
          </div>

          {/* Step 2: Payment Review (Cash on Delivery) */}
          <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                step === 'payment'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : step === 'confirmation'
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              2
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Cash on Delivery</span>
          </div>

          {/* Step 3: Order Received */}
          <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                step === 'confirmation'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              3
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Order Received</span>
          </div>
        </div>
      </div>

      {/* Step 1: Shipping Information */}
      {step === 'shipping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Shipping Destination & Contact Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Please provide your accurate contact information and street address for Cash on Delivery courier dispatch.
              </p>
            </div>

            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone number (Required for Delivery Courier SMS/Call) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Street address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 123 Tech Avenue, Apartment 4B"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. San Francisco"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Postal zip code *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="e.g. 94107"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United States"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigateTo({ name: 'cart' })}
                  className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Bag</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Order Summary ({cartCount} items)</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                    <ProductVisual
                      productId={item.product.id}
                      imageSrc={item.product.image}
                      name={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-900 truncate font-semibold">{item.product.name}</div>
                    <div className="text-slate-500 font-mono text-[11px]">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono text-slate-900 tabular-nums font-bold">
                    ${item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900 font-semibold tabular-nums">${cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span className="font-mono tabular-nums">-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Air Shipping</span>
                <span className="font-mono text-emerald-600 font-semibold tabular-nums">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-mono text-slate-900 tabular-nums">${estimatedTax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Due</span>
                <span className="font-mono text-blue-600 text-base tabular-nums">${finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment Method (Cash on Delivery ONLY) */}
      {step === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Payment Method
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                This store exclusively accepts <strong>Cash on Delivery (COD)</strong>. No card details or online upfront payments are required.
              </p>
            </div>

            {/* Exclusive Cash on Delivery Card */}
            <div className="p-6 bg-gradient-to-br from-blue-50/70 to-sky-50/40 border-2 border-blue-500/70 rounded-2xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">Cash on Delivery (COD)</span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Only Available Method
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pay the total amount of <strong className="text-blue-700 font-mono text-sm">${finalTotal}</strong> directly in cash to the delivery courier when your package arrives at your doorstep.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No credit or debit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Inspect package before paying courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Khizar Tech cash invoice included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant webhook notification on order placement</span>
                </div>
              </div>
            </div>

            {/* Delivering details confirmation banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Confirming Shipping Destination:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Recipient</span>
                  <span className="font-semibold text-slate-800">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Phone Number</span>
                  <span className="font-mono text-blue-600">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Delivery Address</span>
                  <span>{formData.address}, {formData.city}, {formData.postalCode}, {formData.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Email Receipt</span>
                  <span>{formData.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Shipping</span>
              </button>

              <button
                type="button"
                disabled={isPlacingOrder}
                onClick={() => handlePlaceOrder()}
                className="px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {isPlacingOrder ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order with Cash on Delivery (${finalTotal})</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Total Due on Delivery</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Cash on Delivery</span>
              <div className="text-3xl font-bold font-mono text-blue-600 tabular-nums">
                ${finalTotal}
              </div>
              <p className="text-[11px] text-slate-500">Payable in cash upon physical arrival</p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-mono text-slate-900 font-semibold tabular-nums">${cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Express Air Shipping</span>
                <span className="font-mono text-emerald-600 font-semibold tabular-nums">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-mono text-slate-900 tabular-nums">${estimatedTax}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Khizar Tech 2-Year Hardware Replacement Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Air courier delivery in 3 to 4 business days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Order Completed (Order Received Screen) */}
      {step === 'confirmation' && createdOrder && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-center shadow-sm">
          {/* Success Checkmark */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <div className="text-xs uppercase font-mono tracking-widest text-blue-600 font-semibold">
              Khizar Tech Store
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display tracking-tight">
              Order Received
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for shopping with Khizar Tech Store. Your order has been placed successfully and will be delivered via <strong>Cash on Delivery</strong>.
            </p>
          </div>

          {/* Clean Order Summary Card */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 text-left space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-200 pb-4">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Order ID</span>
                <span className="font-bold text-blue-600 font-mono text-base">#{createdOrder.orderId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Order Date</span>
                <span className="text-slate-800 font-medium">{createdOrder.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Total Due (Cash)</span>
                <span className="font-bold text-slate-900 font-mono text-base">${createdOrder.total}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Payment</span>
                <span className="text-blue-700 font-semibold text-xs bg-blue-100/70 px-2 py-0.5 rounded">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Recipient & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Customer Name & Phone</span>
                <div className="font-semibold text-slate-800">{createdOrder.shippingAddress.fullName}</div>
                <div className="text-blue-600 font-mono">{createdOrder.shippingAddress.phone}</div>
                <div className="text-slate-500">{createdOrder.shippingAddress.email}</div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Delivery Address</span>
                <div className="text-slate-700">
                  {createdOrder.shippingAddress.address}<br />
                  {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.postalCode}<br />
                  {createdOrder.shippingAddress.country}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Ordered Products</span>
              <div className="space-y-2 divide-y divide-slate-100">
                {createdOrder.items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between items-center text-slate-700">
                    <div className="flex items-center gap-2 min-w-0 pr-4">
                      <Package className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate font-medium">{item.product.name} × {item.quantity}</span>
                    </div>
                    <span className="font-mono text-slate-900 font-bold shrink-0">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Webhook Dispatch Status Note */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-900 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>Webhook Dispatched:</strong> Order #{createdOrder.orderId} data sent to webhook
              </span>
            </div>
            <span className="text-[10px] font-mono text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
              POST 200
            </span>
          </div>

          {/* Action: End process and Back to Home as requested */}
          <div className="pt-2">
            <button
              onClick={() => navigateTo({ name: 'home' })}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Home className="w-4 h-4 text-white" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
