import { getWooApi } from "./woocommerce";
import { unstable_cache } from "next/cache";

// Tipos definidos explícitamente para el Frontend
export interface ShippingMethod {
    id: string;
    title: string;
    cost: number;
    description?: string;
}

export interface ShippingRule {
    zoneId: number;
    zoneName: string;
    locations: string[]; // Códigos ISO (ej: CO-ANT)
    methods: ShippingMethod[];
}

/**
 * Servicio de envío optimizado (WooSync).
 * Obtiene reglas de WooCommerce y las estructura para consumo rápido en el Front.
 */
export const getShippingRates = unstable_cache(
    async (): Promise<ShippingRule[]> => {
        try {
            const api = getWooApi();
            console.log("🚚 [WooSync] Getting Shipping Zones...");

            // 1. Obtener todas las zonas
            const { data: zones } = await api.get("shipping/zones");

            const rules: ShippingRule[] = [];

            // 2. Procesar cada zona en paralelo para mayor velocidad en el build/ISR
            await Promise.all(zones.map(async (zone: any) => {
                const zoneId = zone.id;

                // Fetch de locations y methods en paralelo
                const [locationsRes, methodsRes] = await Promise.all([
                    api.get(`shipping/zones/${zoneId}/locations`),
                    api.get(`shipping/zones/${zoneId}/methods`)
                ]);

                const locations = locationsRes.data.map((l: any) => l.code).filter(Boolean);
                const rawMethods = methodsRes.data;

                const methods: ShippingMethod[] = rawMethods
                    .filter((m: any) => m.enabled)
                    .map((m: any) => {
                        // Extracción robusta del costo
                        // Puede venir en 'cost' (flat_rate) o 'min_amount' (free_shipping) o nulo
                        let finalCost = 0;
                        const settings = m.settings || {};

                        if (settings.cost && settings.cost.value !== undefined) {
                            finalCost = parseInt(settings.cost.value, 10);
                        } else if (m.method_id === 'free_shipping') {
                            finalCost = 0;
                        }

                        // Parsear titulo inteligente
                        // Si el titulo es "Envio Nacional", dejarlo asi.
                        return {
                            id: m.id.toString(),
                            title: m.title || m.method_title || "Envío Estándar",
                            cost: isNaN(finalCost) ? 0 : finalCost,
                            description: m.method_description || "" // A veces Woo no da esto 
                        };
                    });

                if (methods.length > 0) {
                    rules.push({
                        zoneId: zoneId,
                        zoneName: zone.name,
                        locations: locations, // ['CO-ANT', 'CO-DC', ...]
                        methods: methods
                    });
                }
            }));

            // 3. Zona Resto del Mundo / Default (Zone ID 0)
            // Esta no sale en el endpoint shipping/zones, toca consultarla directo
            try {
                const { data: defaultMethods } = await api.get(`shipping/zones/0/methods`);
                const activeDefaults = defaultMethods.filter((m: any) => m.enabled);

                if (activeDefaults.length > 0) {
                    const methods = activeDefaults.map((m: any) => {
                        const settings = m.settings || {};
                        let finalCost = 0;
                        if (settings.cost?.value) finalCost = parseInt(settings.cost.value, 10);

                        return {
                            id: m.id.toString(),
                            title: m.title || "Envío Nacional",
                            cost: isNaN(finalCost) ? 0 : finalCost,
                            description: "Resto del país"
                        };
                    });

                    rules.push({
                        zoneId: 0,
                        zoneName: "Resto del País (Default)",
                        locations: [], // Empty locations means "match anything else"
                        methods: methods
                    });
                }
            } catch (err) {
                console.warn("⚠️ [WooSync] No default zone methods found or error:", err);
            }

            console.log(`✅ [WooSync] Rates Synced! ${rules.length} zones found.`);
            return rules;

        } catch (error) {
            console.error("❌ [WooSync] Critical Error fetching rates:", error);
            // Retornar array vacío para no romper la UI, el componente mostrará estado "Sin conexión"
            return [];
        }
    },
    ["shipping-rates-v2"], // Nueva cache key para purgar la anterior
    { revalidate: 60 } // Revalidar cada minuto para testing rápido (en prod debería ser 3600)
);
