// File: src/app/organization/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./page.module.css";
// import dynamic from "next/dynamic"; // Not used in this component, can be removed if not needed elsewhere

// import LogoDark from '../../../../public/amraekshathe-dark-icon.svg'; // Not directly used in JSX, can be removed
import LogoutButton from "@/components/buttons/LogoutButton";

import { BadgeCheck, HandCoins, UserPen } from 'lucide-react'
import Link from "next/link";

// Define the interface for Organization profile data
interface OrganizationProfile {
  _id: string; // MongoDB ObjectId
  email: string;
  organizationName: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
  isVerified: boolean;
  dateJoined: string; // Assuming date is returned as a string
  userType: "organization";
  
  // Assuming these stats might be returned by the profile API,
  // even if not explicitly in the simplified model, or they would be 0.
  totalProjectsPosted: number;
  totalVolunteersEngaged: number;
  impactScore: number;
}

export default function OrganizationDashboardPage() {
  const [organization, setOrganization] = useState<OrganizationProfile | null>(null);
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
    async function fetchOrganizationProfile() {
      // *** IMPORTANT CHANGE: Fetch from the organization profile API ***
      const res = await fetch("/api/organizations/profile", { method: "POST" });
      const data = await res.json();
      
      // If data is not successful or no data, redirect to login/signup
      if (!data?.success || !data?.data) {
        console.error("Failed to fetch organization profile:", data.message);
        return router.push("/login-signup"); // Redirect to your combined login/signup page
      }
      
      // Set the organization data
      setOrganization(data.data);
    }
    fetchOrganizationProfile();
  }, [router]); // Dependency array includes router to avoid lint warnings

  // Show a loading state or redirect if organization data is not yet loaded
  if (!organization) {
    return (
      <section className={Styles.section}>
        <div className={Styles.container} style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading Organization Dashboard...</h2>
          <p className="muted-text">Please wait while we fetch your data.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={Styles.section}>
      <div className={Styles.container}>
        <div className={Styles.header}>
          <div className={Styles.headerUserInfoContainer}>
            {/* Display organization name */}
            <h1>{organization.organizationName} Dashboard</h1>
            <p className="muted-text">
              Manage your projects and connect with volunteers.
            </p>
          </div>

          <div className={Styles.headerButtonContainer}>
            <LogoutButton /> {/* Assuming this button correctly logs out both user types */}
          </div>
        </div>

        <h1>Account Information</h1>
        <div className={Styles.userStats}>
          <Link href='/organization/account-status'> {/* Changed path to organization */}
            <div className={Styles.infoContainer}>
              <BadgeCheck />
              <p className="muted-text">Account Status: {organization.isVerified ? "Verified" : "Pending"}</p>
            </div>
          </Link>
          <Link href='/organization/payment'> {/* Changed path to organization */}
            <div className={Styles.infoContainer}>
              <HandCoins />
              <p className="muted-text">Payment</p> {/* This would link to a payment management page */}
            </div>
          </Link>
          <Link href='/organization/profile'> {/* Changed path to organization */}
            <div className={Styles.infoContainer}>
              <UserPen />
              <p className="muted-text">Public Profile</p> {/* This would link to the public organization profile */}
            </div>
          </Link>
          {/* Add a link for posting new projects */}
          <Link href='/organization/post-project'> 
            <div className={Styles.infoContainer}>
              <UserPen /> {/* You might want a different icon, e.g., 'PlusCircle' */}
              <p className="muted-text">Post New Project</p>
            </div>
          </Link>
        </div>

        {/* Organization Specific Statistics */}
        <h1>Statistics</h1>
        <div className={Styles.userStats}>
          <div className={Styles.statContainer}>
            <p className="muted-text">Member Since</p>
            <h1 className={Styles.titleDateJoined}>{formatDate(organization.dateJoined)}</h1>
            <p className="muted-text">{calculateDuration(organization.dateJoined)}</p>
          </div>

          <div className={Styles.statContainer}>
            <p className="muted-text">Total Projects Posted</p>
            <h1 className={Styles.titleCertificates}>{organization.totalProjectsPosted || 0}</h1>
            <p className="muted-text">All time</p>
          </div>

          <div className={Styles.statContainer}>
            <p className="muted-text">Total Volunteers Engaged</p>
            <h1 className={Styles.titleMilestones}>{organization.totalVolunteersEngaged || 0}</h1>
            <p className="muted-text">Across all projects</p>
          </div>

          <div className={Styles.statContainer}>
            <p className="muted-text">Impact Score</p>
            <h1 className={Styles.titleImpactScore}>{organization.impactScore || 0}</h1>
            <p className="muted-text">Community rating</p>
          </div>

          {/* Placeholder for other organization-specific stats not directly from the model */}
          <div className={Styles.statContainer}>
            <p className="muted-text">Active Projects</p>
            <h1 className={Styles.titleHoursVol}>8</h1> {/* Hardcoded, replace with dynamic data */}
            <p className="muted-text">Currently running</p>
          </div>

          <div className={Styles.statContainer}>
            <p className="muted-text">Applications</p>
            <h1 className={Styles.titleProjectsJoined}>15</h1> {/* Hardcoded, replace with dynamic data */}
            <p className="muted-text">Pending review</p>
          </div>
        </div>

        <h1>Actions</h1>
        {/* Add action buttons/links specific to organizations, e.g., "Post New Project", "Manage Applications" */}
        <div className={Styles.userStats}>
          {/* Example: A button to post a new project */}
          <Link href="/organization/post-project">
            <div className={Styles.infoContainer}>
              <UserPen /> {/* Consider a more appropriate icon like 'PlusCircle' or 'Megaphone' */}
              <p className="muted-text">Post New Project</p>
            </div>
          </Link>
          {/* Example: A button to manage existing projects */}
          <Link href="/organization/manage-projects">
            <div className={Styles.infoContainer}>
              <UserPen /> {/* Consider a more appropriate icon like 'ListChecks' or 'Settings' */}
              <p className="muted-text">Manage Projects</p>
            </div>
          </Link>
          {/* Example: A button to view volunteer applications */}
          <Link href="/organization/view-applications">
            <div className={Styles.infoContainer}>
              <UserPen /> {/* Consider a more appropriate icon like 'Inbox' or 'Users' */}
              <p className="muted-text">View Applications</p>
            </div>
          </Link>
        </div>

        <h1>Your Projects</h1>
        <div>
          {/* This section would dynamically list projects posted by the organization */}
          <p className="muted-text">No projects posted yet. Start by posting your first project!</p>
          {/* You would fetch and map through an array of projects here */}
        </div>
      </div>
    </section>
  );
}
