
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

const auth = Buffer.from(`${CK}:${CS}`).toString('base64');

async function fetchWoo(endpoint, method = 'GET', body = null) {
    const url = new URL(`${WOO_URL}/wp-json/wc/v3/${endpoint}`);
    url.searchParams.append("consumer_key", CK);
    url.searchParams.append("consumer_secret", CS);

    const options = {
        method,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url.toString(), options);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
    }
    return await response.json();
}

const STOCK_DATA = {
    "34": 10,
    "35": 0,
    "36": 23,
    "37": 0,
    "38": 11,
    "39": 0,
    "40": 20,
    "41": 3,
    "42": 23
};

async function updateStock() {
    const productId = 9011; // Zapatilla World Tokio - Azul + Verde
    console.log(`Updating stock for Product ID: ${productId}...`);

    const variations = await fetchWoo(`products/${productId}/variations`, 'GET', null);
    console.log(`Found ${variations.length} variations.`);

    for (const v of variations) {
        // Find the size attribute
        const sizeAttr = v.attributes.find(a => a.name.toLowerCase() === 'tallas');
        if (!sizeAttr) {
            console.log(`Skipping variation ${v.id} (no size attribute found)`);
            continue;
        }

        const size = sizeAttr.option;
        if (STOCK_DATA.hasOwnProperty(size)) {
            const quantity = STOCK_DATA[size];
            console.log(`Updating Size ${size} (Var ID: ${v.id}) to ${quantity} units...`);

            await fetchWoo(`products/${productId}/variations/${v.id}`, 'PUT', {
                manage_stock: true,
                stock_quantity: quantity,
                stock_status: quantity > 0 ? 'instock' : 'outofstock'
            });
        } else {
            console.log(`Size ${size} not in update list.`);
        }
    }
    console.log("Stock update complete.");
}

updateStock().catch(console.error);
