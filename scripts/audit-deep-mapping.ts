
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

async function deepAudit() {
    console.log("Starting DEEP product mapping audit...");

    let page = 1;
    let allProducts = [];

    // Fetch all products
    while (true) {
        process.stdout.write(`Fetching page ${page}... `);
        const products = await fetchWoo("products", { per_page: 50, page: page });
        if (products.length === 0) {
            console.log("Done.");
            break;
        }
        console.log(`Got ${products.length} products.`);
        allProducts = [...allProducts, ...products];
        page++;
    }

    console.log(`Analyzing ${allProducts.length} products...`);

    let issues = [];

    for (const p of allProducts) {
        // Only care about variable products for mapping issues usually
        if (p.type === 'variable') {

            // 1. Check for empty variations
            if (p.variations.length === 0) {
                // We need to double check if they really have no variations by fetching (sometimes the array in product object is empty but they exist? No, usually it has IDs)
                // Let's trust the product object first, but fetching variations is safer.
            }

            // 2. Attribute Mapping Checks
            const colorAttr = p.attributes.find(a => a.name.toLowerCase() === 'color');
            const sizeAttr = p.attributes.find(a => a.name.toLowerCase() === 'tallas' || a.name.toLowerCase() === 'talla');

            if (colorAttr && !colorAttr.variation) {
                issues.push({
                    id: p.id,
                    name: p.name,
                    issue: `Attribute 'Color' exists but is NOT used for variation.`
                });
            }

            if (sizeAttr && !sizeAttr.variation) {
                issues.push({
                    id: p.id,
                    name: p.name,
                    issue: `Attribute 'Tallas' exists but is NOT used for variation.`
                });
            }

            // 3. Fetch Variations for Deep Check
            const variations = await fetchWoo(`products/${p.id}/variations`, { per_page: 100 });

            if (variations.length === 0) {
                issues.push({
                    id: p.id,
                    name: p.name,
                    issue: "CRITICAL: Variable product has NO variations created."
                });
            } else {
                for (const v of variations) {
                    // Price Check
                    if (!v.price && !v.regular_price) {
                        issues.push({
                            id: p.id,
                            name: p.name,
                            issue: `Variation ${v.id} has NO PRICE.`
                        });
                    }

                    // Stock Check
                    if (v.manage_stock && v.stock_quantity === null) {
                        issues.push({
                            id: p.id,
                            name: p.name,
                            issue: `Variation ${v.id} has manage_stock=true but null stock.`
                        });
                    }
                }
            }
        }
    }

    // Generate Report
    let csv = "ID,Nombre,Problema Detectado\n";
    issues.forEach(i => {
        csv += `${i.id},"${i.name.replace(/"/g, '""')}","${i.issue}"\n`;
    });

    const outputPath = path.join(process.cwd(), 'DEEP_AUDIT_REPORT.csv');
    fs.writeFileSync(outputPath, csv);

    console.log("\n--------------------------------------------------");
    console.log(`Deep Audit Complete. Found ${issues.length} issues.`);
    console.log(`Report saved to: ${outputPath}`);
    console.log("--------------------------------------------------");
}

deepAudit().catch(console.error);
