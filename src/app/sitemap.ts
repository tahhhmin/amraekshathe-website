// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { connectDB } from '@/config/connectDB';
import Organization, { IOrganization } from '@/models/Organisation';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Static pages in your application
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl, // Your homepage
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/organizations`, // Your organizations list page
            lastModified: new Date(),
            changeFrequency: 'hourly', // Update frequently if organizations are added often
            priority: 0.9,
        },
        // Add other static pages here (e.g., /about, /contact)
        // {
        //     url: `${baseUrl}/about`,
        //     lastModified: new Date(),
        //     changeFrequency: 'monthly',
        //     priority: 0.7,
        // },
    ];

    // Dynamic organization profile pages
    await connectDB();
    const organizations: IOrganization[] = await Organization.find({}, 'slug').lean(); // Fetch only slugs

    const organizationRoutes: MetadataRoute.Sitemap = organizations.map((org) => ({
        url: `${baseUrl}/organizations/${org.slug}`,
        lastModified: new Date(), // Consider adding a 'lastUpdatedAt' field to your schema for more accuracy
        changeFrequency: 'monthly', // Adjust based on how often organization profiles are updated
        priority: 0.8,
    }));

    return [...staticRoutes, ...organizationRoutes];
}