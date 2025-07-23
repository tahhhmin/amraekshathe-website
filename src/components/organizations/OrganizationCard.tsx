import { Users, MapPin, HandHeart } from "lucide-react"
import styles from "./OrganizationCard.module.css"
import Button from "@/ui/button/Button"
import Image from "next/image"
import { OrganizationForCard } from '@/app/organizations/page';

const thumbnailURL = ""; 
const avatarURL = ""; 
const fallback = "HE"; 


interface PublicProfileProps {
    organization: OrganizationForCard;
}

const OrganizationCard: React.FC<PublicProfileProps> = ({ organization }) => {
    // Determine the image URL, provide a fallback if empty

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.coverImageArea}>
                    {thumbnailURL ? (<Image
                        src={thumbnailURL}
                        alt="Cover"
                        className={styles.coverImage}
                    />) : (
                        <div className={styles.coverImageFallback}>
                            <h2>No Cover Image</h2>
                        </div>
                    )}
                </div>

                <div className={styles.avatarContainer}>
                        <div className={styles.avatar}> 
                            {avatarURL ? (
                                <Image src={avatarURL} alt="Avatar" className={styles.avatarImage} />
                            ) : (
                                <div className={styles.avatarFallback}>{fallback}</div>
                            )}
                        </div>
                </div>

                <div className={styles.badgeContainer}>
                    <p className={styles.badge}>Non Profit</p>
                    <p className={styles.badge}>Government</p>
                    <p className={styles.badge}>Cats</p>
                </div>
            </div>

            <div className={styles.cardHeader}>
                <h2 className={styles.title}>{organization.name}</h2>
            </div>

            <div className={styles.cardContent}>
                {organization.shortDescription && <p className={styles.description}>
                    {organization.shortDescription}
                </p>}
                
                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <Users className={styles.metaIcon} />
                        <p>42 members</p>
                    </div>
                    <div className={styles.metaItem}>
                        <MapPin className={styles.metaIcon} />
                        <p>{organization.location}</p>
                    </div>
                    <div className={styles.metaItem}>
                        <HandHeart className={styles.metaIcon} />
                        <p>10 projects</p>
                    </div>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.buttonContainer}> 
                    <Button
                        variant="outlined"
                        label="Join Now"
                    />
                    <Button
                        variant="primary"
                        label="View Details"
                    />
                </div>
                <div className={styles.websiteButton}><Button
                    variant="action"
                    label="Website"
                    showIcon
                    icon="ExternalLink"
                /></div>
            </div>
        </div>

    )
}

export default OrganizationCard;