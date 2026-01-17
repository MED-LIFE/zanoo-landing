import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://zanoo.com.ar'; // Replace with your actual domain

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Add more dynamic routes here if/when you have them
        // {
        //   url: `${baseUrl}/blog`,
        //   lastModified: new Date(),
        //   changeFrequency: 'daily',
        //   priority: 0.8,
        // },
    ];
}
