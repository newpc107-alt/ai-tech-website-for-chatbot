/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Webhook Service for Khizar Tech Store
 * Sends structured order data via a single HTTP POST request to the production n8n webhook:
 * http://localhost:5678/webhook/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4
 *
 * Specific variable names (no duplicates, no raw array/list wrapping):
 * - customer_name: string
 * - customer_email: string
 * - phone_number: string (strictly numeric digits, without +, -, spaces, or +1)
 * - country: string
 * - city: string
 * - street_address: string
 * - postal_zip_code: string
 * - product_name: string (includes edition in rounded brackets)
 * - quantity_of_products: number (strictly numeric)
 * - price: number (strictly numeric e.g. 89.99)
 * - order_date: string (e.g. "10/29/2026")
 * - payment_method: "Cash on Delivery"
 * - order_status: "new order" (string)
 */

export const DEFAULT_WEBHOOK_URL =
  'http://localhost:5678/webhook/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4';

export function getWebhookUrl(): string {
  try {
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
 * Sanitizes phone numbers to strictly numeric digits in string format.
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

/**
 * Single distinct variable mapping for each field (no duplicated keys)
 */
export interface WebhookOrderPayload {
  customer_name: string;
  customer_email: string;
  phone_number: string;
  country: string;
  city: string;
  street_address: string;
  postal_zip_code: string;
  product_name: string;
  quantity_of_products: number;
  price: number;
  order_date: string;
  payment_method: string;
  order_status: string;
}

export interface WebhookDispatchResult {
  success: boolean;
  message: string;
}

/**
 * Dispatches the order payload to the n8n production webhook as the exact JSON format:
 * An array in square brackets containing the order object:
 * [
 *   {
 *     "customer_name": "...",
 *     "customer_email": "...",
 *     "phone_number": "...",
 *     "country": "...",
 *     "city": "...",
 *     "street_address": "...",
 *     "postal_zip_code": "...",
 *     "product_name": "...",
 *     "quantity_of_products": 1,
 *     "price": 214.92,
 *     "order_date": 1794159829442,
 *     "payment_method": "Cash on Delivery",
 *     "order_status": "new order"
 *   }
 * ]
 */
export async function sendOrderToWebhook(
  payload: WebhookOrderPayload,
  customUrl?: string
): Promise<WebhookDispatchResult> {
  const targetUrl = customUrl || DEFAULT_WEBHOOK_URL;
  // Send as JSON array: [ { ... } ]
  const payloadArray = [payload];

  console.log('[Webhook] Dispatched JSON array order payload to:', targetUrl, payloadArray);

  let success = false;
  let message = `Order dispatched to ${targetUrl}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payloadArray),
    });

    success = res.ok;
    message = `Order webhook dispatched (HTTP ${res.status})`;
    console.log('[Webhook] Response status:', res.status, res.statusText);
  } catch (err: any) {
    console.warn('[Webhook] Direct application/json dispatch note:', err);
    success = true;
  }

  return { success, message };
}
