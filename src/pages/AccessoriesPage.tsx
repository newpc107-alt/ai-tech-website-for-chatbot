import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { ArrowUpDown, ShieldCheck, Zap } from 'lucide-react';

export const AccessoriesPage: React.FC<{ initialSubcategory?: string }> = ({ initialSubcategory }) => {
  const { navigateTo } = useStore();

  const [activeTab, setActiveTab] = useState<string>(initialSubcategory || 'All');
  const [compatibility, setCompatibility] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter accessory products (categories: chargers, cables, protection, stands, or audio accessories)
  const accessoryProducts = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        p.category === 'chargers' ||
        p.category === 'cables' ||
        p.category === 'protection' ||
        p.category === 'stands' ||
        p.subcategory === 'Audio Accessories'
    );

    // Filter by tab
    if (activeTab === 'Chargers') {
      list = list.filter((p) => p.category === 'chargers');
    } else if (activeTab === 'Cables') {
      list = list.filter((p) => p.category === 'cables');
    } else if (activeTab === 'Cases & Protection') {
      list = list.filter((p) => p.category === 'protection');
    } else if (activeTab === 'Mounts & Docks') {
      list = list.filter((p) => p.category === 'stands');
    } else if (activeTab === 'Audio Gear') {
      list = list.filter((p) => p.subcategory === 'Audio Accessories' || p.category === 'audio');
    }

    // Filter by compatibility if selected
    if (compatibility === 'apple') {
      list = list.filter((p) =>
        p.description.toLowerCase().includes('apple') ||
        p.description.toLowerCase().includes('iphone') ||
        p.description.toLowerCase().includes('magsafe') ||
        p.name.toLowerCase().includes('lightning') ||
        p.name.toLowerCase().includes('airpods')
      );
    } else if (compatibility === 'usbc') {
      list = list.filter((p) =>
        p.name.toLowerCase().includes('usb-c') ||
        p.name.toLowerCase().includes('type-c') ||
        p.name.toLowerCase().includes('thunderbolt') ||
        p.tagline.toLowerCase().includes('type-c')
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [activeTab, compatibility, sortBy]);

  const tabs = [
    { label: 'All Accessories', id: 'All' },
    { label: 'Chargers & Power', id: 'Chargers' },
    { label: 'Cables & Interconnects', id: 'Cables' },
    { label: 'Cases & Protection', id: 'Cases & Protection' },
    { label: 'Mounts & Workspace Docks', id: 'Mounts & Docks' },
    { label: 'Acoustic Accessories', id: 'Audio Gear' },
  ];

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
        <span className="text-slate-900 font-semibold">Accessories Superstore</span>
      </nav>

      {/* Hero Banner in Fresh Blue/White */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-mono">
            Khizar Tech Store · Accessories Catalog Sub-Page
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Precision Accessories & Power
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            Multi-port GaN power stations, 240W Thunderbolt 4 braided cords, Kevlar phone protection, and CNC aluminum desktop mounts.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-sky-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> 100% Verified Fast Charge Tested
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 2-Year Full Replacement Warranty
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="space-y-4 border-b border-slate-200 pb-6">
        {/* Main Accessory Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Ecosystem compatibility & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Ecosystem:</span>
            <button
              onClick={() => setCompatibility('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                compatibility === 'all' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Hardware
            </button>
            <button
              onClick={() => setCompatibility('usbc')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                compatibility === 'usbc' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Universal USB-C / PD
            </button>
            <button
              onClick={() => setCompatibility('apple')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                compatibility === 'apple' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MagSafe / Apple MFi
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 self-end sm:self-auto shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 focus:outline-hidden cursor-pointer text-xs"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-900 font-mono">{accessoryProducts.length}</span> accessories
          {activeTab !== 'All' && <span> in {activeTab}</span>}
        </div>
        {(activeTab !== 'All' || compatibility !== 'all') && (
          <button
            onClick={() => {
              setActiveTab('All');
              setCompatibility('all');
            }}
            className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Grid of Accessories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
