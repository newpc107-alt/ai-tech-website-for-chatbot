import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderDetails } from '../types/store';
import { Search, PackageCheck, Clock, MapPin } from 'lucide-react';

export const TrackOrderPage: React.FC<{ initialOrderId?: string }> = ({ initialOrderId }) => {
  const { orders, navigateTo } = useStore();
  const [searchId, setSearchId] = useState(initialOrderId || (orders.length > 0 ? orders[0].orderId : 'ORD-84920'));
  const [searchedOrder, setSearchedOrder] = useState<OrderDetails | undefined>(() => {
    return orders.find((o) => o.orderId.toLowerCase() === (initialOrderId || 'ORD-84920').toLowerCase()) || orders[0];
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) => o.orderId.trim().toLowerCase() === searchId.trim().toLowerCase()
    );
    setSearchedOrder(found);
  };

  const stages = [
    { title: 'Order Placed', desc: 'Hardware order verified and logged into Khizar Tech dispatch queue' },
    { title: 'Processing & Quality Check', desc: 'GaN semiconductor voltage calibration & acoustic frequency check' },
    { title: 'Dispatched via Express', desc: 'Departed central international sorting hub via Air Courier' },
    { title: 'Out for Delivery', desc: 'Assigned to local courier vehicle for final delivery' },
    { title: 'Delivered', desc: 'Signed receipt at customer destination' },
  ];

  const getStageIndex = (status: string) => {
    if (status === 'Order Placed') return 0;
    if (status === 'Processing & Quality Check') return 1;
    if (status === 'Dispatched via Express') return 2;
    if (status === 'Out for Delivery') return 3;
    if (status === 'Delivered') return 4;
    return 1;
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.status) : 1;

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
        <span className="text-slate-900 font-semibold">Order Logistics & Tracking</span>
      </nav>

      {/* Sub-page Header in Fresh Blue */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl space-y-3 z-10 relative">
          <div className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-mono">
            Khizar Tech Store · Real-Time Telemetry
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Live Hardware Dispatch Tracker
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            Enter your order reference number to view real-time quality check progress, air courier status, and estimated destination arrival.
          </p>
        </div>
      </div>

      {/* Lookup Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. ORD-84920)"
              className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-mono uppercase focus:outline-hidden focus:border-blue-500 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Track
          </button>
        </form>

        {/* Quick order presets */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 justify-center">
            <span>Available Demo Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.orderId}
                onClick={() => {
                  setSearchId(o.orderId);
                  setSearchedOrder(o);
                }}
                className="font-mono text-blue-600 hover:text-blue-800 underline cursor-pointer font-semibold"
              >
                {o.orderId}
              </button>
            ))}
          </div>
        )}
      </div>

      {searchedOrder ? (
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xs">
          {/* Status summary banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-600 font-semibold">
                Tracking ID: {searchedOrder.orderId}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {searchedOrder.status}
              </h2>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Estimated Arrival: <strong className="text-slate-800">{searchedOrder.estimatedDelivery}</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Carrier Service</span>
              <div className="text-sm font-semibold text-slate-800">Khizar Air Cargo #KNTK-992</div>
              <div className="text-xs text-slate-500">Express Priority Air</div>
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Dispatch Milestones
            </h3>

            <div className="relative pl-6 space-y-8 border-l-2 border-slate-200 ml-2">
              {stages.map((st, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={st.title} className="relative">
                    {/* Stage icon circle */}
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 border border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div>
                      <div
                        className={`text-sm font-bold ${
                          isCurrent ? 'text-blue-600' : isPassed ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {st.title}
                        {isCurrent && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-50 text-blue-700 rounded border border-blue-200">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Destination & Order Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
            {/* Left: Destination */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Delivery Address</span>
              </div>
              <div className="text-slate-600">
                <div className="font-bold text-slate-900">{searchedOrder.shippingAddress.fullName}</div>
                <div>{searchedOrder.shippingAddress.address}</div>
                <div>{searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.postalCode}</div>
                <div>{searchedOrder.shippingAddress.country}</div>
                <div className="text-blue-600 font-mono mt-1">{searchedOrder.shippingAddress.phone}</div>
              </div>
            </div>

            {/* Right: Package contents */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <PackageCheck className="w-4 h-4 text-blue-600" />
                <span>Package Inventory ({searchedOrder.items.length} unique items)</span>
              </div>
              <div className="space-y-1.5 divide-y divide-slate-200 pt-1">
                {searchedOrder.items.map((it) => (
                  <div key={it.id} className="pt-1.5 flex justify-between text-slate-700">
                    <span className="truncate pr-2 font-medium">{it.product.name} × {it.quantity}</span>
                    <span className="font-mono text-slate-900 font-bold">${it.product.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl max-w-xl mx-auto space-y-2 bg-white">
          <p className="text-xs text-slate-500">No order found matching ID &quot;{searchId}&quot;</p>
          <button
            onClick={() => setSearchId('ORD-84920')}
            className="text-xs text-blue-600 underline font-mono font-semibold"
          >
            Load Demo Order ORD-84920
          </button>
        </div>
      )}
    </div>
  );
};
