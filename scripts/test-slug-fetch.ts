
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

console.log(`URL: ${WOO_URL}`);
console.log(`CK: ${CK ? CK.substring(0, 5) + '...' : 'MISSING'}`);
console.log(`CS: ${CS ? CS.substring(0, 5) + '...' : 'MISSING'}`);

const auth = Buffer.from(`${CK}:${CS}`).toString('base64');

async function testFetch() {
    const slug = "zapatilla-world-tokio-azul-verde";
    const endpoint = "products";
    const url = new URL(`${WOO_URL}/wp-json/wc/v3/${endpoint}`);
    url.searchParams.append("consumer_key", CK);
    url.searchParams.append("consumer_secret", CS);
    url.searchParams.append("slug", slug);

    console.log(`Fetching: ${url.toString().replace(CK, '***').replace(CS, '***')}`);

    try {
        const response = await fetch(url.toString(), {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (!response.ok) {
            console.log(`FAILED: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(`Body: ${text}`);
            return;
        }

        const data = await response.json();
        console.log(`SUCCESS: Found ${data.length} items.`);
        if (data.length > 0) {
            console.log(`Product ID: ${data[0].id}`);
            console.log(`Product Name: ${data[0].name}`);
        } else {
            console.log("Product not found (empty array).");
        }
    } catch (error) {
        console.error("FETCH ERROR:", error);
        if (error.cause) console.error("Cause:", error.cause);
    }
}

testFetch();
