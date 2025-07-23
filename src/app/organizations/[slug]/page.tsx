// src/app/organizations/[slug]/page.tsx
import { connectDB } from "@/config/connectDB";
import Organization from "@/models/Organisation";
import styles from "./organisationDetailPage.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Users, HandHeart } from 'lucide-react';
import Button from "@/ui/button/Button";

// Define the shape of the parameters for this dynamic route
interface OrganizationPageParams {
    slug: string;
}

// Type for the Page component's props - params is now a Promise
interface OrganizationDetailPageProps {
    params: Promise<OrganizationPageParams>;
}

// Type for generateMetadata function's props - params is also a Promise here
interface GenerateMetadataProps {
    params: Promise<OrganizationPageParams>;
    // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Uncomment if you need search params
}

export async function generateMetadata({ params }: GenerateMetadataProps) {
    const { slug } = await params; // Await the params Promise
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
    const { slug } = await params; // Await the params Promise

    if (!slug) {
        notFound();
    }

    await connectDB();
    const org = await Organization.findOne({ slug });

    if (!org) {
        notFound();
    }
const thumbnailURL = ""; 
const avatarURL = ""; 
const fallback = "HE"; 

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
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.coverImageArea}>
                        <Image
                            src={thumbnailURL}
                            alt="Cover"
                            className={styles.coverImage}
                        />
                    </div>
                </div>
                <div className={styles.avatarContainer}>

                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}> 
                        {avatarURL ? (
                                <Image src={avatarURL} alt="Avatar" className={styles.avatarImage} />
                            ) : (
                                <div className={styles.avatarFallback}>{fallback}</div>
                            )}
                        </div>

                        <div className={styles.nameContainer}>
                            <h1>{orgDetails.organizationName}</h1>
                            <h3>Innovating Tomorrows Technology Today</h3>
                            <div className={styles.meta}>
                            <div className={styles.metaItem}>
                                    <Users className={styles.metaIcon} />
                                    <p>42 members</p>
                                </div>
                                <div className={styles.metaItem}>
                                    <MapPin className={styles.metaIcon} />
                                    <p>Location</p>
                                </div>
                                <div className={styles.metaItem}>
                                    <HandHeart className={styles.metaIcon} />
                                    <p>10 projects</p>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className={styles.headerButtonContainer}>
                        <Button
                            variant="outlined"
                            label="Join Organization"
                            showIcon
                            icon="ExternalLink"
                        />
                        <Button
                            variant="primary"                        
                            label="Contact"
                            showIcon
                            icon="Mail"
                        />
                    </div>






                </div>


                <div className={styles.contentContainer}>

                    <div className={styles.leftColumn}>
                        <div className={styles.cardContainer}>
                            <h2>About</h2>
                            <p className={styles.cardDescription}>Lorem ipsum dolor, sit amet consectetur adipisicing 
                                elit. Dolores harum rem nulla, sunt porro tenetur 
                                rerum, molestias placeat dignissimos repudiandae 
                                minus eligendi id esse veritatis, accusantium nam 
                                ut libero aperiam!</p>
                        </div>

                        <div className={styles.cardContainer}>
                            <h2>Key Metrics</h2>
                            <div className={styles.cardStatGrid}>
                                <div className={styles.cardStatGridItem}>
                                    <h1>150+</h1>
                                    <p className="muted-text">Projects</p>
                                </div>

                                <div className={styles.cardStatGridItem}>
                                    <h1>150+</h1>
                                    <p className="muted-text">Projects</p>
                                </div>

                                <div className={styles.cardStatGridItem}>
                                    <h1>150+</h1>
                                    <p className="muted-text">Projects</p>
                                </div>

                                <div className={styles.cardStatGridItem}>
                                    <h1>150+</h1>
                                    <p className="muted-text">Projects</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardContainer}>
                            <h2>Leadership Team</h2>
                            <div className={styles.cardPersonList}>
                                <div className={styles.cardPerson}>
                                    <div className={styles.cardPersonImage}></div>
                                    <div className={styles.cardPersonInfo}>
                                        <h2>John Doe</h2>
                                        <p>CEO</p>
                                        <p className="muted-text">john.doe@example.com</p>
                                    </div>
                                </div>

                                <div className={styles.cardPerson}>
                                    <div className={styles.cardPersonImage}></div>
                                    <div className={styles.cardPersonInfo}>
                                        <h2>John Doe</h2>
                                        <p>CEO</p>
                                        <p className="muted-text">john.doe@example.com</p>
                                    </div>
                                </div>

                                <div className={styles.cardPerson}>
                                    <div className={styles.cardPersonImage}></div>
                                    <div className={styles.cardPersonInfo}>
                                        <h2>John Doe</h2>
                                        <p>CEO</p>
                                        <p className="muted-text">john.doe@example.com</p>
                                    </div>
                                </div>

                                <div className={styles.cardPerson}>
                                    <div className={styles.cardPersonImage}></div>
                                    <div className={styles.cardPersonInfo}>
                                        <h2>John Doe</h2>
                                        <p>CEO</p>
                                        <p className="muted-text">john.doe@example.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardContainer}>
                            <h2>Current Projects</h2>
                            <p className={styles.cardDescription}>Lorem ipsum dolor, sit amet consectetur adipisicing 
                                elit. Dolores harum rem nulla, sunt porro tenetur 
                                rerum, molestias placeat dignissimos repudiandae 
                                minus eligendi id esse veritatis, accusantium nam 
                                ut libero aperiam!</p>
                        </div>

                        <div className={styles.cardContainer}>
                            <h2>Our Volunteers</h2>
                            <p className={styles.cardDescription}>Lorem ipsum dolor, sit amet consectetur adipisicing 
                                elit. Dolores harum rem nulla, sunt porro tenetur 
                                rerum, molestias placeat dignissimos repudiandae 
                                minus eligendi id esse veritatis, accusantium nam 
                                ut libero aperiam!</p>
                        </div>

                        <div className={styles.cardContainer}>
                            <h2>Upcoming Events</h2>
                            <p className={styles.cardDescription}>Lorem ipsum dolor, sit amet consectetur adipisicing 
                                elit. Dolores harum rem nulla, sunt porro tenetur 
                                rerum, molestias placeat dignissimos repudiandae 
                                minus eligendi id esse veritatis, accusantium nam 
                                ut libero aperiam!</p>
                        </div>
                    </div>
                    










                    <div className={styles.rightColumn}>
                        <div className={styles.cardContainer}>
                            <h2>Contact Information</h2>

                                <ul className={styles.cardList}>
                                    <li>
                                        <Globe className={styles.contactIcons} /> <a href="https://techforward.com">techforward.com</a>
                                    </li>

                                    <li>
                                        <Mail className={styles.contactIcons} /> <a href="https://techforward.com">techforward.com</a>
                                    </li>

                                    <li>
                                        <Phone className={styles.contactIcons} /> <a href="https://techforward.com">techforward.com</a>
                                    </li>

                                    <li>
                                        <MapPin className={styles.contactIcons} /> <a href="https://techforward.com">techforward.com</a>
                                    </li>
                                </ul>

                        </div>





                        <div className={styles.cardContainer}>
                            <h2>Our Impact</h2>

                            <div className={styles.verticalContent}>
                                <h1>1,200+</h1>
                                <p className="muted-text">Volunteering Hours</p>
                            </div>

                            <div className={styles.verticalContent}>
                                <h1>25</h1>
                                <p className="muted-text">Active Volunteers</p>
                            </div>

                            <div className={styles.verticalContent}>
                                <h1>8</h1>
                                <p className="muted-text">Ongoing Projects</p>
                            </div>

                            <div className={styles.verticalContent}>
                                <h1>78</h1>
                                <p className="muted-text">Completed Projects</p>
                            </div>

                            <div className={styles.verticalContent}>
                                <h1>15,000+</h1>
                                <p className="muted-text">Lives Impacted</p>
                            </div>

                             <div className={styles.verticalContent}>
                                <h1>53</h1>
                                <p className="muted-text">Locations</p>
                            </div>

                        </div>




                        <div className={styles.cardContainer}>
                            <h2>Get Involved</h2>
                            <div className={styles.cardContainerButtonContainer}>
                                <Button
                                    variant="primary"
                                    label="Become a Volunteer"
                                    showIcon
                                    icon="Users"
                                />

                                <Button
                                    variant="outlined"
                                    label="View All Projects"
                                    showIcon
                                    icon="ExternalLink"
                                />

                                <Button
                                    variant="outlined"
                                    label="View All Projects"
                                    showIcon
                                    icon="ExternalLink"
                                />
                            </div>
                            

                        </div>

                        <div className={styles.cardContainer}>
                            <h2>Follow Us</h2>
                            <div className={styles.cardContainerButtonContainerIcon}>
                                <Button
                                    variant="icon"

                                    showIcon
                                    icon="Users"
                                />

                                <Button
                                    variant="icon"

                                    showIcon
                                    icon="ExternalLink"
                                />

                                <Button
                                    variant="icon"

                                    showIcon
                                    icon="ExternalLink"
                                />
                            </div>
                            

                        </div>














                    </div>
                </div>




            </div>
        </section>
    );
}