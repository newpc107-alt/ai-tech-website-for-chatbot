import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductVisual } from './ProductVisual';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tagline.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    navigateTo({ name: 'product', productId });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative mx-auto max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AirPods, 140W GaN chargers, cables, docks, cases..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 mr-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-200/60 border border-slate-300 cursor-pointer font-mono"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono">
              Popular Khizar Tech Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {['AirPods Pro', '140W GaN Charger', 'Thunderbolt 4 Cable', '3-in-1 MagSafe Dock', 'Aramid Case', '25,000mAh Power Bank'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-md transition-colors cursor-pointer font-medium"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Direct Categories
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateTo({ name: 'category', categoryId: 'audio' });
                  }}
                  className="p-2 rounded bg-slate-50 hover:bg-blue-50 text-left hover:text-blue-700 border border-slate-100"
                >
                  AirPods & Audio →
                </button>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateTo({ name: 'category', categoryId: 'chargers' });
                  }}
                  className="p-2 rounded bg-slate-50 hover:bg-blue-50 text-left hover:text-blue-700 border border-slate-100"
                >
                  GaN Chargers & Power →
                </button>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateTo({ name: 'accessories' });
                  }}
                  className="p-2 rounded bg-slate-50 hover:bg-blue-50 text-left hover:text-blue-700 border border-slate-100 font-semibold text-blue-600"
                >
                  All Accessories Hub →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="max-h-96 overflow-y-auto p-3 space-y-1">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No hardware found matching &quot;{query}&quot;
              </div>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50/70 cursor-pointer group transition-colors border border-transparent hover:border-blue-100"
                >
                  <div className="w-12 h-12 rounded overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                    <ProductVisual
                      productId={product.id}
                      imageSrc={product.image}
                      name={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-blue-600 font-mono">
                        {product.subcategory}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ★ {product.rating}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {product.tagline}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                      ${product.price}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-auto mt-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
