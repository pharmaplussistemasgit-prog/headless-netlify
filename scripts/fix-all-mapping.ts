
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

        if (variations.length === 0) {
            console.log("WARNING: No variations found to update.");
            return;
        }

        console.log(`Updating ${variations.length} variations...`);

        // 4. Update each variation
        for (const v of variations) {
            const currentAttrs = v.attributes || [];

            // Check if attribute is already there
            const hasAttr = currentAttrs.some(a => a.name.toLowerCase() === attributeName.toLowerCase());

            if (!hasAttr) {
                const targetAttr = attributes.find(a => a.name.toLowerCase() === attributeName.toLowerCase());
                if (!targetAttr) {
                    console.log(`Error: Attribute ${attributeName} not found in parent.`);
                    continue;
                }

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
    // List of issues from audit report
    const fixes = [
        { id: 6865, attr: 'Color', val: 'Azul oscuro + Celeste' }, // Guessing value based on name
        { id: 6901, attr: 'Color', val: 'Verde jade' },
        { id: 6912, attr: 'Color', val: 'Blanco + Fucsia' },
        { id: 8814, attr: 'Color', val: 'Rojo' },
        { id: 8804, attr: 'Color', val: 'Blanco + Azul' },
        { id: 8764, attr: 'Color', val: 'Verde Neón' },
        { id: 8733, attr: 'Color', val: 'Azul + Verde' },
        { id: 6982, attr: 'Color', val: 'Blanco + Azul' },
        { id: 6972, attr: 'Color', val: 'Negro + Neón' },
        { id: 6942, attr: 'Color', val: 'Rojo' },
        { id: 6889, attr: 'Color', val: 'Blanco + azul' }, // Also has no variations, need to handle separately?
        { id: 6878, attr: 'Color', val: 'Negro + Verde' },
        // Medias issues (Tallas missing)
        // For socks, usually size is 'Única' or specific range. 
        // I'll skip fixing Medias automatically because I don't know the correct Size value to assign.
        // I will focus on Zapatillas (Color) which is clear from the title.
    ];

    for (const fix of fixes) {
        await fixProduct(fix.id, fix.attr, fix.val);
    }

    console.log("\n--------------------------------------------------");
    console.log("Fix process complete.");
    console.log("Note: Product 6889 might still need manual variation creation if it had 0 variations.");
    console.log("Note: Medias (Socks) were skipped as I cannot infer the correct size.");
    console.log("--------------------------------------------------");
}

runFix().catch(console.error);
