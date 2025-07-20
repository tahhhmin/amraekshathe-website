// File: src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./page.module.css";
import dynamic from "next/dynamic";

import LogoDark from '../../../../public/amraekshathe-dark-icon.svg';
import LogoutButton from "@/components/buttons/LogoutButton";

import { BadgeCheck, HandCoins, UserPen  } from 'lucide-react'
import Link from "next/link";


interface Certificate {
  id: string;
  name: string;
  dateEarned: string;
  issuer: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dateAchieved: string;
  type: string;
}

interface User {
    username: string;
    email: string;
    isAdmin: boolean;
    name: string;
    dateJoined: string;
    certificates: Certificate[];
    milestones: Milestone[];
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

  return (
    <section className={Styles.section}>
      {user && (
        <div className={Styles.container}>
          <div className={Styles.header}>

            <div className={Styles.headerUserInfoContainer}>

                <h1>{user.name} Dashboard</h1>


              <p className="muted-text">
                Manage your projects and connect with volunteers.
              </p>
            </div>

            <div className={Styles.headerButtonContainer}>
              <LogoutButton />
            </div>
          </div>
          <h1>Account Information</h1>
          <div className={Styles.userStats}>
                <Link href='/organisation/account-status'><div className={Styles.infoContainer}>
                    <BadgeCheck />
                    <p className="muted-text">Account Status</p>
                </div></Link>
                <Link href='/organisation/payment'><div className={Styles.infoContainer}>
                    <HandCoins />
                    <p className="muted-text">Payment</p>
                </div></Link>
                <Link href='/organisation/profile'><div className={Styles.infoContainer}>
                    <UserPen />
                    <p className="muted-text">Public Profile</p>
                </div></Link>
          </div>
          {/* User Stats */}
          <h1>Statistics</h1>
          <div className={Styles.userStats}>
            <div className={Styles.statContainer}>
              <p className="muted-text">Active Projects</p>
              <h1 className={Styles.titleDateJoined}>8</h1>
              <p className="muted-text">Currently running</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Total Volunteers</p>
              <h1 className={Styles.titleCertificates}>37</h1>
              <p className="muted-text">Across all projects</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Applications</p>
              <h1 className={Styles.titleMilestones}>15</h1>
              <p className="muted-text">Pending review</p>
            </div>

            <div className={Styles.statContainer}>
              <p className="muted-text">Total Projects</p>
              <h1 className={Styles.titleHoursVol}>10</h1>
              <p className="muted-text">Projects Completed</p>
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
<h1>Actions</h1>
            <div>
             
            </div>
          {/* Organizations */}
             <h1>Your Projects</h1>
            <div>
             
            </div>
          
        </div>
      )}

    </section>
  );
}