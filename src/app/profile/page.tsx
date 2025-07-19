// File: src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./page.module.css";
import Button from "@/ui/button/Button";
import Image from "next/image";
import dynamic from "next/dynamic";

import LogoDark from '../../../public/amraekshathe-dark-icon.svg';
import LogoutButton from "@/components/buttons/LogoutButton";

const MapSection = dynamic(() => import("@/components/profile/MapSection"), {
  ssr: false,
});

interface User {
    username: string;
    email: string;
    isAdmin: boolean;
    name: string;
    dateJoined: string;
    certificates: any[]; // Array of certificates
    milestones: any[]; // Array of milestones
    totalHoursVolunteered: number;
    totalProjectsJoined: number;
    impactScore: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    
    // Add ordinal suffix
    const ordinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
  };

  // Helper function to calculate duration since joining
  const calculateDuration = (dateString: string): string => {
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0 && months > 0) {
      return `${years} ${years === 1 ? 'Year' : 'Years'} ${months} ${months === 1 ? 'Month' : 'Months'}`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'Year' : 'Years'}`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'Month' : 'Months'}`;
    } else {
      return 'Less than a month';
    }
  };

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
                <h1>Welcome back, {user.name}</h1>
                <div className={Styles.usernameContainer}>
                  <p>@{user.username}</p>
                </div>
              </div>
              <p className="muted-text">
                Discover volunteer opportunities near you and make a difference in your community.
              </p>
            </div>

            <div className={Styles.headerButtonContainer}>
              <LogoutButton />
              <Button
                variant="outlined"
                label="Edit Profile"
                showIcon
                icon="Pencil"
              />
            </div>
          </div>

          {/* User Stats */}
          <h1>Statistics</h1>
          <div className={Styles.userStats}>
            <div className={Styles.statContainer}>
              <p className="muted-text">Date Joined</p>
              <h1 className={Styles.titleDateJoined}>{formatDate(user.dateJoined)}</h1>
              <p className="muted-text">Total {calculateDuration(user.dateJoined)}</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Certificates</p>
              <h1 className={Styles.titleCertificates}>{user.certificates?.length || 0}</h1>
              <p className="muted-text">Earned</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Milestones</p>
              <h1 className={Styles.titleMilestones}>{user.milestones?.length || 0}</h1>
              <p className="muted-text">Reached</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Hours Volunteered</p>
              <h1 className={Styles.titleHoursVol}>{user.totalHoursVolunteered || 0}</h1>
              <p className="muted-text">This month</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Projects Joined</p>
              <h1 className={Styles.titleProjectsJoined}>{user.totalProjectsJoined || 0}</h1>
              <p className="muted-text">Total completed</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Impact Score</p>
              <h1 className={Styles.titleImpactScore}>{user.impactScore || 0}</h1>
              <p className="muted-text">Community rating</p>
            </div>
          </div>

          {/* Organizations */}
          <h1>Organisations Joined</h1>
          <div className={Styles.userOrgInfo}>
            {[1, 2, 3, 4].map((_, i) => (
              <div className={Styles.OrgContainer} key={i}>
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
                  <Button label="View" variant="outlined" />
                  <Button label="Notifications" showIcon icon="Bell" />
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <h1>Discover Projects Near You</h1>
          <div className={Styles.mapSection}>
            <MapSection />
          </div>
        </div>
      )}

    </section>
  );
}