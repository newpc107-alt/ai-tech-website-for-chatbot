import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  findSpreadsheet,
  createSpreadsheet,
  ensureSheetColumns,
  getNextSequentialOrderId,
  appendOrderRows,
  fetchSheetRows,
  SpreadsheetInfo,
  SheetOrderRow,
  REQUIRED_SHEET_COLUMNS,
} from '../services/googleSheetsService';
import { OrderDetails } from '../types/store';

interface GoogleSheetsContextType {
  user: User | null;
  isConnected: boolean;
  isConnecting: boolean;
  spreadsheet: SpreadsheetInfo | null;
  sheetRows: string[][];
  nextOrderId: number;
  statusMessage: string | null;
  error: string | null;
  login: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  initializeSpreadsheet: () => Promise<boolean>;
  resetColumnsWithConfirmation: () => Promise<boolean>;
  syncOrder: (order: OrderDetails, customOrderId?: number) => Promise<{ success: boolean; orderId: number; message: string }>;
  refreshSheet: () => Promise<void>;
  getNextOrderId: () => Promise<number>;
}

const GoogleSheetsContext = createContext<GoogleSheetsContextType | undefined>(undefined);

export const GoogleSheetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(null);
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [nextOrderId, setNextOrderId] = useState<number>(1001);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load spreadsheet data and calculate next sequential order ID
  const loadSpreadsheetData = useCallback(async (sheetInfo: SpreadsheetInfo) => {
    try {
      // 1. Ensure columns exist on Sheet1
      await ensureSheetColumns(sheetInfo.id);

      // 2. Fetch current rows
      const rows = await fetchSheetRows(sheetInfo.id);
      setSheetRows(rows);

      // 3. Compute next sequential order ID (e.g. 1001, 1002, 1007)
      const nextId = await getNextSequentialOrderId(sheetInfo.id);
      setNextOrderId(nextId);

      setStatusMessage(`Connected to '${sheetInfo.name}' (Sheet1 ready with 12 required columns including phone & address). Next Order ID: #${nextId}`);
      setError(null);
    } catch (err: any) {
      console.error('Error loading sheet data:', err);
      setError(err.message || 'Failed to initialize sheet columns');
    }
  }, []);

  // Check existing spreadsheet on Drive after auth
  const locateSpreadsheet = useCallback(async () => {
    try {
      setIsConnecting(true);
      setStatusMessage('Searching for "Tech Store Orders" on your Google Drive...');
      let sheet = await findSpreadsheet('Tech Store Orders');

      if (!sheet) {
        setStatusMessage('Creating "Tech Store Orders" spreadsheet on your Google Drive...');
        sheet = await createSpreadsheet('Tech Store Orders');
      }

      setSpreadsheet(sheet);
      await loadSpreadsheetData(sheet);
      setIsConnecting(false);
      return sheet;
    } catch (err: any) {
      console.error('Locate spreadsheet error:', err);
      setError(err.message || 'Failed to access Google Drive');
      setIsConnecting(false);
      return null;
    }
  }, [loadSpreadsheetData]);

  // Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      async (authenticatedUser) => {
        setUser(authenticatedUser);
        setIsConnected(true);
        await locateSpreadsheet();
      },
      () => {
        setUser(null);
        setIsConnected(false);
        setSpreadsheet(null);
        setSheetRows([]);
      }
    );
    return () => unsubscribe();
  }, [locateSpreadsheet]);

  const login = async (): Promise<boolean> => {
    try {
      setIsConnecting(true);
      setError(null);
      setStatusMessage('Signing in with Google and requesting Sheets permissions...');
      const result = await googleSignIn();
      setUser(result.user);
      setIsConnected(true);
      await locateSpreadsheet();
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Google sign-in failed');
      setIsConnecting(false);
      return false;
    }
  };

  const disconnect = async (): Promise<void> => {
    await logout();
    setUser(null);
    setIsConnected(false);
    setSpreadsheet(null);
    setSheetRows([]);
    setStatusMessage('Disconnected from Google Account.');
  };

  const initializeSpreadsheet = async (): Promise<boolean> => {
    if (!isConnected) {
      const loggedIn = await login();
      if (!loggedIn) return false;
    }
    const sheet = await locateSpreadsheet();
    return !!sheet;
  };

  /**
   * Safe column setup with explicit confirmation (Destructive operations contract)
   */
  const resetColumnsWithConfirmation = async (): Promise<boolean> => {
    if (!spreadsheet) {
      setError('No spreadsheet connected');
      return false;
    }

    const confirmed = window.confirm(
      `Format Sheet1 with the 12 required columns?\n\nRequired columns:\n${REQUIRED_SHEET_COLUMNS.join(' | ')}\n\nThis will verify or write the headers to Row 1 of your 'Tech Store Orders' spreadsheet.`
    );

    if (!confirmed) return false;

    try {
      setIsConnecting(true);
      await ensureSheetColumns(spreadsheet.id);
      const rows = await fetchSheetRows(spreadsheet.id);
      setSheetRows(rows);
      setStatusMessage('Sheet1 header columns successfully validated & applied.');
      setIsConnecting(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update columns');
      setIsConnecting(false);
      return false;
    }
  };

  const refreshSheet = async (): Promise<void> => {
    if (!spreadsheet) return;
    try {
      setIsConnecting(true);
      const rows = await fetchSheetRows(spreadsheet.id);
      setSheetRows(rows);
      const nextId = await getNextSequentialOrderId(spreadsheet.id);
      setNextOrderId(nextId);
      setIsConnecting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh sheet');
      setIsConnecting(false);
    }
  };

  const getNextId = async (): Promise<number> => {
    return getNextSequentialOrderId(spreadsheet?.id);
  };

  /**
   * Syncs a placed order to Google Sheets
   * Maps each purchased item into a row matching the exact required terms:
   * [Order ID, Customer Name, Customer Email, Phone number, Street address, City, Postal zip code, Country, Product Name, Quantity of the Product, Order Date, Price]
   */
  const syncOrder = async (
    order: OrderDetails,
    customOrderId?: number
  ): Promise<{ success: boolean; orderId: number; message: string }> => {
    // 1. Determine sequential Order ID (e.g. 1001, 1002, 1007)
    let assignedId = customOrderId;
    if (!assignedId) {
      assignedId = await getNextSequentialOrderId(spreadsheet?.id);
    }

    // If Google Sheets is not connected, return with assigned sequential ID
    if (!spreadsheet) {
      setNextOrderId(assignedId + 1);
      return {
        success: false,
        orderId: assignedId,
        message: `Order #${assignedId} saved locally. Connect Google Sheets to sync with 'Tech Store Orders'.`,
      };
    }

    try {
      // Create rows for each item in the order with customer details, phone, and address
      const rows: SheetOrderRow[] = order.items.map((item) => ({
        orderId: assignedId!,
        customerName: order.shippingAddress.fullName,
        customerEmail: order.shippingAddress.email,
        phone: order.shippingAddress.phone || '—',
        address: order.shippingAddress.address || '—',
        city: order.shippingAddress.city || '—',
        postalCode: order.shippingAddress.postalCode || '—',
        country: order.shippingAddress.country || '—',
        productName: `${item.product.name}${
          Object.keys(item.selectedOptions || {}).length > 0
            ? ` (${Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')})`
            : ''
        }`,
        quantity: item.quantity,
        orderDate: order.date,
        price: `$${(item.product.price * item.quantity).toFixed(2)}`,
      }));

      // If cart had 0 items for any reason, record single summary row
      if (rows.length === 0) {
        rows.push({
          orderId: assignedId,
          customerName: order.shippingAddress.fullName,
          customerEmail: order.shippingAddress.email,
          phone: order.shippingAddress.phone || '—',
          address: order.shippingAddress.address || '—',
          city: order.shippingAddress.city || '—',
          postalCode: order.shippingAddress.postalCode || '—',
          country: order.shippingAddress.country || '—',
          productName: 'Hardware Order Total',
          quantity: 1,
          orderDate: order.date,
          price: `$${order.total.toFixed(2)}`,
        });
      }

      await appendOrderRows(spreadsheet.id, rows);

      // Refresh live sheet view
      const updatedRows = await fetchSheetRows(spreadsheet.id);
      setSheetRows(updatedRows);
      setNextOrderId(assignedId + 1);

      setStatusMessage(`Order #${assignedId} successfully appended to 'Tech Store Orders' (Sheet1).`);
      return {
        success: true,
        orderId: assignedId,
        message: `Order #${assignedId} recorded to Google Sheets 'Tech Store Orders' (Sheet1)!`,
      };
    } catch (err: any) {
      console.error('Sync to sheets failed:', err);
      return {
        success: false,
        orderId: assignedId,
        message: `Order #${assignedId} completed, but Google Sheets sync encountered an issue: ${err.message}`,
      };
    }
  };

  return (
    <GoogleSheetsContext.Provider
      value={{
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
        initializeSpreadsheet,
        resetColumnsWithConfirmation,
        syncOrder,
        refreshSheet,
        getNextOrderId: getNextId,
      }}
    >
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export const useGoogleSheets = (): GoogleSheetsContextType => {
  const context = useContext(GoogleSheetsContext);
  if (!context) {
    throw new Error('useGoogleSheets must be used within a GoogleSheetsProvider');
  }
  return context;
};
