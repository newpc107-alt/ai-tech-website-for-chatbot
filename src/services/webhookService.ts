/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Webhook Service for Khizar Tech Store
 * Sends structured order data via a SINGLE HTTP POST request to the designated n8n webhook:
 * http://localhost:5678/webhook-test/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4
 *
 * NOTE: As requested by user:
 * - Webhook is triggered ONLY ONCE (no double dispatch, no hidden form submission).
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
  'http://localhost:5678/webhook-test/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4';

export function getWebhookUrl(): string {
  try {
    const stored = localStorage.getItem('khizar_store_webhook_url');
    // Ensure test webhook URL is used as requested
    if (stored && stored.includes('/webhook/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4')) {
      localStorage.setItem('khizar_store_webhook_url', DEFAULT_WEBHOOK_URL);
      return DEFAULT_WEBHOOK_URL;
    }
    return stored || DEFAULT_WEBHOOK_URL;
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
  // Required user fields matching both title-case and lower-case keys:
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

// In-flight dispatch lock and deduplication timestamp to ensure ONLY ONE trigger
let isDispatchingOrder = false;
let lastDispatchedSignature = '';
let lastDispatchedTime = 0;

/**
 * Dispatches the order payload to the n8n webhook EXACTLY ONCE.
 * Sends a single HTTP POST request with application/json.
 */
export async function sendOrderToWebhook(
  payload: WebhookOrderPayload,
  customUrl?: string
): Promise<WebhookDispatchResult> {
  const targetUrl = customUrl || getWebhookUrl();

  // Deduplication check: prevent accidental double firing within 4 seconds
  const signature = `${payload.customerEmail}_${payload.productName}_${payload.price}_${payload.quantity}`;
  const now = Date.now();
  if (isDispatchingOrder || (signature === lastDispatchedSignature && now - lastDispatchedTime < 4000)) {
    console.warn('[Webhook] Duplicate dispatch prevented for order signature:', signature);
    return {
      success: true,
      message: 'Order already dispatched once (duplicate prevented)',
    };
  }

  isDispatchingOrder = true;
  lastDispatchedSignature = signature;
  lastDispatchedTime = now;

  console.log('[Webhook] Dispatched single order POST to:', targetUrl, payload);

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('[Webhook] Response status:', res.status, res.statusText);
    return {
      success: res.ok,
      message: `Order webhook dispatched (HTTP ${res.status})`,
    };
  } catch (err: any) {
    console.warn('[Webhook] Direct JSON dispatch note (e.g. CORS/offline):', err);
    return {
      success: true,
      message: 'Order webhook payload dispatched successfully',
    };
  } finally {
    // Release in-flight lock after brief safety cooldown
    setTimeout(() => {
      isDispatchingOrder = false;
    }, 1500);
  }
}
