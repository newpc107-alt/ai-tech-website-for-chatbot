import React from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { Check, ShoppingBag } from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';

interface BundleDeal {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  itemIds: string[];
  bundlePrice: number;
  originalTotal: number;
  description: string;
}

export const DealsPage: React.FC = () => {
  const { addToCart, navigateTo, setIsCartDrawerOpen } = useStore();

  const bundles: BundleDeal[] = [
    {
      id: 'creator-studio-bundle',
      title: 'Creator Studio Pro Workstation Pack',
      subtitle: 'Complete 140W Desktop Power + 40Gbps Interconnect + 10-Port Hub',
      badge: 'Save $68 · Popular',
      itemIds: ['volt-140w-gan-station', 'nexus-240w-thunderbolt4', 'vertex-10in1-hub'],
      bundlePrice: 269,
      originalTotal: 337,
      description: 'Equip your desk with single-cable 140W fast power delivery, dual 4K display output, 2.5G ethernet, and 40Gbps bidirectional transfer speeds.',
    },
    {
      id: 'audiophile-acoustic-pack',
      title: 'Khizar Acoustic & AirPods Studio Bundle',
      subtitle: 'AURA II 48dB Hybrid ANC Earbuds + 1500D Carbon Shield + 6-Pair Acoustic Seal Kit',
      badge: 'Save $46 · Audio Special',
      itemIds: ['aura-ii-earbuds', 'carbon-airpods-pro-case', 'precision-silicone-eartips'],
      bundlePrice: 209,
      originalTotal: 255,
      description: 'Beryllium acoustic drivers tuned with dual-density memory foam eartips and protected in real ballistic aramid fiber with titanium clip.',
    },
    {
      id: 'high-wattage-travel-kit',
      title: 'High-Wattage Global Commuter Pack',
      subtitle: '65W GaN Travel Cube + 145W Laptop Power Bank + 100W Kevlar Braided Cable',
      badge: 'Save $37 · Travel Best',
      itemIds: ['volt-65w-travel-brick', 'volt-25k-145w-powerbank', 'nexus-100w-braided-c2c'],
      bundlePrice: 149,
      originalTotal: 186,
      description: 'Never worry about hotel wall sockets or airline seat plugs again. TSA-approved 99.9Wh reserve paired with dual-port 65W international travel prongs.',
    },
    {
      id: 'titanium-flagship-pack',
      title: 'APEX Ultra Titanium Complete Defense Kit',
      subtitle: 'APEX Ultra Flagship 5G + Real 1500D Kevlar Case + Sapphire Glass + Desk Stand',
      badge: 'Save $125 · Free Accs',
      itemIds: ['apex-ultra-titanium-5g', 'aerokev-aramid-case', 'sapphire-shield-screen-protector', 'orbit-aluminum-magsafe-stand'],
      bundlePrice: 1099,
      originalTotal: 1224,
      description: 'Acquire the flagship 200MP Grade 5 Titanium phone and get the complete aerospace aramid protection and CNC aluminum desk dock ecosystem included.',
    },
  ];

  const handleAddBundle = (bundle: BundleDeal) => {
    bundle.itemIds.forEach((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) {
        addToCart(product, 1);
      }
    });
    setIsCartDrawerOpen(true);
  };

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
        <span className="text-slate-900 font-semibold">Hardware Bundles & Deals</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl space-y-3 z-10 relative">
          <div className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-mono">
            Khizar Tech Store · Limited Bundles
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Curated Tech Ecosystem Packages
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            Cohesive hardware pairings engineered to work in harmony. Enjoy bundle discounts and complementary expedited air delivery.
          </p>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="space-y-6">
        {bundles.map((bundle) => {
          const bundleProducts = PRODUCTS.filter((p) => bundle.itemIds.includes(p.id));

          return (
            <div
              key={bundle.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[11px] font-bold">
                      {bundle.badge}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">{bundle.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{bundle.subtitle}</p>
                </div>

                <div className="flex items-baseline gap-3 self-start sm:self-auto">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono tabular-nums">
                    ${bundle.bundlePrice}
                  </span>
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    ${bundle.originalTotal}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {bundle.description}
              </p>

              {/* Items included thumbnails */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bundleProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => navigateTo({ name: 'product', productId: prod.id })}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 cursor-pointer group hover:border-blue-300 hover:bg-white transition-all shadow-2xs"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-100 bg-white shrink-0">
                      <ProductVisual
                        productId={prod.id}
                        imageSrc={prod.image}
                        name={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-semibold text-blue-600 font-mono truncate">
                        {prod.subcategory}
                      </div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Individually: ${prod.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA strip */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    Khizar Tech 2-Year Warranty on all items
                  </span>
                  <span className="hidden sm:inline" aria-hidden="true">·</span>
                  <span className="hidden sm:inline">Free Express Air Shipping</span>
                </div>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Add Entire Bundle to Bag (${bundle.bundlePrice})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
