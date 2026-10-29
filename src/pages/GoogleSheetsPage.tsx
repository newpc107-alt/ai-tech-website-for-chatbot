import React, { useState } from 'react';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useStore } from '../context/StoreContext';
import { REQUIRED_SHEET_COLUMNS } from '../services/googleSheetsService';
import {
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  PlusCircle,
  Hash,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Database,
  Info,
} from 'lucide-react';

export const GoogleSheetsPage: React.FC = () => {
  const {
    user,
    isConnected,
    isConnecting,
    spreadsheet,
    sheetRows,
    nextOrderId,
    statusMessage,
    error,
    login,
    disconnect,
    resetColumnsWithConfirmation,
    refreshSheet,
    syncOrder,
  } = useGoogleSheets();

  const { navigateTo } = useStore();
  const [testOrderRunning, setTestOrderRunning] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  // Trigger a quick test order to verify 1001 -> 1002 -> 1007 sequential generation
  const handleCreateTestOrder = async () => {
    setTestOrderRunning(true);
    setTestSuccessMessage(null);
    try {
      const demoOrder = {
        orderId: `ORD-${nextOrderId}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        items: [
          {
            id: 'test-airpods',
            product: {
              id: 'airpods-pro-titanium',
              name: 'AirPods Pro Master Edition',
              price: 249,
            } as any,
            quantity: 1,
            selectedOptions: { Finish: 'Pure White & Titanium' },
          },
        ],
        subtotal: 249,
        shipping: 0,
        tax: 19.92,
        discount: 0,
        total: 268.92,
        shippingAddress: {
          fullName: user?.displayName || 'Khizar Rahman',
          email: user?.email || 'khizar.tech@example.com',
          phone: '+1 (555) 892-4912',
          address: '100 Silicon Way, Suite 400',
          city: 'San Francisco',
          postalCode: '94107',
          country: 'United States',
        },
        paymentMethod: 'card' as const,
        status: 'Order Placed' as const,
        estimatedDelivery: '3 Business Days',
      };

      const result = await syncOrder(demoOrder, nextOrderId);
      setTestSuccessMessage(result.message);
      await refreshSheet();
    } catch (err: any) {
      console.error('Test order failed:', err);
    } finally {
      setTestOrderRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Page Title & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-700 uppercase tracking-widest">
          <button
            onClick={() => navigateTo({ name: 'home' })}
            className="hover:underline cursor-pointer"
          >
            Storefront
          </button>
          <span>/</span>
          <span className="text-slate-500">Google Workspace</span>
          <span>/</span>
          <span className="font-semibold text-blue-600">Google Sheets Sync</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Google Sheets Order Pipeline
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Real-time synchronization with spreadsheet <strong>Tech Store Orders</strong> on <strong>Sheet1</strong> with automatic sequential Order ID allocation (1001, 1002, 1007...).
            </p>
          </div>

          {isConnected && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => refreshSheet()}
                disabled={isConnecting}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin text-blue-600' : ''}`} />
                <span>Refresh Live Sheet</span>
              </button>

              {spreadsheet?.url && (
                <a
                  href={spreadsheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Sheets</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notifications / Alerts */}
      {statusMessage && (
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Pipeline Status: </span>
            {statusMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
          <strong>Notice: </strong> {error}
        </div>
      )}

      {/* Auth & Connection Status Card */}
      {!isConnected ? (
        <div className="bg-white rounded-2xl border border-blue-100 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <FileSpreadsheet className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Connect Google Sheets to Khizar Tech Store
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Link your Google Account to automatically populate every store order into <strong>Tech Store Orders</strong> on <strong>Sheet1</strong> with customer info, phone number, street address, city, postal code, country, product quantity, date, price, and sequential Order IDs.
            </p>
          </div>

          {/* Official Google Material Sign-in Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => login()}
              disabled={isConnecting}
              className="inline-flex items-center justify-center gap-3 px-6 py-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isConnecting ? 'Authorizing Google Sheets...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted OAuth2 client-side integration via Firebase Auth</span>
          </div>
        </div>
      ) : (
        /* Connected Dashboard Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Connected Account & Spreadsheet Card */}
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-blue-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {user?.displayName || 'Google Account'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={() => disconnect()}
                className="text-xs text-slate-400 hover:text-red-600 font-medium cursor-pointer"
              >
                Disconnect
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Spreadsheet</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Connected
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{spreadsheet?.name || 'Tech Store Orders'}</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>Active Target Tab:</span>
                <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Sheet1
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => resetColumnsWithConfirmation()}
                disabled={isConnecting}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Validate / Reapply Columns</span>
              </button>

              <button
                onClick={handleCreateTestOrder}
                disabled={testOrderRunning || isConnecting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>
                  {testOrderRunning ? 'Recording Order...' : `Append Test Order (#${nextOrderId})`}
                </span>
              </button>

              {testSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{testSuccessMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Order ID Sequential Engine & Specification Card */}
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
              <Hash className="w-4 h-4 text-blue-600" />
              <span>Sequential Order ID Engine</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50/50 border border-blue-200 text-center space-y-2">
              <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold">
                Next Order ID in Queue
              </div>
              <div className="text-4xl font-extrabold text-blue-900 font-mono tracking-tight">
                #{nextOrderId}
              </div>
              <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
                First order begins at <strong>1001</strong>. Every new order increments by exactly one (e.g. 1006 → 1007), dynamically computed from Sheet1 column A.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Required Sheet1 Columns Specification:
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {REQUIRED_SHEET_COLUMNS.map((col, idx) => (
                  <li key={col} className="flex items-center justify-between py-1 px-2.5 bg-slate-50 rounded-md border border-slate-200/70">
                    <span className="font-mono text-blue-600 text-[11px] font-semibold">
                      Col {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium text-slate-900">{col}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: How It Works & Auto-Sync at Checkout */}
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automatic Storefront Hook</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Automatic Checkout Integration
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Whenever any customer places an order on the <strong>Checkout</strong> page, Khizar Tech Store queries Sheet1 for the highest existing Order ID, generates the next sequential number (e.g. <strong>#{nextOrderId}</strong>), and automatically appends the order to your Google Sheet!
              </p>

              <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-sky-900 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real Google Sheets API Calls</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Data is written directly to your Google account via official Google Sheets v4 endpoints. Open the spreadsheet in Google Sheets to see instant updates!
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo({ name: 'checkout', step: 'shipping' })}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Go to Checkout to Place Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Live Sheet Data Table View */}
      {isConnected && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Live Google Sheet: Tech Store Orders (Sheet1)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Showing real rows fetched directly from your Google Sheets document.
              </p>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Total Recorded Rows: <strong>{sheetRows.length}</strong>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  {REQUIRED_SHEET_COLUMNS.map((col) => (
                    <th key={col} className="py-3 px-4 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sheetRows.length <= 1 ? (
                  <tr>
                    <td
                      colSpan={REQUIRED_SHEET_COLUMNS.length + 1}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      No orders recorded yet. Header columns are initialized! Place an order at checkout or click "Append Test Order" to add row #{nextOrderId}.
                    </td>
                  </tr>
                ) : (
                  sheetRows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors font-mono">
                      <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">{rIdx + 1}</td>
                      <td className="py-3 px-4 font-bold text-blue-700 whitespace-nowrap">
                        #{row[0] || '1001'}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-sans whitespace-nowrap">{row[1] || '—'}</td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">{row[2] || '—'}</td>
                      <td className="py-3 px-4 text-slate-800 font-sans">{row[3] || '—'}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">{row[4] || '1'}</td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-sans">{row[5] || '—'}</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold whitespace-nowrap">{row[6] || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
