import type { Context } from "@netlify/edge-functions";

/**
 * Netlify Edge Function - Geolocalización
 * 
 * Agrega información de geolocalización del usuario en los headers
 * para personalización de contenido basada en ubicación.
 * 
 * Esta función se ejecuta en el edge (más cercano al usuario)
 * para mínima latencia.
 */

export default async (request: Request, context: Context) => {
    // Obtener información de geolocalización del contexto de Netlify
    const country = context.geo?.country?.code || "CO";
    const city = context.geo?.city || "Bogotá";
    const region = context.geo?.subdivision?.name || "";
    const latitude = context.geo?.latitude;
    const longitude = context.geo?.longitude;

    console.log("🌍 Geolocation detected:", {
        country,
        city,
        region,
        coords: latitude && longitude ? `${latitude},${longitude}` : "unknown"
    });

    // Continuar con la request normal
    const response = await context.next();

    // Agregar headers con información de geolocalización
    // Estos headers estarán disponibles en el cliente
    response.headers.set("X-User-Country", country);
    response.headers.set("X-User-City", city);

    if (region) {
        response.headers.set("X-User-Region", region);
    }

    if (latitude && longitude) {
        response.headers.set("X-User-Coords", `${latitude},${longitude}`);
    }

    return response;
};

// Configuración de la edge function
export const config = {
    path: "/*", // Aplicar a todas las rutas
    // excludedPath: ["/api/*", "/_next/*"], // Opcional: excluir rutas
};
