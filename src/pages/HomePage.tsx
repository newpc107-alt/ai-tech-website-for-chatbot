import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS, HERO_IMAGE } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Cpu, Sparkles, Layers, Zap, Volume2, BatteryCharging } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo } = useStore();

  // Curated items for the home showcase: Audio, Chargers & Accessories FIRST, NOT mobiles
  const featuredIds = [
    'aura-ii-earbuds',
    'airpods-pro-titanium',
    'volt-140w-gan-station',
    'volt-3in1-magsafe-dock',
    'nexus-240w-thunderbolt4',
    'orbit-aluminum-magsafe-stand',
  ];
  const featuredProducts = PRODUCTS.filter((p) => featuredIds.includes(p.id));

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Storefront Hero: AirPods, Acoustics & GaN Power Ecosystem (NOT mobile phones first) */}
      <section className="relative px-4 sm:px-6 pt-6">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-blue-100 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white relative shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
            {/* Left Content Column */}
            <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between z-10 bg-slate-950/70 lg:bg-slate-950/85 backdrop-blur-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 font-semibold font-mono">
                  <span>Khizar Tech Collection 2026</span>
                  <span aria-hidden="true">·</span>
                  <span>Audio & GaN Power</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] font-display text-balance">
                  Next-generation audio & precision power.
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                  Welcome to Khizar Tech Store. Discover custom beryllium AirPods, 140W GaN desktop stations with live OLED power meters, and 240W braided Kevlar cables.
                </p>
              </div>

              <div className="pt-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/categories/audio"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo({ name: 'category', categoryId: 'audio' });
                    }}
                    className="px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer text-inherit no-underline"
                  >
                    <span>Explore AirPods & Audio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-900" />
                  </a>
                  <a
                    href="/accessories"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo({ name: 'accessories' });
                    }}
                    className="px-5 py-2.5 bg-blue-800/80 hover:bg-blue-700/80 text-white border border-blue-400/40 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer text-inherit no-underline"
                  >
                    <span>All Accessories Catalog</span>
                  </a>
                </div>

                <div className="flex items-center gap-4 text-xs text-sky-300 pt-2 font-mono">
                  <span>48dB Hybrid ANC</span>
                  <span aria-hidden="true">·</span>
                  <span>140W GaN III Fast Charge</span>
                  <span aria-hidden="true">·</span>
                  <span>40Gbps Thunderbolt</span>
                </div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-full bg-slate-900">
              <img
                src={HERO_IMAGE}
                alt="Khizar Tech Hardware Ecosystem"
                className="w-full h-full object-cover object-center absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Direct Sub-Page Category Cards */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1 font-mono">
                Sub-Page Directory
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Shop by Hardware Category
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Each section opens as its own dedicated sub-page with specialized filters, technical spec breakdowns, and all accessory variants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`/categories/${category.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'category', categoryId: category.id });
                }}
                className="group relative bg-white hover:bg-blue-50/40 border border-slate-200/90 hover:border-blue-400 rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 text-inherit no-underline"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="uppercase tracking-wider font-mono text-[11px] text-blue-600 font-semibold">
                      Dedicated Sub-Page
                    </span>
                    <span className="text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1 font-semibold">
                      Open Page <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 font-display">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {category.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {category.subcategories.slice(1, 4).map((sub) => (
                    <span
                      key={sub}
                      className="text-[11px] text-slate-500 group-hover:text-slate-800 transition-colors"
                    >
                      {sub} ·
                    </span>
                  ))}
                  <span className="text-[11px] text-blue-600 font-medium">explore</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Curated Featured Hardware Showcase (Audio, Chargers & Cables first) */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1 font-mono">
                Featured Selection
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Top Rated Audio, Power & Interconnects
              </h2>
            </div>
            <a
              href="/accessories"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ name: 'accessories' });
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 cursor-pointer text-inherit no-underline"
            >
              <span>View All 20+ Hardware Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship & Standards in Fresh Blue & White Theme */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/40 p-8 sm:p-12 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Custom Beryllium Acoustic Drivers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ultralight metallic diaphragms deliver wide dynamic range, transparent midrange vocals, and crystalline high frequencies with zero harmonic distortion.
              </p>
            </div>

            <div className="space-y-3 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">GaN III Power Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gallium Nitride transistors conduct electricity with 96.2% efficiency, keeping our 140W desktop stations cool while running multiple high-demand laptops.
              </p>
            </div>

            <div className="space-y-3 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">DuPont Ballistic Kevlar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                1500D aramid weaves integrated directly into phone cases and cable jackets, rated to withstand 50,000 flex cycles and 100kg tensile loads.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Read our full metallurgy and laboratory stress-testing documentation on the dedicated engineering sub-page.
            </div>
            <button
              onClick={() => navigateTo({ name: 'about' })}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Engineering Lab Sub-Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
