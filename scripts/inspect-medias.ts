
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

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

async function inspectMedias() {
    const ids = [3944, 3929, 3912];

    for (const id of ids) {
        console.log(`\nInspecting Product ID: ${id}...`);
        const p = await fetchWoo(`products/${id}`);
        console.log(`Name: ${p.name} | Type: ${p.type}`);

        const tallas = p.attributes.find(a => a.name.toLowerCase() === 'tallas' || a.name.toLowerCase() === 'talla');
        if (tallas) {
            console.log(`Attribute 'Tallas':`);
            console.log(`  - Variation: ${tallas.variation}`);
            console.log(`  - Options: ${JSON.stringify(tallas.options)}`);
        } else {
            console.log("Attribute 'Tallas' NOT found.");
        }

        const variations = await fetchWoo(`products/${id}/variations`);
        console.log(`Variations found: ${variations.length}`);
    }
}

inspectMedias().catch(console.error);
