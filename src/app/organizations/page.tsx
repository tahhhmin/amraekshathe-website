// src/app/organizations/page.tsx

import Link from 'next/link';
import PublicProfile from '@/components/public/organisationProfile'; // Assuming this path
import styles from './page.module.css'; // Adjust path if needed

// === IMPORTANT FOR FRESH DATA ===
// This line forces the page to be dynamic, meaning it will re-fetch data on every request.
// This is great for development to see immediate changes.
// For production, you might switch to `revalidate = 60` (or another number) for time-based revalidation,
// or use `revalidatePath('/organizations')` after CUD operations (Create, Update, Delete) on your data.
export const dynamic = 'force-dynamic';
// === END IMPORTANT ===

export interface OrganizationForCard {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    imageUrl?: string;
    location: string;
    category?: string;
    tags?: string[];
}

// Type for the API response structure
interface ApiOrganizationResponse {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    imageUrl?: string;
    location: string;
    category?: string;
    tags?: string[];
}

async function getOrganizations(): Promise<OrganizationForCard[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // Use NEXT_PUBLIC_BASE_URL
        if (!baseUrl) {
            console.error("NEXT_PUBLIC_BASE_URL is not defined.");
            // Handle this error appropriately, maybe redirect or show a user-friendly message
            // For now, let's just return empty array and log
            return [];
        }

        // Fetch organizations from your API route
        const res = await fetch(`${baseUrl}/api/fetch/fetchOrganisation`, {
            // Using 'no-store' cache control to ensure no caching by fetch itself
            // 'force-dynamic' export above handles the page-level caching.
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error(`API Error fetching organizations (${res.status}):`, errorData.message);
            throw new Error(errorData.message || `Failed to fetch organizations: ${res.statusText}`);
        }

        const data: ApiOrganizationResponse[] = await res.json();
        console.log("Raw data received by page from API:", data); // Log the raw data

        // Map the API response to your OrganizationForCard interface
        // FIXED: Use the already mapped field names from the API response
        const organizations: OrganizationForCard[] = data.map((org: ApiOrganizationResponse) => ({
            _id: org.id, // API returns 'id', but interface expects '_id'
            name: org.name,
            slug: org.slug,
            shortDescription: org.shortDescription,
            imageUrl: org.imageUrl,
            location: org.location,
            category: org.category,
            tags: org.tags
        }));

        console.log("Mapped organizations for list page:", organizations);
        return organizations;
    } catch (error) {
        console.error("Error fetching organizations in Page component:", error);
        // Optionally redirect to an error page or show a fallback UI
        // redirect('/error'); // Example redirection - removed unused import
        return []; // Return empty array on error to prevent crashing
    }
}

export default async function OrganizationsPage() {
    const organizations = await getOrganizations();

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h1 className={styles.title}>Our Partner Organizations</h1>
                {organizations.length === 0 ? (
                    <p>No organizations found.</p>
                ) : (
                    <div className={styles.grid}>
                        {organizations.map((org) => (
                            // Check if slug exists before creating the link
                            org.slug ? (
                                <Link href={`/organizations/${org.slug}`} key={org._id} className={styles.cardLink}>
                                    <PublicProfile organization={org} />
                                </Link>
                            ) : (
                                // Render without a link if slug is missing, or add a placeholder
                                <div key={org._id} className={styles.cardLinkNoSlug}>
                                    <PublicProfile organization={org} />
                                    <p className={styles.noSlugWarning}>Link unavailable (missing slug)</p>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}