import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, RotateCcw, Zap, Globe } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export const Footer: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-auto">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-100 text-sm">Khizar 2-Year Full Hardware Warranty</div>
              <p className="text-slate-400 text-xs mt-1">Every device, GaN charger, and cable backed by comprehensive replacement coverage.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-100 text-sm">Complimentary Express Air Shipping</div>
              <p className="text-slate-400 text-xs mt-1">Free 2-3 business day air delivery on all hardware orders over $50.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-100 text-sm">30-Day Hassle-Free Returns</div>
              <p className="text-slate-400 text-xs mt-1">Experience the gear in your daily workflow. Full return with pre-paid shipping label.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-100 text-sm">Precision Engineering Standards</div>
              <p className="text-slate-400 text-xs mt-1">Grade 5 titanium metallurgy, GaN III semiconductors, and beryllium transducers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand column */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-sm">
              KT
            </div>
            <span className="text-base font-bold text-white uppercase tracking-tight font-display">
              Khizar Tech Store
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Founded by Khizar. High-performance audio, GaN fast charging, and precision hardware accessories crafted for tech purists.
          </p>
          <div className="pt-2 text-[11px] text-blue-400 font-medium">
            Khizar Portfolio Showcase Project · Built with modern React & Tailwind
          </div>
        </div>

        {/* Categories column */}
        <div>
          <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
            Categories
          </div>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => navigateTo({ name: 'category', categoryId: cat.id })}
                  className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigateTo({ name: 'accessories' })}
                className="hover:text-blue-300 transition-colors text-xs text-left cursor-pointer font-bold text-blue-400"
              >
                Accessories Superstore →
              </button>
            </li>
          </ul>
        </div>

        {/* Sub-Pages & Tools */}
        <div>
          <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
            Dedicated Sub-Pages
          </div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigateTo({ name: 'home' })}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer"
              >
                Storefront Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'deals' })}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer"
              >
                Hardware Bundles & Deals
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'cart' })}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer"
              >
                Shopping Bag & Review
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'track' })}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer"
              >
                Live Order Dispatch Tracking
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ name: 'about' })}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer"
              >
                Engineering & Metallurgy
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
            Khizar Tech Support
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => navigateTo({ name: 'track' })}
                className="hover:text-blue-400 text-blue-300 font-medium transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                <span>Track Your Order</span> →
              </button>
            </li>
            <li>Email: khizar.tech@support.design</li>
            <li>Direct Inquiries: hello@khizar-store.design</li>
            <li>Hotline: +1 (800) KHIZAR-TECH</li>
            <li>Hours: Mon - Fri, 9am - 8pm EST</li>
            <li className="pt-2">
              <span className="text-[11px] text-blue-400">Secure 256-bit encrypted checkout</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Khizar Tech Store Inc. All rights reserved. Designed for Khizar&apos;s Portfolio.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Khizar Quality Certifications</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
