import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default function robots(): MetadataRoute.Robots {
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saprix.com.co';

    // Sanitize baseUrl: use new URL().origin to ensure a clean base without slashes or query params
    try {
        baseUrl = new URL(baseUrl).origin;
    } catch (e) {
        baseUrl = 'https://saprix.com.co';
    }

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout/', '/mapeo-secreto/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
