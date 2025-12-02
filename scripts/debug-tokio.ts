
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!CK || !CS) {
    console.error("Error: Credentials not found.");
    process.exit(1);
}

const auth = Buffer.from(`${CK}:${CS}`).toString('base64');

async function fetchWoo(endpoint, params = {}) {
    const url = new URL(`${WOO_URL}/wp-json/wc/v3/${endpoint}`);
    url.searchParams.append("consumer_key", CK);
    url.searchParams.append("consumer_secret", CS);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Basic ${auth}` }
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
}

async function debugTokio() {
    console.log("Searching for 'Tokio' products...");
    const products = await fetchWoo("products", { search: "Tokio", per_page: 20 });

    console.log(`Found ${products.length} products.`);

    for (const p of products) {
        console.log(`\n--------------------------------------------------`);
        console.log(`ID: ${p.id} | Name: ${p.name} | Type: ${p.type}`);
        console.log(`Attributes:`);
        p.attributes.forEach(a => {
            console.log(`  - ${a.name} (id: ${a.id}, variation: ${a.variation}): [${a.options.join(", ")}]`);
        });

        if (p.type === 'variable') {
            console.log(`Fetching variations...`);
            const variations = await fetchWoo(`products/${p.id}/variations`, { per_page: 100 });
            console.log(`Found ${variations.length} variations.`);

            variations.forEach(v => {
                const attrs = v.attributes.map(a => `${a.name}=${a.option}`).join(", ");
                console.log(`  - Var ID: ${v.id} | Stock: ${v.stock_quantity} | Attrs: ${attrs}`);
            });
        }
    }
}

debugTokio().catch(console.error);
