import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { OrderDetails } from '../types/store';
import {
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Banknote,
  PackageCheck,
  FileSpreadsheet,
  ExternalLink,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';

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

  const {
    isConnected,
    spreadsheet,
    nextOrderId,
    getNextOrderId,
    syncOrder,
    login,
  } = useGoogleSheets();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>(initialStep);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [syncStatusText, setSyncStatusText] = useState<string | null>(null);

  // Shipping form state
  const [formData, setFormData] = useState({
    fullName: 'Khizar Rahman',
    email: 'khizar.tech@example.com',
    phone: '+1 (555) 892-4912',
    address: '100 Silicon Way, Suite 400',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [createdOrder, setCreatedOrder] = useState<OrderDetails | null>(null);

  const estimatedTax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const shippingFee = cartSubtotal > 50 || cartSubtotal === 0 ? 0 : 9.99;
  const finalTotal = Math.max(
    0,
    Math.round((cartSubtotal - discountAmount + estimatedTax + shippingFee) * 100) / 100
  );

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.email) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    try {
      // 1. Calculate sequential Order ID based on Google Sheets Sheet1 rows (e.g. 1001, 1002, 1007...)
      const assignedNumericId = await getNextOrderId();
      const formattedOrderId = String(assignedNumericId);

      const newOrder: OrderDetails = {
        orderId: formattedOrderId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        items: [...cart],
        subtotal: cartSubtotal,
        shipping: shippingFee,
        tax: estimatedTax,
        discount: discountAmount,
        total: finalTotal,
        shippingAddress: formData,
        paymentMethod,
        status: 'Order Placed',
        estimatedDelivery: '3 - 4 Business Days via Air Express',
      };

      createOrder(newOrder);
      setCreatedOrder(newOrder);

      // 2. Automatically sync to Google Sheets (Tech Store Orders -> Sheet1)
      const syncResult = await syncOrder(newOrder, assignedNumericId);
      setSyncStatusText(syncResult.message);

      setStep('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Order placement error:', err);
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

      {/* Checkout Progress Stepper in Fresh Blue */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="w-full absolute top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

          {/* Step 1: Shipping */}
          <div className="relative z-10 flex flex-col items-center gap-1 bg-slate-50 px-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                step === 'shipping'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              1
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Shipping</span>
          </div>

          {/* Step 2: Payment */}
          <div className="relative z-10 flex flex-col items-center gap-1 bg-slate-50 px-3">
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
            <span className="text-[11px] font-semibold text-slate-700">Payment</span>
          </div>

          {/* Step 3: Confirmation */}
          <div className="relative z-10 flex flex-col items-center gap-1 bg-slate-50 px-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                step === 'confirmation'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              3
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Step 1: Shipping Information */}
      {step === 'shipping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Shipping Destination & Contact
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All Khizar Tech shipments are insured and require recipient signature upon air delivery.
              </p>
            </div>

            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone Number (for Courier SMS updates) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Postal / Zip Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Australia">Australia</option>
                  </select>
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
                  <span>Continue to Payment</span>
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

      {/* Step 2: Payment Method */}
      {step === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Select Payment Method
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Encrypted 256-bit secure transaction. Choose Credit Card, Apple Pay, or Cash on Delivery.
              </p>
            </div>

            {/* Payment Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                  <div className="text-[10px] text-slate-500">Visa, Mastercard, Amex</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  paymentMethod === 'apple_pay'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900"> Pay</span>
                  {paymentMethod === 'apple_pay' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Apple / Google Pay</div>
                  <div className="text-[10px] text-slate-500">1-Touch Biometric checkout</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                  <div className="text-[10px] text-slate-500">Pay upon physical delivery</div>
                </div>
              </button>
            </div>

            {/* Payment Details Form */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">CVC Code</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Shipping</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Authorize & Place Order (${finalTotal})</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-center">
                <p className="text-xs text-slate-600">
                  Ready to authorize payment using Apple Pay or Google Pay with Touch ID / Face ID.
                </p>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full max-w-sm mx-auto py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pay ${finalTotal} with  Pay</span>
                </button>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-6 bg-blue-50/60 border border-blue-100 rounded-xl space-y-4">
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Cash on Delivery Terms:</div>
                  <p className="text-slate-600">
                    You will pay the exact total of <strong className="text-blue-600 font-mono">${finalTotal}</strong> directly to the courier upon physical parcel delivery.
                  </p>
                </div>

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
                    onClick={handlePlaceOrder}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Confirm Order with COD (${finalTotal})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Delivering To</h3>
            <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900">{formData.fullName}</div>
              <div>{formData.address}</div>
              <div>{formData.city}, {formData.postalCode}</div>
              <div>{formData.country}</div>
              <div className="text-blue-600 pt-1 font-mono">{formData.phone}</div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900 font-semibold tabular-nums">${cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Air Express Shipping</span>
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

      {/* Step 3: Confirmation Screen */}
      {step === 'confirmation' && createdOrder && (
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase font-mono tracking-widest text-blue-600 font-semibold">
              Khizar Tech Store · Dispatch Confirmed
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your hardware order has been verified in the dispatch facility. A confirmation receipt has been sent to <strong className="text-slate-800">{createdOrder.shippingAddress.email}</strong>.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-200 pb-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Order Number</span>
                <span className="font-bold text-blue-600 font-mono text-sm">{createdOrder.orderId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Date</span>
                <span className="text-slate-800 font-medium">{createdOrder.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Total Paid</span>
                <span className="font-bold text-slate-900 font-mono text-sm">${createdOrder.total}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Payment</span>
                <span className="text-slate-800 uppercase text-xs font-semibold">{createdOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Purchased Hardware</span>
              {createdOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-slate-700">
                  <span className="truncate max-w-xs">{item.product.name} × {item.quantity}</span>
                  <span className="font-mono text-slate-900 font-bold">${item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Sheets Sync Status Notification */}
          <div className="p-4 rounded-xl border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 border-emerald-200 text-emerald-950 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <span>Google Sheets Sync Active</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-800">
                    Sheet1
                  </span>
                </div>
                <div className="text-[11px] text-emerald-700">
                  {syncStatusText || `Appended to 'Tech Store Orders' with Order ID #${createdOrder.orderId}`}
                </div>
              </div>
            </div>

            {spreadsheet?.url ? (
              <a
                href={spreadsheet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
              >
                <span>View in Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo({ name: 'sheets' })}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-2xs cursor-pointer"
              >
                <span>Manage Sheets Pipeline</span>
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo({ name: 'track', orderId: createdOrder.orderId })}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <PackageCheck className="w-4 h-4 text-white" />
              <span>Track Live Order Progress</span>
            </button>
            <button
              onClick={() => navigateTo({ name: 'sheets' })}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Google Sheets Dashboard</span>
            </button>
            <button
              onClick={() => navigateTo({ name: 'home' })}
              className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
