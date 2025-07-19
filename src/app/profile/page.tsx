"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./page.module.css";
import Button from "@/ui/button/Button";
import Image from "next/image";


import LogoDark from '../../../public/amraekshathe-dark-icon.svg';
import MapSection from "@/components/profile/MapSection";

interface User {
  username: string;
  email: string;
  isAdmin: boolean;
  // Add any other user properties you expect here
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchProfile() {
        const res = await fetch("/api/users/profile", { method: "POST" });
        const data = await res.json();
        if (!data?.data) return router.push("/auth");
        setUser(data.data);
        }
        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/users/logout", { method: "POST" });
        router.push("/");
    };

    return (
        <section className={Styles.section}>
            {user && (
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <div className={Styles.headerUserInfoContainer}>
                        <div className={Styles.headerNameContainer}>
                            <h1>Welcome back, Tajrian Tahmin</h1>
                            <div className={Styles.usernameContainer}><p>@{user.username}</p></div>    
                        </div>
                        <p className="muted-text">Discover volunteer opportunities near you and make a difference in your community.</p>
                    </div>

                    <div className={Styles.headerButtonContainer}>
                        <Button
                            variant="outlined"
                            label="Edit Profile"
                            showIcon
                            icon="Pencil"
                        />
                    </div>
                </div>

                <h1>Staistics</h1>

                <div className={Styles.userStats}>
                    <div className={Styles.statContainer}>
                        <p className="muted-text">Date Joined</p>
                        <h1 className={Styles.titleDateJoined}>30th Nov 2020</h1>
                        <p className="muted-text">Total 6 Months </p>
                    </div>

                    <div className={Styles.statContainer}>
                        <p className="muted-text">Certificates</p>
                        <h1 className={Styles.titleCertificates}>14</h1>
                        <p className="muted-text">Earned</p>
                    </div>

                    <div className={Styles.statContainer}>
                        <p className="muted-text">Milestones</p>
                        <h1 className={Styles.titleMilestones}>32</h1>
                        <p className="muted-text">Reached</p>
                    </div>



                    <div className={Styles.statContainer}>
                        <p className="muted-text">Hours Volunteered</p>
                        <h1 className={Styles.titleHoursVol}>24</h1>
                        <p className="muted-text">This month</p>
                    </div>

                    <div className={Styles.statContainer}>
                        <p className="muted-text">Projects Joined</p>
                        <h1 className={Styles.titleProjectsJoined}>8</h1>
                        <p className="muted-text">Total completed</p>
                    </div>

                    <div className={Styles.statContainer}>
                        <p className="muted-text">Impact Score</p>
                        <h1 className={Styles.titleImpactScore}>92</h1>
                        <p className="muted-text">Community rating</p>
                    </div>

                </div>

                <h1>Organisations Joined</h1>

                <div className={Styles.userOrgInfo}>
                    <div className={Styles.OrgContainer}>
                        <div>
                        <Image
                            className={Styles.logo}
                            src={LogoDark}
                            alt="Dark Logo"
                            priority
                            width={120}
                            height={120}
                        />
                        <h2>Amra Ekshathe</h2>
                        </div>

                        <div>
                            <h3 className="muted-text">Volunteer Manager</h3>
                        </div>

                        <div className={Styles.orgContainerButton}>
                            <Button
                                label="View"
                                variant="outlined"
                            />
                            <Button
                                label="Notifcations"
                                showIcon
                                icon="Bell"
                            />
                        </div>
                    </div>

                     <div className={Styles.OrgContainer}>
                        <div>
                        <Image
                            className={Styles.logo}
                            src={LogoDark}
                            alt="Dark Logo"
                            priority
                            width={120}
                            height={120}
                        />
                        <h2>Amra Ekshathe</h2>
                        </div>

                        <div>
                            <h3 className="muted-text">Volunteer Manager</h3>
                        </div>

                        <div className={Styles.orgContainerButton}>
                            <Button
                                label="View"
                                variant="outlined"
                            />
                            <Button
                                label="Notifcations"
                                showIcon
                                icon="Bell"
                            />
                        </div>
                    </div>

                     <div className={Styles.OrgContainer}>
                        <div>
                        <Image
                            className={Styles.logo}
                            src={LogoDark}
                            alt="Dark Logo"
                            priority
                            width={120}
                            height={120}
                        />
                        <h2>Amra Ekshathe</h2>
                        </div>

                        <div>
                            <h3 className="muted-text">Volunteer Manager</h3>
                        </div>

                        <div className={Styles.orgContainerButton}>
                            <Button
                                label="View"
                                variant="outlined"
                            />
                            <Button
                                label="Notifcations"
                                showIcon
                                icon="Bell"
                            />
                        </div>
                    </div>

                     <div className={Styles.OrgContainer}>
                        <div>
                        <Image
                            className={Styles.logo}
                            src={LogoDark}
                            alt="Dark Logo"
                            priority
                            width={120}
                            height={120}
                        />
                        <h2>Amra Ekshathe</h2>
                        </div>

                        <div>
                            <h3 className="muted-text">Volunteer Manager</h3>
                        </div>

                        <div className={Styles.orgContainerButton}>
                            <Button
                                label="View"
                                variant="outlined"
                            />
                            <Button
                                label="Notifcations"
                                showIcon
                                icon="Bell"
                            />
                        </div>
                    </div>

                    
                </div>


                <h1>Discover Projects Near You</h1>

                <div className={Styles.mapSection}>
                    <MapSection />
                </div>




            </div>

            )}
        </section>
    );
}