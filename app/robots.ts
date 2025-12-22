import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saprix.com.co';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout/', '/mapeo-secreto/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
