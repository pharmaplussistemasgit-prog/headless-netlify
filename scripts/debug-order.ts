
import { getWooApi } from '../lib/woocommerce';

const WOO_URL = "https://pagos.saprix.com.co";
const CK = "ck_88721898d82f29e0f8664d7e3316aa460340f587";
const CS = "cs_37ebd5161dd1ed62e199570e702fb7d123454569";

async function fetchOrder(orderId: number) {
    try {
        const auth = Buffer.from(`${CK}:${CS}`).toString('base64');
        const response = await fetch(`${WOO_URL}/wp-json/wc/v3/orders/${orderId}`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        if (!response.ok) {
            console.error('Error fetching order:', response.status, response.statusText);
            const text = await response.text();
            console.error('Body:', text);
            return;
        }

        const order = await response.json();
        console.log('Order ID:', order.id);
        console.log('Payment URL:', order.payment_url);
        console.log('Status:', order.status);
        console.log('Order Key:', order.order_key);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchOrder(9744);
