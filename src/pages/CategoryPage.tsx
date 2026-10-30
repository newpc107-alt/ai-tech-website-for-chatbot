import React, { useState, useMemo } from 'react';
import { CategoryId } from '../types/store';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { ArrowUpDown } from 'lucide-react';

interface CategoryPageProps {
  categoryId: CategoryId;
  initialSubcategory?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  initialSubcategory,
}) => {
  const { navigateTo } = useStore();
  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    initialSubcategory || category.subcategories[0] || 'All'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter products for this specific category
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.category === category.id);

    // Apply subcategory filter if not "All ..."
    if (selectedSubcategory && !selectedSubcategory.startsWith('All')) {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Apply sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [category.id, selectedSubcategory, sortBy, inStockOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo({ name: 'home' });
          }}
          className="hover:text-blue-600 transition-colors cursor-pointer text-inherit no-underline"
        >
          Home
        </a>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-400">Categories</span>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">{category.name}</span>
      </nav>

      {/* Sub-Page Header Banner in Fresh Blue/White */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-3 z-10 relative">
          <div className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-mono">
            Khizar Tech · Hardware Category Sub-Page
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            {category.name}
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Ambient subtle light gradient */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* Filter Toolbar (Subcategory buttons, Sort dropdown, Stock toggle) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        {/* Interactive Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
          {category.subcategories.map((sub) => {
            const isActive = selectedSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Secondary controls (Sort & In-stock) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* In-Stock filter */}
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
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

      {/* Product Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-900 font-mono">{filteredProducts.length}</span> hardware models in {category.name}
        </div>
        {selectedSubcategory && !selectedSubcategory.startsWith('All') && (
          <button
            onClick={() => setSelectedSubcategory(category.subcategories[0])}
            className="text-xs text-blue-600 hover:text-blue-700 underline cursor-pointer"
          >
            Clear subcategory filter
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl space-y-3 bg-white">
          <p className="text-slate-500 text-sm">No hardware items match the selected criteria.</p>
          <button
            onClick={() => {
              setSelectedSubcategory(category.subcategories[0]);
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs text-white rounded font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Category Cross-Navigation Banner */}
      <div className="pt-10 border-t border-slate-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              Khizar Store · Complementary Hardware Sub-Page
            </div>
            <div className="text-sm font-bold text-slate-900">
              Browse the complete Accessories Superstore
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Chargers, Kevlar cables, MagSafe desk stands, and sapphire glass protectors.
            </p>
          </div>

          <button
            onClick={() => navigateTo({ name: 'accessories' })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 shadow-2xs"
          >
            Open Accessories Hub →
          </button>
        </div>
      </div>
    </div>
  );
};
