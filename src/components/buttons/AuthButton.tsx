// components/AuthButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from '@/ui/button/Button'; // Assuming this path is correct

// Define a type for the profile data returned from the API
interface ProfileResponseData {
  id: string;
  email: string;
  userType: "user" | "organization";
  username?: string; // For volunteers
  name?: string; // For volunteers
  organizationName?: string; // For organizations
  // Add other relevant profile fields here that you expect to be returned
}

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"user" | "organization" | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Attempt to fetch user profile (volunteer)
        let res = await fetch("/api/users/profile", { method: "POST" });
        let data = await res.json();

        if (res.ok && data?.data) {
          // Assuming user profile returns userType: "user"
          setIsLoggedIn(true);
          setUserType("user");
          return; // Exit if user is found
        }

        // If not a user, attempt to fetch organization profile
        res = await fetch("/api/organizations/profile", { method: "POST" });
        data = await res.json();

        if (res.ok && data?.data) {
          // Assuming organization profile returns userType: "organization"
          setIsLoggedIn(true);
          setUserType("organization");
          return; // Exit if organization is found
        }

        // If neither is found
        setIsLoggedIn(false);
        setUserType(null);

      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
        setUserType(null);
      }
    }
    checkAuth();
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      if (userType === "user") {
        router.push("/user/profile");
      } else if (userType === "organization") {
        router.push("/organizations/dashboard");
      } else {
        // Fallback for unexpected userType or if something went wrong
        router.push("/"); // Redirect to home or a generic dashboard
      }
    } else {
      router.push("/login-signup"); // Redirect to your combined login/signup page
    }
  };

  const buttonLabel = isLoggedIn 
    ? (userType === "user" ? "Volunteer Profile" : userType === "organization" ? "Organization Profile" : "Profile")
    : "Login / Signup";

  return (
    <Button
      onClick={handleClick}
      variant="primary"
      label={buttonLabel}
      showIcon
    />
  );
}
