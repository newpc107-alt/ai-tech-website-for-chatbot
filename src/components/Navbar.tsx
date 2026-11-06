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
          {/* Zone 1: Upgraded High-Tech Brand Logo & Modern Typography */}
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
              {/* Modern Tech Emblem Mark */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-[1.5px] shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px] opacity-25" />
                  <svg className="w-5 h-5 text-cyan-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4v16" />
                    <path d="M4 12l8-8" />
                    <path d="M8 8l10 12" />
                    <circle cx="18" cy="6" r="2" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>

              {/* Modern Sophisticated Typography */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors font-display">
                    KHIZAR
                  </span>
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent font-display">
                    TECH
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.28em] font-mono leading-none">
                    STORE
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
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
