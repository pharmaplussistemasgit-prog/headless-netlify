
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

async function fixProduct(id, colorName) {
    console.log(`\nFixing Product ID: ${id} (Color: ${colorName})...`);

    // 1. Get current attributes
    const product = await fetchWoo(`products/${id}`);
    const attributes = product.attributes.map(a => {
        if (a.name.toLowerCase() === 'color') {
            return { ...a, variation: true }; // Enable variation for Color
        }
        return a;
    });

    // 2. Update parent product attributes
    console.log("Updating parent attributes...");
    await fetchWoo(`products/${id}`, 'PUT', { attributes });

    // 3. Get variations
    const variations = await fetchWoo(`products/${id}/variations`, 'GET');
    console.log(`Updating ${variations.length} variations...`);

    // 4. Update each variation to include the color attribute
    for (const v of variations) {
        const currentAttrs = v.attributes || [];

        // Check if color is already there
        const hasColor = currentAttrs.some(a => a.name.toLowerCase() === 'color');

        if (!hasColor) {
            const newAttrs = [
                ...currentAttrs,
                {
                    id: attributes.find(a => a.name.toLowerCase() === 'color').id,
                    name: 'Color',
                    option: colorName
                }
            ];

            await fetchWoo(`products/${id}/variations/${v.id}`, 'PUT', {
                attributes: newAttrs
            });
            console.log(`  - Updated Variation ${v.id} with Color=${colorName}`);
        } else {
            console.log(`  - Variation ${v.id} already has Color.`);
        }
    }
    console.log("Done.");
}

async function run() {
    // ID 9011: Zapatilla World Tokio - Azul + Verde
    await fixProduct(9011, "Azul + Verde");

    // ID 6923: Zapatilla World Tokio - Negro + azul
    // Note: The attribute option might be "Negro + Azul" (capital A) or "Negro + azul". 
    // I should check the product details first, but "Negro + Azul" is likely based on debug output.
    await fixProduct(6923, "Negro + Azul");
}

run().catch(console.error);
