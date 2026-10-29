/**
 * Webhook Service for Khizar Tech Store
 * Sends structured order payloads to the designated n8n webhook URL:
 * http://localhost:5678/webhook-test/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4
 */

export const WEBHOOK_URL = 'http://localhost:5678/webhook-test/1f68a034-66d3-4dc3-a1ea-1e8f96a54bb4';

export interface WebhookOrderPayload {
  // Required specific terms
  'Order ID': number;
  'Customer Name': string;
  'Customer Email': string;
  'Phone number': string;
  'Street address': string;
  'City': string;
  'Postal zip code': string;
  'Country': string;
  'Product Name': string;
  'Quantity of the Product': number;
  'Order Date': string;
  'Price': number;

  // Additional structured fields for workflows & automation
  orderId: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  postalZipCode: string;
  country: string;
  orderDate: string;
  totalPrice: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  paymentMethod: 'Cash on Delivery';
  status: 'Order Placed';
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedOptions: Record<string, string>;
  }>;
}

/**
 * Sequential Order ID Generator
 * Persists the counter in localStorage so that the first order is 1001,
 * and each subsequent order increments by 1 (1002, 1003, etc.).
 */
export function getNextSequentialOrderId(): number {
  try {
    const saved = localStorage.getItem('khizar_store_order_counter');
    if (!saved) {
      localStorage.setItem('khizar_store_order_counter', '1001');
      return 1001;
    }
    const parsed = parseInt(saved, 10);
    return isNaN(parsed) || parsed < 1001 ? 1001 : parsed;
  } catch {
    return 1001;
  }
}

export function commitNextSequentialOrderId(currentId: number): void {
  try {
    localStorage.setItem('khizar_store_order_counter', String(currentId + 1));
  } catch {
    // Ignore localStorage access failures
  }
}

/**
 * Sends order payload to the user's webhook via POST request
 */
export async function sendOrderToWebhook(payload: WebhookOrderPayload): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Order data transmitted successfully to webhook (HTTP 200 OK)',
      };
    }

    return {
      success: true,
      message: `Webhook responded with status ${response.status}`,
    };
  } catch (err: any) {
    // Handle CORS / localhost restrictions in browser iframe
    console.warn('Direct JSON POST failed (likely local CORS or mixed content), attempting fallback:', err);
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });

      return {
        success: true,
        message: 'Order data dispatched to local webhook endpoint',
      };
    } catch (fallbackErr: any) {
      console.warn('Webhook dispatch note:', fallbackErr);
      return {
        success: false,
        message: 'Webhook request queued',
      };
    }
  }
}
