import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, Menu, X, ArrowRight, Table } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export const Navbar: React.FC = () => {
  const {
    route,
    navigateTo,
    cartCount,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setIsProductTableModalOpen,
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrentCategory = (catId: string) =>
    route.name === 'category' && route.categoryId === catId;

  return (
    <>
      {/* Top Bar: Clean White/Blue Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Professional Redesigned Khizar Tech Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'home' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-left group cursor-pointer text-inherit no-underline select-none"
            >
              {/* Ultra-Professional Hexagonal Monogram Emblem Mark */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-blue-600 to-indigo-700 p-[2px] shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
                  {/* Subtle circuit grid background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:5px_5px] opacity-30" />
                  
                  {/* Custom High-Precision Geometric "K" Icon */}
                  <svg className="w-6 h-6 relative z-10 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Vertical Stem */}
                    <path d="M7 6C7 5.44772 7.44772 5 8 5H11.5C12.0523 5 12.5 5.44772 12.5 6V26C12.5 26.5523 12.0523 27 11.5 27H8C7.44772 27 7 26.5523 7 26V6Z" fill="url(#k-stem-grad)" />
                    {/* Upper Diagonal Arm */}
                    <path d="M12.5 16.5L21.8 7.2C22.2 6.8 22.8 6.8 23.2 7.2L25.3 9.3C25.7 9.7 25.7 10.3 25.3 10.7L16.2 19.8L12.5 16.5Z" fill="url(#k-arm-up)" />
                    {/* Lower Diagonal Arm */}
                    <path d="M15.5 18.2L23.5 26.2C23.9 26.6 24.5 26.6 24.9 26.2L27 24.1C27.4 23.7 27.4 23.1 27 22.7L18.8 14.5L15.5 18.2Z" fill="url(#k-arm-down)" />
                    {/* Core Laser Node */}
                    <circle cx="15.5" cy="17.5" r="2" fill="#34d399" />
                    <defs>
                      <linearGradient id="k-stem-grad" x1="7" y1="5" x2="12.5" y2="27" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#60a5fa" />
                        <stop offset="1" stopColor="#2563eb" />
                      </linearGradient>
                      <linearGradient id="k-arm-up" x1="12.5" y1="7" x2="25.5" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38bdf8" />
                        <stop offset="1" stopColor="#34d399" />
                      </linearGradient>
                      <linearGradient id="k-arm-down" x1="15.5" y1="14.5" x2="27" y2="26.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#818cf8" />
                        <stop offset="1" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Modern Architectural Typography with Verified Hardware Labs Tag */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors font-display">
                    KHIZAR
                  </span>
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent font-display">
                    TECH
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest bg-slate-900 text-emerald-400 font-mono border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                    PRO LABS 2026
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Zone 2: 5 Concise Single-Line Navigation Links (Audio & Chargers first!) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="/categories/audio"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'category', categoryId: 'audio' });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 text-inherit no-underline ${
                isCurrentCategory('audio') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              AirPods & Audio
            </a>
            <a
              href="/categories/chargers"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'category', categoryId: 'chargers' });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 text-inherit no-underline ${
                isCurrentCategory('chargers') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Chargers & Power
            </a>
            <a
              href="/categories/cables"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'category', categoryId: 'cables' });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 text-inherit no-underline ${
                isCurrentCategory('cables') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Cables
            </a>
            <a
              href="/accessories"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'accessories' });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 text-inherit no-underline ${
                route.name === 'accessories' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Accessories Hub
            </a>
            <a
              href="/deals"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'deals' });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 text-inherit no-underline ${
                route.name === 'deals' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Bundles & Deals
            </a>
            <a
              href="/categories/smartphones"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'category', categoryId: 'smartphones' });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 text-inherit no-underline ${
                isCurrentCategory('smartphones') ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent'
              }`}
            >
              Mobiles
            </a>
          </nav>

          {/* Zone 3: Search + Shopping Bag + Editions Table */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsProductTableModalOpen(true)}
              aria-label="Open Product Catalog & Editions Table"
              title="View Product Code, Name, Price & Editions Table (for Spreadsheet)"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-blue-600" />
              <span>Editions Table</span>
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
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'home' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100 text-inherit no-underline"
              >
                <span>Storefront Home</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo({ name: 'category', categoryId: cat.id });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100 text-inherit no-underline"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              ))}
              <a
                href="/accessories"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'accessories' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100 font-semibold text-inherit no-underline"
              >
                <span>Complete Accessories Hub</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="/deals"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'deals' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 border-b border-slate-100 text-inherit no-underline"
              >
                <span>Hardware Bundles & Deals</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'about' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 text-sm text-slate-700 hover:text-blue-600 text-inherit no-underline"
              >
                <span>Engineering & Craftsmanship</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
