
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Get env vars
const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!CK || !CS) {
    console.error("Error: WOOCOMMERCE_CONSUMER_KEY or WOOCOMMERCE_CONSUMER_SECRET not found in .env.local");
    process.exit(1);
}

const auth = Buffer.from(`${CK}:${CS}`).toString('base64');

async function fetchWoo(endpoint, params = {}) {
    const url = new URL(`${WOO_URL}/wp-json/wc/v3/${endpoint}`);

    url.searchParams.append("consumer_key", CK);
    url.searchParams.append("consumer_secret", CS);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    console.log(`Fetching: ${url.toString()}`);

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Basic ${auth}`,
            'User-Agent': 'Saprix-Inventory-Script/1.0'
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error fetching ${endpoint}: ${response.status} ${response.statusText} - ${text.substring(0, 200)}`);
    }

    const data = await response.json();
    const totalPages = response.headers.get('x-wp-totalpages') || '1';

    console.log(`Response status: ${response.status}, Data length: ${Array.isArray(data) ? data.length : 'Not array'}`);

    return { data, totalPages: parseInt(totalPages) };
}

async function fetchAllProducts() {
    let page = 1;
    let allProducts = [];
    let totalPages = 1;

    console.log("Fetching products...");

    do {
        try {
            const { data, totalPages: total } = await fetchWoo("products", {
                per_page: 50,
                page: page,
                status: 'publish'
            });

            totalPages = total;
            console.log(`Fetched page ${page} of ${totalPages} (${data.length} products)`);

            allProducts = [...allProducts, ...data];
            page++;
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    } while (page <= totalPages);

    return allProducts;
}

async function fetchVariations(productId) {
    try {
        const { data } = await fetchWoo(`products/${productId}/variations`, {
            per_page: 100
        });
        return data || [];
    } catch (error) {
        console.error(`Error fetching variations for product ${productId}:`, error);
        return [];
    }
}

async function generateReport() {
    const products = await fetchAllProducts();
    console.log(`Total products fetched: ${products.length}`);

    // CSV Header
    let csv = "ID,Nombre,Categoría,Precio,Stock Total,Detalle Variaciones\n";

    for (const p of products) {
        const category = p.categories.map(c => c.name).join(" - ");
        const price = p.price ? p.price : '0';

        let stockInfo = "";
        let variationsInfo = "";

        if (p.type === 'variable') {
            const variations = await fetchVariations(p.id);
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

        // Escape quotes and wrap in quotes for CSV safety
        const cleanName = `"${p.name.replace(/"/g, '""')}"`;
        const cleanCat = `"${category.replace(/"/g, '""')}"`;
        const cleanVar = `"${variationsInfo.replace(/"/g, '""')}"`;

        csv += `${p.id},${cleanName},${cleanCat},${price},${stockInfo},${cleanVar}\n`;
    }

    const outputPath = path.join(process.cwd(), 'INVENTORY_REPORT.csv');
    fs.writeFileSync(outputPath, csv);
    console.log(`Report generated at: ${outputPath}`);
}

generateReport().catch(console.error);
