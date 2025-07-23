// src/components/public/organisationProfile.tsx
import React from 'react';
import Image from 'next/image'; // For optimized images
import Styles from './organisationProfile.module.css';
import { OrganizationForCard } from '@/app/organizations/page'; // Import the type from the list page
import Button from '@/ui/button/Button';
import VerticalDivider from '@/ui/dividers/VerticalDivider';

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
            <div className={Styles.header}>
                <p className={Styles.tag}>non-profit</p>
            </div>

            <div className={Styles.imageContainer}>
                <div className={Styles.image}><Image
                    src={displayImageUrl}
                    alt={`${organization.name} logo`}
                    width={100} 
                    height={100} 
                    className={Styles.image}
                    priority={false}
                /></div>
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

            <div className={Styles.infoContainer}>
                <div>
                    <p className={Styles.projects}>Projects</p>
                    <h2>10</h2>
                </div>
                
                <VerticalDivider/>

                <div>
                    <p className={Styles.projects}>Volunteers</p>
                    <h2>120</h2>
                </div>
            </div>

            <div className={Styles.buttonContainer}>

                <Button
                    variant="outlined"
                    label='Join'
                />

                <div className={Styles.viewButton}><Button
                    variant="primary"
                    label='view'
                /></div>
            </div>
            </div>
        </div>
    );
};

export default PublicProfile;