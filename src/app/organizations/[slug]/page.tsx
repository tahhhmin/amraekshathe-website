// src/app/organizations/[slug]/page.tsx
import { connectDB } from "@/config/connectDB";
import Organization, { IOrganization } from "@/models/Organisation";
import styles from "./organisationDetailPage.module.css";
import { notFound } from "next/navigation";
import Image from "next/image"; // Assuming you use Next.js Image component
import Link from "next/link";
import { Mail, Phone, MapPin, Globe, CalendarDays, Tag } from 'lucide-react'; // Assuming these icons exist

interface OrganizationDetailPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: OrganizationDetailPageProps) {
    const slug = params.slug; // Access slug directly
    await connectDB();
    const org = await Organization.findOne({ slug });

    if (!org) {
        return {
            title: "Organization Not Found",
        };
    }

    return {
        title: org.organizationName,
        description: org.shortDescription || "Details about this organization.", // Fallback for shortDescription
        // Add other metadata as needed
    };
}

// Ensure dynamic rendering to allow async operations in Page
export const dynamic = 'force-dynamic'; // Or 'auto' if you prefer static generation with revalidation

export default async function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
    const { slug } = params;

    if (!slug) {
        // This case should ideally be caught by Next.js's routing,
        // but explicit check adds robustness.
        notFound();
    }

    await connectDB();
    const org = await Organization.findOne({ slug });

    if (!org) {
        notFound(); // Renders Next.js's not-found page
    }

    // Prepare data for rendering, ensuring no 'undefined' for string props
    const orgDetails = {
        organizationName: org.organizationName,
        shortDescription: org.shortDescription || "", // Provide empty string fallback
        description: org.description || "",           // Provide empty string fallback
        imageUrl: org.imageUrl || "/default-org-logo.png", // Provide default image fallback
        contactPerson: org.contactPerson,
        phoneNumber: org.phoneNumber,
        address: org.address,
        email: org.email,
        website: org.website || "", // Fallback for optional website field
        category: org.category || "", // Fallback for optional category field
        tags: org.tags || [], // Fallback for optional tags array
        dateJoined: org.dateJoined.toLocaleDateString(),
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Image
                    src={orgDetails.imageUrl}
                    alt={`${orgDetails.organizationName} Logo`}
                    width={150}
                    height={150}
                    className={styles.logo}
                    // Consider objectFit if you need to control image scaling within the container
                    // objectFit="cover"
                />
                <h1>{orgDetails.organizationName}</h1>
                {orgDetails.shortDescription && ( // Only render if shortDescription exists
                    <p className={styles.shortDescription}>{orgDetails.shortDescription}</p>
                )}
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <Mail size={20} className={styles.icon} />
                    <strong>Email:</strong> {orgDetails.email}
                </div>
                <div className={styles.detailItem}>
                    <Phone size={20} className={styles.icon} />
                    <strong>Phone:</strong> {orgDetails.phoneNumber}
                </div>
                <div className={styles.detailItem}>
                    <MapPin size={20} className={styles.icon} />
                    <strong>Address:</strong> {orgDetails.address}
                </div>
                {orgDetails.website && ( // Only render if website exists
                    <div className={styles.detailItem}>
                        <Globe size={20} className={styles.icon} />
                        <strong>Website:</strong>{" "}
                        <Link href={orgDetails.website} target="_blank" rel="noopener noreferrer">
                            {orgDetails.website}
                        </Link>
                    </div>
                )}
                {orgDetails.category && ( // Only render if category exists
                    <div className={styles.detailItem}>
                        <Tag size={20} className={styles.icon} />
                        <strong>Category:</strong> {orgDetails.category}
                    </div>
                )}
                <div className={styles.detailItem}>
                    <CalendarDays size={20} className={styles.icon} />
                    <strong>Joined:</strong> {orgDetails.dateJoined}
                </div>
            </div>

            {orgDetails.description && ( // Only render if description exists
                <div className={styles.descriptionSection}>
                    <h2>About Us</h2>
                    <p>{orgDetails.description}</p>
                </div>
            )}

            {orgDetails.tags && orgDetails.tags.length > 0 && ( // Only render if tags exist and are not empty
                <div className={styles.tagsSection}>
                    <h2>Tags</h2>
                    <div className={styles.tagList}>
                        {orgDetails.tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* You can add more sections here like events, donations, etc. */}
        </div>
    );
}