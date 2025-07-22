// src/app/organizations/[slug]/page.tsx
import { connectDB } from "@/config/connectDB";
import Organization from "@/models/Organisation";
import styles from "./organisationDetailPage.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe, CalendarDays, Tag } from 'lucide-react';

// Define the shape of the parameters for this dynamic route
interface OrganizationPageParams {
    slug: string;
}

// Type for the Page component's props
interface OrganizationDetailPageProps {
    params: OrganizationPageParams;
}

// Type for generateMetadata function's props
// It takes an object with `params` and optionally `searchParams`
interface GenerateMetadataProps {
    params: OrganizationPageParams;
    // searchParams?: { [key: string]: string | string[] | undefined }; // Uncomment if you need search params
}

export async function generateMetadata({ params }: GenerateMetadataProps) {
    const slug = params.slug;
    await connectDB();
    const org = await Organization.findOne({ slug });

    if (!org) {
        return {
            title: "Organization Not Found",
        };
    }

    return {
        title: org.organizationName,
        description: org.shortDescription || "Details about this organization.",
    };
}

export const dynamic = 'force-dynamic';

export default async function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
    const { slug } = params;

    if (!slug) {
        notFound();
    }

    await connectDB();
    const org = await Organization.findOne({ slug });

    if (!org) {
        notFound();
    }

    const orgDetails = {
        organizationName: org.organizationName,
        shortDescription: org.shortDescription || "",
        description: org.description || "",
        imageUrl: org.imageUrl || "/default-org-logo.png",
        contactPerson: org.contactPerson,
        phoneNumber: org.phoneNumber,
        address: org.address,
        email: org.email,
        website: org.website || "",
        category: org.category || "",
        tags: org.tags || [],
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
                />
                <h1>{orgDetails.organizationName}</h1>
                {orgDetails.shortDescription && (
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
                {orgDetails.website && (
                    <div className={styles.detailItem}>
                        <Globe size={20} className={styles.icon} />
                        <strong>Website:</strong>{" "}
                        <Link href={orgDetails.website} target="_blank" rel="noopener noreferrer">
                            {orgDetails.website}
                        </Link>
                    </div>
                )}
                {orgDetails.category && (
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

            {orgDetails.description && (
                <div className={styles.descriptionSection}>
                    <h2>About Us</h2>
                    <p>{orgDetails.description}</p>
                </div>
            )}

            {orgDetails.tags && orgDetails.tags.length > 0 && (
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
        </div>
    );
}