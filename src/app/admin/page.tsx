"use client";

import { useState } from "react";
import Input from "@/ui/input/Input"; // Assuming this path is correct for your Input component
import Button from "@/ui/button/Button"; // Assuming this path is correct for your Button component
import Styles from "./page.module.css"; // CSS module for styling

export default function OrganisationSignupPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Function to display messages and clear them after a delay
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000); // Clear message after 5 seconds
  };

  // Client-side validation
  const validateForm = () => {
    if (!organizationName || !email || !registrationNumber || !password || !confirmPassword) {
      showMessage("error", "Please fill in all required fields.");
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

    // You can add more specific validation for registrationNumber if needed
    // e.g., if it needs to be alphanumeric, a specific length, etc.

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null); // Clear previous messages

    try {
      const response = await fetch("/api/admin/organisationSignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: organizationName,
          email,
          registrationNumber,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", data.message || "Organization registered successfully!");
        // Optionally clear form fields on success
        setOrganizationName("");
        setEmail("");
        setRegistrationNumber("");
        setPassword("");
        setConfirmPassword("");
      } else {
        showMessage("error", data.message || "Signup failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      showMessage("error", `An unexpected error occurred: ${error.message || 'Please check your network.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.page}>
      <div className={Styles.formContainer}>
        <div className={Styles.formHeader}>
          <h2>Register Your Organization</h2>
          <p className="muted-text">Create an account for your organization.</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "1rem",
              borderRadius: "8px",
              backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={Styles.inputGroup}>
          <Input
            label="Organization Name *"
            name="organizationName"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Enter your organization's name"
            showIcon
            icon="Building" // Assuming 'Building' icon exists in your lucide-react setup
            disabled={loading}
            required
          />

          <Input
            label="Email Address *"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter organization's email address"
            showIcon
            icon="Mail"
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
            icon="FileText" // Assuming 'FileText' icon exists
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

          <div className={Styles.actions}>
            <Button
              type="submit" // Important for form submission
              loading={loading}
              label="Register Organization"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
