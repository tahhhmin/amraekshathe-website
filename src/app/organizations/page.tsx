// src/app/organizations/page.tsx

import Link from 'next/link';
import PublicProfile from '@/components/public/organisationProfile';
import styles from './page.module.css';
import { connectDB } from '@/config/connectDB';
import Organization from '@/models/Organisation';

export const dynamic = 'force-dynamic';

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

async function getOrganizations(): Promise<OrganizationForCard[]> {
    try {
        await connectDB();

        // Direct database call instead of HTTP request
        const organizations = await Organization.find({})
            .select('organizationName slug shortDescription description imageUrl contactPerson phoneNumber address isVerified dateJoined userType website category tags')
            .lean();

        console.log("Direct DB query result:", organizations);

        // Map to your interface
        const formattedOrganizations: OrganizationForCard[] = organizations.map(org => ({
            _id: org._id.toString(),
            name: org.organizationName,
            slug: org.slug,
            shortDescription: org.shortDescription,
            imageUrl: org.imageUrl,
            location: org.address,
            category: org.category,
            tags: org.tags
        }));

        console.log("Mapped organizations for list page:", formattedOrganizations);
        return formattedOrganizations;
    } catch (error) {
        console.error("Error fetching organizations directly from DB:", error);
        return [];
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
                            org.slug ? (
                                <Link href={`/organizations/${org.slug}`} key={org._id} className={styles.cardLink}>
                                    <PublicProfile organization={org} />
                                </Link>
                            ) : (
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