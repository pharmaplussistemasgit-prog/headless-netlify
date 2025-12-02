
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

async function fixProduct(id, attributeName, attributeValue) {
    console.log(`\nFixing Product ID: ${id} (Attr: ${attributeName}, Value: ${attributeValue})...`);

    try {
        // 1. Get current attributes
        const product = await fetchWoo(`products/${id}`);
        const attributes = product.attributes.map(a => {
            if (a.name.toLowerCase() === attributeName.toLowerCase()) {
                return { ...a, variation: true }; // Enable variation
            }
            return a;
        });

        // 2. Update parent product attributes
        console.log("Updating parent attributes...");
        await fetchWoo(`products/${id}`, 'PUT', { attributes });

        // 3. Get variations
        const variations = await fetchWoo(`products/${id}/variations`, 'GET');
        console.log(`Updating ${variations.length} variations...`);

        // 4. Update each variation
        for (const v of variations) {
            const currentAttrs = v.attributes || [];

            // Check if attribute is already there
            const hasAttr = currentAttrs.some(a => a.name.toLowerCase() === attributeName.toLowerCase());

            if (!hasAttr) {
                const targetAttr = attributes.find(a => a.name.toLowerCase() === attributeName.toLowerCase());

                const newAttrs = [
                    ...currentAttrs,
                    {
                        id: targetAttr.id,
                        name: targetAttr.name,
                        option: attributeValue
                    }
                ];

                await fetchWoo(`products/${id}/variations/${v.id}`, 'PUT', {
                    attributes: newAttrs
                });
                console.log(`  - Updated Variation ${v.id}`);
            } else {
                console.log(`  - Variation ${v.id} already has ${attributeName}.`);
            }
        }
    } catch (error) {
        console.error(`Failed to fix product ${id}: ${error.message}`);
    }
}

async function runFix() {
    // Fix Medias - All seem to have "10-12" as the option based on inspection
    const fixes = [
        { id: 3944, attr: 'Tallas', val: '10-12' },
        { id: 3929, attr: 'Tallas', val: '10-12' },
        { id: 3912, attr: 'Tallas', val: '10-12' }
    ];

    for (const fix of fixes) {
        await fixProduct(fix.id, fix.attr, fix.val);
    }

    console.log("\n--------------------------------------------------");
    console.log("Medias Fix process complete.");
    console.log("--------------------------------------------------");
}

runFix().catch(console.error);
