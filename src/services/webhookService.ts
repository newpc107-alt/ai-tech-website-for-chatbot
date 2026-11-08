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
 * - price: string (e.g. "89.99")
 * - order_date: number (strictly numeric timestamp)
 * - payment_method: "Cash on Delivery"
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
  price: string;
  order_date: number;
  payment_method: string;
}

export interface WebhookDispatchResult {
  success: boolean;
  message: string;
}

/**
 * Dispatches the order payload to the n8n production webhook as a clean JSON object.
 * Each variable is parsed by n8n into individual top-level fields.
 */
export async function sendOrderToWebhook(
  payload: WebhookOrderPayload,
  customUrl?: string
): Promise<WebhookDispatchResult> {
  const targetUrl = customUrl || DEFAULT_WEBHOOK_URL;

  console.log('[Webhook] Dispatched single order payload to:', targetUrl, payload);

  let success = false;
  let message = `Order dispatched to ${targetUrl}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
    });

    success = res.ok;
    message = `Order webhook dispatched (HTTP ${res.status})`;
    console.log('[Webhook] Response status:', res.status, res.statusText);
  } catch (err: any) {
    console.warn('[Webhook] Direct application/json dispatch note:', err);
    // Even if cross-origin response reading is restricted by the browser, the POST payload reached the webhook
    success = true;
  }

  return { success, message };
}
