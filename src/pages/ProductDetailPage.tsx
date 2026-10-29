import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  ArrowRight,
  Heart,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { navigateTo, addToCart, isWishlisted, toggleWishlist } = useStore();
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const category = CATEGORIES.find((c) => c.id === product.category);

  // Gallery state
  const [activeImage, setActiveImage] = useState<string>(product.image);

  // Selected variant options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.options) {
      product.options.forEach((opt) => {
        if (opt.values.length > 0) {
          initial[opt.name] = opt.values[0];
        }
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOptions);
    navigateTo({ name: 'checkout', step: 'shipping' });
  };

  // Companion products
  const companionProducts = product.companionProductIds
    ? PRODUCTS.filter((p) => product.companionProductIds?.includes(p.id))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => navigateTo({ name: 'home' })}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span aria-hidden="true" className="text-slate-300">/</span>
        {category && (
          <>
            <button
              onClick={() => navigateTo({ name: 'category', categoryId: category.id })}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              {category.name}
            </button>
            <span aria-hidden="true" className="text-slate-300">/</span>
          </>
        )}
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Contiguous PDP Split (Left Gallery + Right Purchase Module) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery Column */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <ProductVisual
              productId={product.id}
              imageSrc={activeImage}
              name={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.tag && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-2xs">
                {product.tag}
              </div>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer shadow-2xs"
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.gallery.length > 1 && (
            <div className="flex items-center gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border transition-all cursor-pointer bg-white ${
                    activeImage === img
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductVisual
                    productId={product.id}
                    imageSrc={img}
                    name={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div>
            {/* Category / Subcategory & Rating */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="uppercase tracking-wider font-semibold text-blue-600">
                {product.subcategory}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1 text-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-mono font-bold tabular-nums">{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Pricing & Stock Status */}
          <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through font-mono tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>In Stock {product.stockCount ? `(${product.stockCount} units)` : ''}</span>
            </div>
          </div>

          {/* Interactive Variant Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {product.options.map((option) => (
                <div key={option.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{option.name}</span>
                    <span className="text-blue-600 font-mono text-[11px] font-semibold">
                      {selectedOptions[option.name]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {option.values.map((val) => {
                      const isSelected = selectedOptions[option.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleOptionChange(option.name, val)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-medium">Quantity</span>
              <div className="flex items-center border border-slate-300 rounded-md bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono tabular-nums text-slate-900 font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>{addedNotice ? 'Added to Bag ✓' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Purchase Guarantees Strip */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Free Air Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Khizar 2-Yr Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Technical Specifications Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Product Overview & Architecture
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Features Bulleted List */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-blue-600 font-semibold font-mono">
              Key Engineering Features
            </h3>
            <div className="space-y-2">
              {product.keyFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Specifications Table */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center justify-between">
            <span>Technical Specifications</span>
            <span className="text-[11px] font-normal text-blue-600 font-mono">Khizar Certified</span>
          </h2>

          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
            <dl className="divide-y divide-slate-100">
              {Object.entries(product.specs).map(([specKey, specVal]) => (
                <div key={specKey} className="px-4 py-3 flex items-center justify-between text-xs">
                  <dt className="text-slate-500 font-medium">{specKey}</dt>
                  <dd className="text-slate-900 font-mono text-right tabular-nums font-semibold">{specVal}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Companion Accessories */}
      {companionProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1 font-mono">
              Companion Ecosystem
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recommended Accessories for {product.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companionProducts.map((companion) => (
              <ProductCard key={companion.id} product={companion} />
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="pt-10 border-t border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1 font-mono">
              Verified Owner Feedback
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Customer Reviews</span>
              <span className="text-sm font-normal text-slate-500">({product.reviewCount})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900 font-mono">{product.rating}</span>
            <span className="text-xs text-slate-500">out of 5.0</span>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[10px] text-blue-600 uppercase font-mono font-semibold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px]">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  &quot;{rev.comment}&quot;
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500 shadow-2xs">
              Every Khizar Tech batch is rigorously lab-tested prior to dispatch. 99.1% five-star customer satisfaction score.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
