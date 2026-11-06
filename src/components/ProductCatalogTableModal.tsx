import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { X, Search, Copy, Check, Download, Table, ExternalLink } from 'lucide-react';
import { ProductVisual } from './ProductVisual';

export const ProductCatalogTableModal: React.FC = () => {
  const { isProductTableModalOpen, setIsProductTableModalOpen, navigateTo } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const codeMatch = p.code.toLowerCase().includes(q);
      const nameMatch = p.name.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
      const edOpt = p.options?.find((o) => o.name === 'Edition');
      const edMatch = edOpt?.values.some((v) => v.toLowerCase().includes(q));

      return matchesCategory && (codeMatch || nameMatch || catMatch || edMatch);
    });
  }, [searchQuery, selectedCategory]);

  if (!isProductTableModalOpen) return null;

  // Build TSV formatted text for direct clipboard paste into Google Sheets or Excel
  const generateTSV = () => {
    const headers = ['Product Code', 'Product Name', 'Price ($)', 'Category', 'Subcategory', 'All Editions'];
    const rows = PRODUCTS.map((p) => {
      const editions = p.options?.find((o) => o.name === 'Edition')?.values.join('; ') || 'Standard';
      const categoryName = CATEGORIES.find((c) => c.id === p.category)?.name || p.category;
      return [p.code, p.name, p.price, categoryName, p.subcategory, editions];
    });

    return [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  };

  // Build CSV formatted text
  const generateCSV = () => {
    const headers = ['"Product Code"', '"Product Name"', '"Price ($)"', '"Category"', '"Subcategory"', '"All Editions"'];
    const rows = PRODUCTS.map((p) => {
      const editions = (p.options?.find((o) => o.name === 'Edition')?.values.join('; ') || 'Standard').replace(/"/g, '""');
      const categoryName = (CATEGORIES.find((c) => c.id === p.category)?.name || p.category).replace(/"/g, '""');
      const name = p.name.replace(/"/g, '""');
      const subcat = p.subcategory.replace(/"/g, '""');
      return [`"${p.code}"`, `"${name}"`, p.price, `"${categoryName}"`, `"${subcat}"`, `"${editions}"`];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handleCopyTSV = async () => {
    try {
      const tsv = generateTSV();
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = generateTSV();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `khizar_tech_store_catalog_all_editions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product Catalog & Editions Directory Table"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Strip */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-semibold">
              <Table className="w-4 h-4" />
              <span>Khizar Tech Store · Product & Editions Spreadsheet Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              All 31 Products & Available Editions Table
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured catalog table with product codes, names, prices, and all editions. Ready to copy into Google Sheets or Excel.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleCopyTSV}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                copied
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title="Copy table to paste directly into Google Sheets or Microsoft Excel"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy for Spreadsheet'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Download CSV file"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={() => setIsProductTableModalOpen(false)}
              aria-label="Close modal"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by code (e.g. 01), name, or edition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-medium whitespace-nowrap">Filter:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All Categories ({PRODUCTS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200 shadow-2xs z-10">
              <tr>
                <th className="py-3 px-4 font-bold w-16 text-center">Code</th>
                <th className="py-3 px-4 font-bold w-20">Preview</th>
                <th className="py-3 px-4 font-bold">Product Name</th>
                <th className="py-3 px-4 font-bold w-24">Price</th>
                <th className="py-3 px-4 font-bold w-36">Category</th>
                <th className="py-3 px-4 font-bold">All Available Editions</th>
                <th className="py-3 px-4 font-bold w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const editions = p.options?.find((o) => o.name === 'Edition')?.values || [];
                const categoryName = CATEGORIES.find((c) => c.id === p.category)?.name || p.category;

                return (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* Product Code */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-700 bg-blue-50/50">
                      #{p.code}
                    </td>

                    {/* Thumbnail Preview */}
                    <td className="py-2 px-4">
                      <div className="w-12 h-10 rounded overflow-hidden border border-slate-200 bg-white">
                        <ProductVisual
                          productId={p.id}
                          imageSrc={p.image}
                          name={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{p.tagline}</div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      ${p.price}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600">
                      <div className="truncate">{categoryName}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{p.subcategory}</div>
                    </td>

                    {/* All Editions */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {editions.map((ed) => (
                          <span
                            key={ed}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            {ed}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* View Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setIsProductTableModalOpen(false);
                          navigateTo({ name: 'product', productId: p.id });
                        }}
                        className="inline-flex items-center justify-center p-1.5 rounded-md text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                        title={`View ${p.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            Showing <span className="font-semibold font-mono text-slate-900">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold font-mono text-slate-900">{PRODUCTS.length}</span> products with verified editions.
          </div>
          <div className="text-slate-400">
            Tip: Click &quot;Copy for Spreadsheet&quot; and press Ctrl+V / Cmd+V directly in Google Sheets or Excel.
          </div>
        </div>
      </div>
    </div>
  );
};
