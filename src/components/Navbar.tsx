import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { ShoppingBag, Search, Menu, X, ArrowRight, ShieldCheck, Truck, FileSpreadsheet } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export const Navbar: React.FC = () => {
  const { route, navigateTo, cartCount, setIsCartDrawerOpen, setIsSearchOpen } = useStore();
  const { isConnected, nextOrderId } = useGoogleSheets();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrentCategory = (catId: string) =>
    route.name === 'category' && route.categoryId === catId;

  return (
    <>
      {/* Fresh Blue Top Announcement Strip */}
      <aside aria-label="Announcement" className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-blue-100 py-1.5 px-4 text-center border-b border-blue-950 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="hidden sm:flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-blue-100 font-medium">Khizar Tech 2-Year Full Hardware Warranty</span>
          </div>
          <p className="mx-auto sm:mx-0 flex items-center gap-2 text-white font-medium">
            <Truck className="w-3.5 h-3.5 text-sky-300" />
            <span>Complimentary Express Air Delivery over $50</span>
            <span className="hidden md:inline text-blue-300">· Use code <strong>KHIZAR10</strong> for 10% off</span>
          </p>
          <div className="hidden sm:flex items-center gap-4 text-blue-200">
            <button
              onClick={() => navigateTo({ name: 'sheets' })}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-sky-300 font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Sheets Sync</span>
              {isConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
            <span aria-hidden="true" className="text-blue-700">|</span>
            <button
              onClick={() => navigateTo({ name: 'track' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span aria-hidden="true" className="text-blue-700">|</span>
            <button
              onClick={() => navigateTo({ name: 'about' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Engineering
            </button>
          </div>
        </div>
      </aside>

      {/* Top Bar: Clean White/Blue Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Brand Wordmark with Khizar's Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                navigateTo({ name: 'home' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm tracking-tighter shadow-sm group-hover:from-blue-700 group-hover:to-indigo-700 transition-colors">
                KT
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 uppercase font-display whitespace-nowrap leading-none group-hover:text-blue-600 transition-colors">
                  Khizar Tech
                </span>
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest font-mono">
                  Store
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 5 Concise Single-Line Navigation Links (Audio & Chargers first!) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigateTo({ name: 'category', categoryId: 'audio' })}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
                isCurrentCategory('audio') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              AirPods & Audio
            </button>
            <button
              onClick={() => navigateTo({ name: 'category', categoryId: 'chargers' })}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
                isCurrentCategory('chargers') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Chargers & Power
            </button>
            <button
              onClick={() => navigateTo({ name: 'category', categoryId: 'cables' })}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
                isCurrentCategory('cables') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Cables
            </button>
            <button
              onClick={() => navigateTo({ name: 'accessories' })}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
                route.name === 'accessories' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Accessories Hub
            </button>
            <button
              onClick={() => navigateTo({ name: 'deals' })}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
                route.name === 'deals' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Bundles & Deals
            </button>
            <button
              onClick={() => navigateTo({ name: 'category', categoryId: 'smartphones' })}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
                isCurrentCategory('smartphones') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Mobiles
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Search Trigger + Google Sheets Hook */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigateTo({ name: 'sheets' })}
              title="Google Sheets: Tech Store Orders pipeline"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="hidden xl:inline">Tech Store Orders</span>
              {isConnected && (
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-200/50 px-1 py-0.2 rounded">
                  #{nextOrderId}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search catalog"
              className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Bag</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-white text-blue-700 rounded text-[10px] tabular-nums font-mono font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Browse Sub-Pages
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  navigateTo({ name: 'home' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100"
              >
                <span>Storefront Home</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigateTo({ name: 'category', categoryId: cat.id });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
              <button
                onClick={() => {
                  navigateTo({ name: 'accessories' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100 font-semibold"
              >
                <span>Complete Accessories Hub</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  navigateTo({ name: 'deals' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100"
              >
                <span>Hardware Bundles & Deals</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  navigateTo({ name: 'track' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100"
              >
                <span>Track an Existing Order</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  navigateTo({ name: 'sheets' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-emerald-800 hover:text-emerald-900 border-b border-slate-100 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Google Sheets (Tech Store Orders)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  navigateTo({ name: 'about' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600"
              >
                <span>Engineering & Craftsmanship</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
