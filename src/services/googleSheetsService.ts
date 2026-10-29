import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Workspace Scopes
export const REQUIRED_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive',
];

const provider = new GoogleAuthProvider();
REQUIRED_SCOPES.forEach((scope) => provider.addScope(scope));

// Memory-only access token caching (per security specification)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get Google OAuth access token from authentication result');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const REQUIRED_SHEET_COLUMNS = [
  'Order ID',
  'Customer Name',
  'Customer Email',
  'Phone number',
  'Street address',
  'City',
  'Postal zip code',
  'Country',
  'Product Name',
  'Quantity of the Product',
  'Order Date',
  'Price',
];

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  sheet1Exists: boolean;
  hasHeaders: boolean;
  totalRows: number;
}

export interface SheetOrderRow {
  orderId: number | string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  productName: string;
  quantity: number;
  orderDate: string;
  price: string;
}

/**
 * Searches Google Drive for an existing spreadsheet named "Tech Store Orders"
 */
export async function findSpreadsheet(
  title: string = 'Tech Store Orders'
): Promise<SpreadsheetInfo | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const q = encodeURIComponent(`name = '${title}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn('Drive search response not OK:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      const file = data.files[0];
      return {
        id: file.id,
        name: file.name,
        url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
        sheet1Exists: true,
        hasHeaders: false,
        totalRows: 0,
      };
    }
    return null;
  } catch (err) {
    console.error('Error finding spreadsheet in Drive:', err);
    return null;
  }
}

/**
 * Creates a brand new "Tech Store Orders" spreadsheet on user's Google Drive with Sheet1 and the required columns
 */
export async function createSpreadsheet(
  title: string = 'Tech Store Orders'
): Promise<SpreadsheetInfo> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const payload = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Sheet1',
          gridProperties: {
            frozenRowCount: 1,
            columnCount: 15,
            rowCount: 100,
          },
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: REQUIRED_SHEET_COLUMNS.map((col) => ({
                  userEnteredValue: { stringValue: col },
                })),
              },
            ],
          },
        ],
      },
    ],
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create spreadsheet: ${res.status} ${errorText}`);
  }

  const created = await res.json();
  return {
    id: created.spreadsheetId,
    name: created.properties.title,
    url: created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${created.spreadsheetId}/edit`,
    sheet1Exists: true,
    hasHeaders: true,
    totalRows: 1,
  };
}

/**
 * Ensures Sheet1 has the exact required columns on Row 1:
 * - Order ID
 * - Customer Name
 * - Customer Email
 * - Phone number
 * - Street address
 * - City
 * - Postal zip code
 * - Country
 * - Product Name
 * - Quantity of the Product
 * - Order Date
 * - Price
 */
export async function ensureSheetColumns(
  spreadsheetId: string
): Promise<{ success: boolean; sheetName: string; updated: boolean }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  // 1. Fetch metadata to find the exact Sheet tab name
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!metaRes.ok) {
    throw new Error(`Could not read spreadsheet metadata: ${metaRes.status}`);
  }

  const meta = await metaRes.json();
  const sheets = meta.sheets || [];
  let targetSheetName = 'Sheet1';

  // Check if Sheet1 exists, else use the first sheet's title
  const foundSheet1 = sheets.find((s: any) => s.properties?.title === 'Sheet1');
  if (foundSheet1) {
    targetSheetName = 'Sheet1';
  } else if (sheets.length > 0 && sheets[0].properties?.title) {
    targetSheetName = sheets[0].properties.title;
  }

  // 2. Read existing row 1 (A1:L1 for 12 columns)
  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${targetSheetName}'!A1:L1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  let currentHeaders: string[] = [];
  if (readRes.ok) {
    const readData = await readRes.json();
    currentHeaders = readData.values?.[0] || [];
  }

  // Check if headers already match all required columns
  const matches =
    currentHeaders.length >= REQUIRED_SHEET_COLUMNS.length &&
    REQUIRED_SHEET_COLUMNS.every((col, i) => currentHeaders[i]?.trim().toLowerCase() === col.toLowerCase());

  if (matches) {
    return { success: true, sheetName: targetSheetName, updated: false };
  }

  // 3. Write required columns to Row 1 (A1:L1)
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${targetSheetName}'!A1:L1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [REQUIRED_SHEET_COLUMNS],
      }),
    }
  );

  if (!updateRes.ok) {
    const errorText = await updateRes.text();
    throw new Error(`Failed to set headers on ${targetSheetName}: ${updateRes.status} ${errorText}`);
  }

  return { success: true, sheetName: targetSheetName, updated: true };
}

/**
 * Calculates the next sequential Order ID by reading all existing Order IDs from Column A of Sheet1.
 * Rule: First order is 1001. Each subsequent order is 1 higher than the highest previous order (e.g. 1006 -> 1007).
 */
export async function getNextSequentialOrderId(
  spreadsheetId?: string | null
): Promise<number> {
  const fallbackStoredId = Number(localStorage.getItem('khizar_last_order_id') || '1000');
  let highestId = Math.max(1000, fallbackStoredId);

  if (!spreadsheetId) {
    const next = highestId + 1;
    localStorage.setItem('khizar_last_order_id', String(next));
    return next;
  }

  const token = await getAccessToken();
  if (!token) {
    const next = highestId + 1;
    localStorage.setItem('khizar_last_order_id', String(next));
    return next;
  }

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Sheet1'!A2:A`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rows: string[][] = data.values || [];

      rows.forEach((row) => {
        if (row && row[0]) {
          const raw = String(row[0]).trim();
          // Extract numeric digits
          const parsed = parseInt(raw.replace(/[^\d]/g, ''), 10);
          if (!isNaN(parsed) && parsed > highestId) {
            highestId = parsed;
          }
        }
      });
    }
  } catch (err) {
    console.warn('Could not read existing order IDs from sheet, falling back to local sequence:', err);
  }

  const nextOrderId = highestId >= 1001 ? highestId + 1 : 1001;
  localStorage.setItem('khizar_last_order_id', String(nextOrderId));
  return nextOrderId;
}

/**
 * Appends order items to Sheet1 with the exact required columns:
 * [Order ID, Customer Name, Customer Email, Phone number, Street address, City, Postal zip code, Country, Product Name, Quantity of the Product, Order Date, Price]
 */
export async function appendOrderRows(
  spreadsheetId: string,
  rows: SheetOrderRow[]
): Promise<{ success: boolean; rowsAppended: number }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  if (rows.length === 0) return { success: true, rowsAppended: 0 };

  const values = rows.map((r) => [
    r.orderId,
    r.customerName,
    r.customerEmail,
    r.phone || '—',
    r.address || '—',
    r.city || '—',
    r.postalCode || '—',
    r.country || '—',
    r.productName,
    r.quantity,
    r.orderDate,
    r.price,
  ]);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Sheet1'!A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to append order to sheet: ${res.status} ${errorText}`);
  }

  return { success: true, rowsAppended: rows.length };
}

/**
 * Reads all rows from Sheet1 to display live in the dashboard table (columns A through L)
 */
export async function fetchSheetRows(
  spreadsheetId: string
): Promise<string[][]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Sheet1'!A1:L100`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.values || [];
  } catch (err) {
    console.error('Error fetching sheet rows:', err);
    return [];
  }
}
