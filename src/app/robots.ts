import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://zanoo.com.ar'; // Replace with your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Example of disallowed route
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
