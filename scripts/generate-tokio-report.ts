
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

async function generateTokioReport() {
    const products = await fetchWoo("products", { search: "Tokio", per_page: 20 });

    let csv = "ID,Nombre,Stock Total,Detalle Variaciones (Ahora incluye Color)\n";

    for (const p of products) {
        let stockInfo = "";
        let variationsInfo = "";

        if (p.type === 'variable') {
            const variations = await fetchWoo(`products/${p.id}/variations`, { per_page: 100 });
            let totalStock = 0;
            let varDetails = [];

            for (const v of variations) {
                const attributes = v.attributes.map(a => `${a.name}: ${a.option}`).join(" ");
                const vStock = v.manage_stock ? v.stock_quantity : (v.stock_status === 'instock' ? 'En Stock' : 'Agotado');
                if (typeof vStock === 'number') totalStock += vStock;

                varDetails.push(`[${attributes}: ${vStock}]`);
            }
            stockInfo = totalStock > 0 ? String(totalStock) : "Variable";
            variationsInfo = varDetails.join(" | ");
        } else {
            stockInfo = p.manage_stock ? String(p.stock_quantity) : (p.stock_status === 'instock' ? 'En Stock' : 'Agotado');
            variationsInfo = "N/A";
        }

        const cleanName = `"${p.name.replace(/"/g, '""')}"`;
        const cleanVar = `"${variationsInfo.replace(/"/g, '""')}"`;

        csv += `${p.id},${cleanName},${stockInfo},${cleanVar}\n`;
    }

    const outputPath = path.join(process.cwd(), 'TOKIO_REPORT.csv');
    fs.writeFileSync(outputPath, csv);
    console.log(`Report generated at: ${outputPath}`);
}

generateTokioReport().catch(console.error);
