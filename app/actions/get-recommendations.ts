'use server';

import { getProducts } from "@/lib/woocommerce";

// Map of Cart Categories -> Complementary Categories/Terms
// Adjust these IDs based on actual WooCommerce Category IDs
const SMART_RULES: Record<string, { term: string, catId?: string }> = {
    // 1. Nutrición (ID 6) - Ejemplo: Glucerna
    '6': { term: 'glucometro', catId: '' },

    // 2. Bebés (ID 3) -> Sugerir Pañales o Cremas
    '3': { term: 'pañales', catId: '' },

    // 3. Medicamentos (ID 1) -> Sugerir Vitaminas/Defensas
    '1': { term: 'vitamina', catId: '' },

    // 4. Cuidado Piel (ID 2) -> Sugerir Bloqueador
    '2': { term: 'bloqueador', catId: '' },

    // 5. Aseo Personal (ID 4) -> Sugerir Algodón
    '4': { term: 'algodón', catId: '' },

    // Legacy Fallbacks
    '20': { term: 'vitamina', catId: '' }, // Fallback ID legacy
    '25': { term: 'algodón', catId: '' },
    '30': { term: 'bloqueador', catId: '' },
};

export async function getSmartRecommendations(cartCategoryIds: string[]) {
    try {
        console.log("🧠 Cerebro Server: Received IDs:", cartCategoryIds);
        let strategy: { term: string, catId?: string } = { term: '', catId: '' };

        // 1. Find first matching rule
        for (const catId of cartCategoryIds) {
            if (SMART_RULES[catId]) {
                strategy = SMART_RULES[catId];
                console.log("🧠 Cerebro Server: Matched Rule for ID", catId, strategy);
                break;
            }
        }

        // 2. Fetch based on strategy
        if (strategy.term || strategy.catId) {
            const res = await getProducts({
                search: strategy.term,
                category: strategy.catId,
                perPage: 8,
                orderby: 'popularity'
            });
            if (res.products.length > 0) return res.products;
        }

        // 3. Fallback: Featured -> Popular
        console.log("🧠 Cerebro Server: No rule matched or empty result. Trying Featured.");
        const featured = await getProducts({ perPage: 8, featured: true, orderby: 'popularity' });

        if (featured.products.length > 0) {
            return featured.products;
        }

        console.log("🧠 Cerebro Server: No Featured found. Fetching General Popular.");
        const general = await getProducts({ perPage: 8, orderby: 'popularity' });
        return general.products;

    } catch (error) {
        console.error("Smart Recommendations Error:", error);
        return [];
    }
}
