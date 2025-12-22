import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default function robots(): MetadataRoute.Robots {
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saprix.com.co';

    // Sanitize baseUrl: Remove ALL trailing slashes and any query parameters
    baseUrl = baseUrl.replace(/\/+$/, '').split('?')[0].trim();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout/', '/mapeo-secreto/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
