// src/components/public/organisationProfile.tsx
import React from 'react';
import Image from 'next/image'; // For optimized images
import Styles from './organisationProfile.module.css';
import { OrganizationForCard } from '@/app/organizations/page'; // Import the type from the list page

interface PublicProfileProps {
    organization: OrganizationForCard;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ organization }) => {
    // Determine the image URL, provide a fallback if empty
    const displayImageUrl = organization.imageUrl && organization.imageUrl.trim() !== ''
        ? (organization.imageUrl.startsWith('http') ? organization.imageUrl : `/${organization.imageUrl}`)
        : '/default-org-logo.png'; // Path to your default placeholder in public folder

    return (
        <div className={Styles.card}>
            <div className={Styles.imageContainer}>
                <Image
                    src={displayImageUrl}
                    alt={`${organization.name} logo`}
                    width={100} // Adjust as needed for your design
                    height={100} // Adjust as needed for your design
                    className={Styles.image}
                    priority={false} // Set to true only if this image is above the fold on the LIST page (unlikely for all cards)
                />
            </div>
            <div className={Styles.info}>
                <h2 className={Styles.name}>{organization.name}</h2>
                <p className={Styles.shortDescription}>{organization.shortDescription}</p>
                <p className={Styles.location}>Location: {organization.location}</p>
                {organization.category && <p className={Styles.category}>Category: {organization.category}</p>}
                {organization.tags && organization.tags.length > 0 && (
                    <div className={Styles.tags}>
                        {organization.tags.map((tag, index) => (
                            <span key={index} className={Styles.tag}>{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;