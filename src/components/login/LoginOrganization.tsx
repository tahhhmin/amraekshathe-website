// components/login/LoginOrganization.tsx

"use client";

import { useState } from "react";
import Input from "@/ui/input/Input";
import Button from "@/ui/button/Button";
import Styles from "../../app/login-signup/page.module.css"; // Assuming Styles are common
import { useRouter } from "next/navigation"; // Import useRouter directly

interface LoginOrganizationProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: (type: "success" | "error", text: string) => void;
  router: ReturnType<typeof useRouter>; // Correct type for useRouter hook
  setEmail: (email: string) => void;
  currentEmail: string;
  setMode: (mode: "signup" | "verify" | "login") => void;
}

export default function LoginOrganization({
  loading,
  setLoading,
  showMessage,
  router,
  setEmail,
  currentEmail,
}: LoginOrganizationProps) {
  const [email, setLocalEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  // Removed organizationName and contactPerson from login form
  // as they are not typically used for login credentials, only email/password.
  // The simplified model also doesn't have registrationNumber for login.

  async function handleLogin() {
    if (!email || !password) {
      showMessage("error", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const loginPayload = {
        email: email.trim(),
        password,
      };

      // *** IMPORTANT CHANGE: Target the organization login API ***
      const res = await fetch("/api/organizations/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Login successful! Redirecting to organization dashboard...");
        setTimeout(() => {
          router.push("/organization/dashboard"); // Redirect to organization profile page
        }, 1000);
      } else {
        showMessage("error", data.message || "Login failed.");
      }
    } catch (e) {
      showMessage("error", "Login failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={Styles.inputGroup}>
      <Input
        label="Email Address *"
        name="email"
        type="email"
        value={email}
        onChange={(e) => {
          setLocalEmail(e.target.value);
          setEmail(e.target.value); // Update parent's email state
        }}
        placeholder="Enter your organization's email address"
        showIcon
        icon="Mail"
        disabled={loading}
        required
      />

      {/* Removed Organization Name and Registration Number from login form */}
      {/* because they are not part of the login credentials for the simplified model */}
      {/* and are not typically used for authentication. */}

      <Input
        label="Password *"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        showIcon
        icon="Lock"
        disabled={loading}
        required
      />
      <Button onClick={handleLogin} loading={loading} label="Sign In" disabled={loading} />
    </div>
  );
}
