import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, RotateCcw, Zap, Globe } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export const Footer: React.FC = () => {
  const { navigateTo, setIsProductTableModalOpen } = useStore();

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
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-blue-600 to-indigo-700 p-[2px] shadow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center overflow-hidden">
                <svg className="w-5 h-5 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 6C7 5.44772 7.44772 5 8 5H11.5C12.0523 5 12.5 5.44772 12.5 6V26C12.5 26.5523 12.0523 27 11.5 27H8C7.44772 27 7 26.5523 7 26V6Z" fill="#60a5fa" />
                  <path d="M12.5 16.5L21.8 7.2C22.2 6.8 22.8 6.8 23.2 7.2L25.3 9.3C25.7 9.7 25.7 10.3 25.3 10.7L16.2 19.8L12.5 16.5Z" fill="#38bdf8" />
                  <path d="M15.5 18.2L23.5 26.2C23.9 26.6 24.5 26.6 24.9 26.2L27 24.1C27.4 23.7 27.4 23.1 27 22.7L18.8 14.5L15.5 18.2Z" fill="#818cf8" />
                  <circle cx="15.5" cy="17.5" r="2" fill="#34d399" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-black tracking-tight text-white font-display">
                  KHIZAR
                </span>
                <span className="text-base font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent font-display">
                  TECH
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[8.5px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                  PRO LABS · VERIFIED
                </span>
              </div>
            </div>
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
                <a
                  href={`/categories/${cat.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo({ name: 'category', categoryId: cat.id });
                  }}
                  className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer inline-block text-inherit no-underline"
                >
                  {cat.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/accessories"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'accessories' });
                }}
                className="hover:text-blue-300 transition-colors text-xs text-left cursor-pointer font-bold text-blue-400 inline-block no-underline"
              >
                Accessories Superstore →
              </a>
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
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'home' });
                }}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer inline-block text-inherit no-underline"
              >
                Storefront Home
              </a>
            </li>
            <li>
              <a
                href="/deals"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'deals' });
                }}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer inline-block text-inherit no-underline"
              >
                Hardware Bundles & Deals
              </a>
            </li>
            <li>
              <a
                href="/cart"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'cart' });
                }}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer inline-block text-inherit no-underline"
              >
                Shopping Bag & Review
              </a>
            </li>
            <li>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo({ name: 'about' });
                }}
                className="hover:text-blue-400 transition-colors text-xs text-left cursor-pointer inline-block text-inherit no-underline"
              >
                Engineering & Metallurgy
              </a>
            </li>
            <li>
              <button
                onClick={() => setIsProductTableModalOpen(true)}
                className="hover:text-blue-300 transition-colors text-xs text-left cursor-pointer font-bold text-sky-400 inline-block bg-transparent p-0 border-none"
              >
                📊 Product & Editions Table (Spreadsheet)
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
            <li>Cash on Delivery dispatch available nationwide</li>
            <li>Email: khizar.tech@support.design</li>
            <li>Direct Inquiries: hello@khizar-store.design</li>
            <li>Hotline: +1 (800) KHIZAR-TECH</li>
            <li>Hours: Mon - Fri, 9am - 8pm EST</li>
            <li className="pt-2">
              <span className="text-[11px] text-blue-400">Cash on Delivery · Inspect before paying</span>
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
