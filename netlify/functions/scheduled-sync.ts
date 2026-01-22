import { schedule } from "@netlify/functions";

/**
 * Netlify Scheduled Function - Sync Products
 * Reemplazo del Vercel Cron Job (/api/cron/sync)
 * 
 * Ejecuta diariamente a las 2 AM para sincronizar productos con WooCommerce
 * 
 * Configuración en netlify.toml:
 * [functions."scheduled-sync"]
 *   schedule = "0 2 * * *"
 */

export const handler = schedule("0 2 * * *", async (event) => {
  console.log("🔄 Starting scheduled sync at:", new Date().toISOString());

  try {
    // Obtener la URL del sitio desde variables de entorno
    const siteUrl = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const syncUrl = `${siteUrl}/api/sync-products`;

    console.log("📡 Calling sync endpoint:", syncUrl);

    // Llamar al endpoint de sincronización
    const response = await fetch(syncUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Agregar header de autenticación si es necesario
        ...(process.env.CRON_SECRET && {
          "Authorization": `Bearer ${process.env.CRON_SECRET}`
        })
      },
    });

    if (!response.ok) {
      throw new Error(`Sync endpoint returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log("✅ Sync completed successfully:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Scheduled sync executed successfully",
        syncResult: result,
        timestamp: new Date().toISOString(),
      }),
    };

  } catch (error: any) {
    console.error("❌ Scheduled sync failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Scheduled sync failed",
        message: error?.message || "Unknown error",
        timestamp: new Date().toISOString(),
      }),
    };
  }
});
