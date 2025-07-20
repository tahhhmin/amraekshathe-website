"use client";

import { useState } from "react";
import Input from "@/ui/input/Input";
import Button from "@/ui/button/Button";
import Styles from "../../app/login-signup/page.module.css"; // Assuming Styles are common
import { NextRouter } from "next/router"; // Import NextRouter for type checking

interface LoginOrganizationProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: (type: "success" | "error", text: string) => void;
  router: NextRouter; // Pass router as prop
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
  const [organizationName, setOrganizationName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Client-side validation for Organization Login
  function validateOrganizationLogin(): boolean {
    if (!organizationName || !registrationNumber) {
      showMessage("error", "Please fill in all required organization fields.");
      return false;
    }
    return true;
  }

  async function handleLogin() {
    if (!email || !password) {
      showMessage("error", "Please enter email and password");
      return;
    }

    if (!validateOrganizationLogin()) {
      return;
    }

    setLoading(true);
    try {
      const loginPayload = {
        email: email.trim(),
        password,
        loginType: "organization",
        organizationName: organizationName.trim(),
        registrationNumber: registrationNumber.trim(),
      };

      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/organization/dashboard");
        }, 1000);
      } else {
        showMessage("error", data.message || "Login failed");
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
        placeholder="Enter your email address"
        showIcon
        icon="Mail"
        disabled={loading}
        required
      />

      <Input
        label="Organization Name *"
        name="organizationName"
        type="text"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.target.value)}
        placeholder="Enter your organization's name"
        showIcon
        icon="Building" // Example icon for organization
        disabled={loading}
        required
      />

      <Input
        label="Registration Number *"
        name="registrationNumber"
        type="text"
        value={registrationNumber}
        onChange={(e) => setRegistrationNumber(e.target.value)}
        placeholder="Enter organization's registration number"
        showIcon
        icon="FileText" // Example icon for registration
        disabled={loading}
        required
      />

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