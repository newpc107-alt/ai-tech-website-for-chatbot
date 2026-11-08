/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Webhook Service for Khizar Tech Store
 * Sends structured order data via a SINGLE HTTP POST request to the designated n8n webhook:
 * http://localhost:5678/webhook/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4
 *
 * NOTE: As requested by user:
 * - Webhook is triggered ONLY ONCE (no double dispatch, no dual form+fetch).
 * - Exact field types:
 *   - Customer name / Customer Name: string
 *   - Customer email / Customer Email: string
 *   - Phone number: string (strictly numeric digits, without +1, +, -, spaces, or special characters)
 *   - Street address: string
 *   - City: string
 *   - Postal zip code: string
 *   - Country: string
 *   - Product name / Product Name: string (includes edition in rounded brackets)
 *   - Quantity of the products / Quantity of the Product: number (strictly numeric)
 *   - Price / Price of the product: string
 *   - Order date / Order Date: number (strictly numeric timestamp)
 *   - Payment method: "Cash on Delivery"
 *   - SKIP product addition / edition field (edition is already in the product name in brackets)
 *   - NO Order ID is sent
 */

export const DEFAULT_WEBHOOK_URL =
  'http://localhost:5678/webhook/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4';

export function getWebhookUrl(): string {
  try {
    // Always enforce the production webhook URL
    localStorage.setItem('khizar_store_webhook_url', DEFAULT_WEBHOOK_URL);
    return DEFAULT_WEBHOOK_URL;
  } catch {
    return DEFAULT_WEBHOOK_URL;
  }
}

export function setWebhookUrl(url: string): void {
  try {
    localStorage.setItem('khizar_store_webhook_url', url.trim());
  } catch {
    // Ignore storage errors
  }
}

/**
 * Sanitizes phone numbers to strictly digits in string format.
 * Strips +1, +, -, parentheses, dots, and whitespace.
 */
export function cleanPhoneNumber(raw: string): string {
  if (!raw) return '';
  let str = String(raw).trim();
  if (str.startsWith('+1')) {
    str = str.substring(2);
  } else if (str.startsWith('+')) {
    str = str.substring(1);
  }
  return str.replace(/\D/g, '');
}

export interface WebhookOrderPayload {
  // User fields matching exact casing expected by n8n:
  'Customer name': string;
  'Customer Name': string;
  'Customer email': string;
  'Customer Email': string;
  'Phone number': string;
  'Country': string;
  'City': string;
  'Street address': string;
  'Postal zip code': string;
  'Product name': string;
  'Product Name': string;
  'Quantity of the products': number;
  'Quantity of the Product': number;
  'Price of the product': string;
  'Price': string;
  'Order date': number;
  'Order Date': number;
  'Payment method': string;

  // Clean camelCase accessors for n8n expressions:
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  postalZipCode: string;
  productName: string;
  quantity: number;
  price: string;
  orderDate: number;
  paymentMethod: string;
}

export interface WebhookDispatchResult {
  success: boolean;
  message: string;
}

/**
 * Dispatches the order payload to the n8n webhook EXACTLY ONCE.
 * Uses a single request dispatch with no concurrent duplicates.
 */
export async function sendOrderToWebhook(
  payload: WebhookOrderPayload,
  customUrl?: string
): Promise<WebhookDispatchResult> {
  const targetUrl = customUrl || DEFAULT_WEBHOOK_URL;

  console.log('[Webhook] Dispatching single order payload to:', targetUrl, payload);

  let success = false;
  let message = `Order dispatched to ${targetUrl}`;

  // Strategy 1: Direct fetch with text/plain & mode: 'no-cors'
  // (Zero CORS preflight; passes JSON payload directly to localhost with numeric types preserved)
  try {
    await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
    success = true;
    console.log('[Webhook] Successfully dispatched single POST to:', targetUrl);
  } catch (fetchErr) {
    console.warn('[Webhook] Direct fetch failed, executing fallback form dispatch:', fetchErr);
    // Strategy 2: ONLY if direct fetch threw a network error, fallback to hidden form POST
    try {
      submitHiddenWebhookForm(targetUrl, payload);
      success = true;
      message = `Order dispatched via form fallback to ${targetUrl}`;
    } catch (formErr) {
      console.error('[Webhook] Fallback form dispatch failed:', formErr);
    }
  }

  return { success, message };
}

/**
 * Submits payload via a hidden HTML form in an iframe.
 * ONLY called as an emergency fallback if fetch completely fails.
 */
function submitHiddenWebhookForm(url: string, payload: WebhookOrderPayload): void {
  if (typeof document === 'undefined') return;

  const iframeName = 'n8n_order_frame_' + Date.now();
  const iframe = document.createElement('iframe');
  iframe.name = iframeName;
  iframe.style.display = 'none';
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.target = iframeName;
  form.style.display = 'none';

  const fields: Record<string, string | number> = {
    'Customer name': payload['Customer name'],
    'Customer Name': payload['Customer Name'],
    'Customer email': payload['Customer email'],
    'Customer Email': payload['Customer Email'],
    'Phone number': payload['Phone number'],
    'Country': payload['Country'],
    'City': payload['City'],
    'Street address': payload['Street address'],
    'Postal zip code': payload['Postal zip code'],
    'Product name': payload['Product name'],
    'Product Name': payload['Product Name'],
    'Quantity of the products': payload['Quantity of the products'],
    'Quantity of the Product': payload['Quantity of the Product'],
    'Price of the product': payload['Price of the product'],
    'Price': payload['Price'],
    'Order date': payload['Order date'],
    'Order Date': payload['Order Date'],
    'Payment method': payload['Payment method'],
    'payload_json': JSON.stringify(payload),
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);

  try {
    form.submit();
  } finally {
    setTimeout(() => {
      try {
        if (form.parentNode) form.parentNode.removeChild(form);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      } catch {
        // ignore removal issues
      }
    }, 3000);
  }
}
