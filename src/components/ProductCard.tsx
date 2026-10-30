import React from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { Plus, Star } from 'lucide-react';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart } = useStore();

  const productPath = `/products/${product.id}`;

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo({ name: 'product', productId: product.id });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <a
      href={productPath}
      onClick={handleCardClick}
      className="group flex flex-col bg-white hover:bg-slate-50/50 border border-slate-200/90 hover:border-blue-300 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 text-inherit no-underline"
    >
      {/* 65%-75% Height Image Area */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        <ProductVisual
          productId={product.id}
          imageSrc={product.image}
          name={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Quiet 1-line tag if applicable (clean unboxed or subtle badge) */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase shadow-2xs">
            {product.tag}
          </div>
        )}

        {/* Quick add floating button on hover */}
        <div className="absolute bottom-3 right-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to bag`}
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-3 bg-white">
        <div>
          {/* Category & Rating as clean unboxed text with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="uppercase tracking-wider text-[11px] font-semibold text-blue-600">
              {product.subcategory}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1 text-slate-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums text-xs font-semibold">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Quiet Tagline/Key benefit */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Pricing line with tabular numerals */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <span className="text-xs text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1 font-semibold">
            Details →
          </span>
        </div>
      </div>
    </a>
  );
};
