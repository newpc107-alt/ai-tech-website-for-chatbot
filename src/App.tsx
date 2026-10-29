/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DealsPage } from './pages/DealsPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { route } = useStore();

  const renderActiveSubPage = () => {
    switch (route.name) {
      case 'home':
        return <HomePage />;
      case 'category':
        return (
          <CategoryPage
            categoryId={route.categoryId}
            initialSubcategory={route.subcategory}
            key={`${route.categoryId}-${route.subcategory || 'default'}`}
          />
        );
      case 'accessories':
        return (
          <AccessoriesPage
            initialSubcategory={route.subcategory}
            key={route.subcategory || 'all-accessories'}
          />
        );
      case 'product':
        return <ProductDetailPage productId={route.productId} key={route.productId} />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage initialStep={route.step} key={route.step} />;
      case 'deals':
        return <DealsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50/70 via-white to-blue-50/40 text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Subtle refreshing ambient light gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_90%_50%_at_50%_-5%,rgba(224,242,254,0.45),rgba(255,255,255,0))] mix-blend-multiply" 
        aria-hidden="true" 
      />
      <div 
        className="fixed bottom-0 right-0 w-[550px] h-[550px] pointer-events-none -z-10 bg-[radial-gradient(circle,rgba(219,234,254,0.3),rgba(255,255,255,0))] blur-3xl" 
        aria-hidden="true" 
      />

      {/* 3-Zone Top Navigation Contract */}
      <Navbar />

      {/* Main Sub-Page Canvas */}
      <main className="flex-1 w-full" id="main-content">
        {renderActiveSubPage()}
      </main>

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <SearchModal />

      {/* Footer & Direct Sub-Page Directory */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
