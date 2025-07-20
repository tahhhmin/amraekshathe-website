// components/login/SignupOrganization.tsx
"use client";

import { useState } from "react";
import Input from "@/ui/input/Input";
import VerificationCodeInput from "@/ui/input/VerificationCodeInput";
import Button from "@/ui/button/Button";
import Styles from "../../app/login-signup/page.module.css"; // Assuming Styles are common

interface SignupOrganizationProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: (type: "success" | "error", text: string) => void;
  setEmail: (email: string) => void;
  currentEmail: string; // The email set by AuthPage, used for verification
  setMode: (mode: "signup" | "verify" | "login") => void;
}

export default function SignupOrganization({
  loading,
  setLoading,
  showMessage,
  setEmail,
  currentEmail,
  setMode,
}: SignupOrganizationProps) {
  // Signup fields for Organization
  const [email, setLocalEmail] = useState(currentEmail); // Use local state, but update parent
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Verification code
  const [code, setCode] = useState("");

  // Determine current "sub-mode" within SignupOrganization
  const isVerifyMode = currentEmail !== ""; // Simplified: if email is set, we're in verify mode

  // Client-side validation for Organization Signup
  function validateOrganizationSignupForm(): boolean {
    if (
      !email ||
      !password ||
      !organizationName ||
      !contactPerson ||
      !phoneNumber ||
      !address
    ) {
      showMessage("error", "Please fill in all required fields for organization signup.");
      return false;
    }

    if (password !== confirmPassword) {
      showMessage("error", "Passwords do not match.");
      return false;
    }

    if (password.length < 8) {
      showMessage("error", "Password must be at least 8 characters long.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showMessage("error", "Please enter a valid email address.");
      return false;
    }

    if (!/^\+?[0-9\s\-]{7,15}$/.test(phoneNumber)) {
      showMessage("error", "Please enter a valid phone number.");
      return false;
    }

    return true;
  }

  async function handleOrganizationSignup() {
    if (!validateOrganizationSignupForm()) return;

    setLoading(true);
    try {
      const signupData = {
        email: email.trim(),
        password,
        organizationName: organizationName.trim(),
        contactPerson: contactPerson.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      };

      // --- DEBUGGING STEP: Log the payload being sent ---
      console.log("Sending organization signup payload:", signupData);

      const res = await fetch("/api/organizations/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      // --- DEBUGGING STEP: Log the full response data from the server ---
      console.log("Received response from organization signup API:", data);

      if (data.success) {
        showMessage("success", "Verification code sent to your organization's email!");
        setEmail(email.trim()); // Update parent's email state for verification
        setMode("verify"); // Switch to verification mode in AuthPage
      } else {
        // Display the specific error message from the backend
        showMessage("error", data.message || "Organization signup failed.");
      }
    } catch (e) {
      showMessage("error", "Organization signup failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOrganization() {
    if (!currentEmail || !code) {
      showMessage("error", "Please enter email and verification code.");
      return;
    }

    if (code.length !== 6) {
      showMessage("error", "Verification code must be 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/organizations/verify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail.trim(), code }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Organization account verified successfully! You can now log in.");
        setMode("login"); // Switch to login mode in AuthPage
        // Clear sensitive form fields after verification
        setPassword("");
        setConfirmPassword("");
        setCode("");
        setLocalEmail(""); // Clear local email too
      } else {
        showMessage("error", data.message || "Organization verification failed.");
      }
    } catch (e) {
      showMessage("error", "Organization verification failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOrganizationCode() {
    if (!currentEmail) {
      showMessage("error", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/organizations/verify-signup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "New verification code sent to your organization's email.");
        setCode(""); // Clear existing code
      } else {
        showMessage("error", data.message || "Failed to resend code.");
      }
    } catch (e) {
      showMessage("error", "Failed to resend code: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={Styles.inputGroup}>
      {/* Email Input - Always visible except in verify mode initially */}
      {!isVerifyMode && (
        <Input
          label="Organization Email Address *"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setLocalEmail(e.target.value)}
          placeholder="Enter your organization's email address"
          showIcon
          icon="Mail"
          disabled={loading}
          required
        />
      )}

      {/* Organization Signup fields */}
      {!isVerifyMode && (
        <>
          <Input
            label="Organization Name *"
            name="organizationName"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Enter your organization's name"
            showIcon
            icon="Building"
            disabled={loading}
            required
          />

          <Input
            label="Contact Person Name *"
            name="contactPerson"
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="Name of the primary contact person"
            showIcon
            icon="User"
            disabled={loading}
            required
          />

          <Input
            label="Phone Number *"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            showIcon
            icon="Phone"
            disabled={loading}
            required
          />

          <Input
            label="Address *"
            name="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your organization's address"
            showIcon
            icon="MapPin"
            disabled={loading}
            required
          />

          <Input
            label="Password *"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            showIcon
            icon="Lock"
            showHelpText
            helpText="At least 8 characters"
            disabled={loading}
            required
          />

          <Input
            label="Confirm Password *"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            showIcon
            icon="Lock"
            disabled={loading}
            required
          />
          <Button
            onClick={handleOrganizationSignup}
            loading={loading}
            label="Create Organization Account"
            disabled={loading}
          />
        </>
      )}

      {/* Verification mode for Organization */}
      {isVerifyMode && (
        <>
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={currentEmail} // Display email from parent state
            onChange={(e) => setEmail(e.target.value)} // Allow changing email for verification
            placeholder="Enter your email address"
            showIcon
            icon="Mail"
            disabled={loading}
            required
          />

          <VerificationCodeInput
            label="Verification Code"
            value={code}
            onChange={setCode}
            length={6}
            autoFocus
            helpText="Enter the 6-digit code sent to your organization's email"
          />
          <Button
            onClick={handleVerifyOrganization}
            loading={loading}
            label="Verify Organization Account"
            disabled={loading || code.length !== 6}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              className={Styles.switchModeButton}
              onClick={handleResendOrganizationCode}
              disabled={loading}
              type="button"
              style={{ fontSize: "14px" }}
            >
              Resend Code
            </button>
            <button
              className={Styles.switchModeButton}
              onClick={() => {
                setMode("signup"); // Go back to main signup choice
                setEmail(""); // Clear email in parent state
                setCode(""); // Clear code
                setLocalEmail(""); // Clear local email
              }}
              disabled={loading}
              type="button"
              style={{ fontSize: "14px" }}
            >
              Back to Sign Up
            </button>
          </div>
        </>
      )}
    </div>
  );
}
