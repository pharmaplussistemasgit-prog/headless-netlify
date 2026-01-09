'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import RecommendedSection from '@/components/home/RecommendedSection';
import { getSmartRecommendations } from '@/app/actions/get-recommendations';
// Import WooProduct type if needed for strict typing, or use any for flexibility with mapped products

export default function SmartCrossSell() {
    const { items } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchRecommendations() {
            if (items.length === 0) {
                // If cart empty, maybe show popular? Or show nothing?
                // Let's show generic popular for "impulse buy"
                const res = await getSmartRecommendations([]);
                if (isMounted) setProducts(res);
                setLoading(false);
                return;
            }

            // Extract unique Category IDs from cart items
            // Assuming item.categories is array of {id, name, slug}
            const cartCatIds = new Set<string>();
            items.forEach(item => {
                // Check multiple possible structures depending on mapping
                const cats = (item as any).categories || [];
                cats.forEach((c: any) => cartCatIds.add(String(c.id)));
            });

            const uniqueIds = Array.from(cartCatIds);
            console.log("🧠 SmartEngine: Cart Content", { items: items.length, ids: uniqueIds });

            const res = await getSmartRecommendations(uniqueIds);
            console.log("🧠 SmartEngine: Server Response", res?.length || 0, "products");

            if (isMounted) {
                setProducts(res);
                setLoading(false);
            }
        }

        fetchRecommendations();

        return () => { isMounted = false; };
    }, [items]); // Re-run when cart items change

    if (loading) return <div className="h-96 w-full animate-pulse bg-gray-100 rounded-3xl" />;

    // DEBUG: Show if products are empty
    if (products.length === 0) {
        console.warn("🧠 SmartEngine: NO PRODUCTS returned. Section will be hidden.");
        return null;
    }

    return (
        <RecommendedSection
            products={products}
            title={
                <span>
                    <span className="text-[var(--color-pharma-blue)] italic font-bold">Complementa tu compra </span>
                    <span className="text-[var(--color-pharma-green)] font-extrabold">con...</span>
                </span>
            }
        />
    );
}
