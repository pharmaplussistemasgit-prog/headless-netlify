
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

async function auditMappings() {
    console.log("Starting full product mapping audit...");

    let page = 1;
    let allProducts = [];

    // Fetch all products
    while (true) {
        console.log(`Fetching page ${page}...`);
        const products = await fetchWoo("products", { per_page: 50, page: page });
        if (products.length === 0) break;
        allProducts = [...allProducts, ...products];
        page++;
    }

    console.log(`Scanned ${allProducts.length} products.`);

    let issues = [];

    for (const p of allProducts) {
        if (p.type === 'variable') {
            // Check 1: Does it have attributes used for variations?
            const variationAttributes = p.attributes.filter(a => a.variation);
            if (variationAttributes.length === 0) {
                issues.push({
                    id: p.id,
                    name: p.name,
                    issue: "Variable product has NO attributes marked for variation."
                });
                continue;
            }

            // Check 2: Fetch variations and check consistency
            const variations = await fetchWoo(`products/${p.id}/variations`, { per_page: 100 });

            if (variations.length === 0) {
                issues.push({
                    id: p.id,
                    name: p.name,
                    issue: "Variable product has NO variations created."
                });
            } else {
                for (const v of variations) {
                    // Check 3: Does variation have all required attributes?
                    if (v.attributes.length !== variationAttributes.length) {
                        issues.push({
                            id: p.id,
                            name: p.name,
                            issue: `Variation ${v.id} is missing attributes. Expected ${variationAttributes.length}, found ${v.attributes.length}.`
                        });
                    }

                    // Check 4: Stock consistency
                    if (v.manage_stock && v.stock_quantity === null) {
                        issues.push({
                            id: p.id,
                            name: p.name,
                            issue: `Variation ${v.id} has manage_stock=true but null stock_quantity.`
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

    const outputPath = path.join(process.cwd(), 'MAPPING_AUDIT_REPORT.csv');
    fs.writeFileSync(outputPath, csv);

    console.log("\n--------------------------------------------------");
    console.log(`Audit Complete. Found ${issues.length} issues.`);
    console.log(`Report saved to: ${outputPath}`);
    console.log("--------------------------------------------------");
}

auditMappings().catch(console.error);
