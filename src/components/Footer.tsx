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
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center overflow-hidden">
                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v16" />
                  <path d="M4 12l8-8" />
                  <path d="M8 8l10 12" />
                  <circle cx="18" cy="6" r="2" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-extrabold tracking-tight text-white font-display">
                  KHIZAR
                </span>
                <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent font-display">
                  TECH
                </span>
              </div>
              <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-[0.25em] font-mono mt-0.5">
                STORE
              </span>
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
