"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./page.module.css"; // Assuming Styles are common
import SignIn from "@/components/login/Signup";
import LoginUser from "@/components/login/LoginUser";
import LoginOrganization from "@/components/login/LoginOrganization";
import Button from "@/ui/button/Button"; // Assuming Button is a shared UI component

// Define the location type with optional address property
export type LocationType = {
  type: "Point";
  coordinates: [number, number];
  address?: string;
};

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signup" | "verify" | "login">("signup");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loginType, setLoginType] = useState<"volunteer" | "organization">("volunteer"); // Default to volunteer

  // Common email state for verification and login after signup
  const [email, setEmail] = useState("");

  // Clear message after 5 seconds
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const commonProps = {
    loading,
    setLoading,
    showMessage,
    setEmail, // Pass setEmail for SignIn to update email state for verification
    currentEmail: email, // Pass current email to children
    setMode, // To switch modes
  };

  return (
    <div className={Styles.page}>
      <div className={Styles.formContainer}>
        <div className={Styles.formHeader}>
          <div>
            <h2>{mode === "signup" ? "Sign Up" : mode === "verify" ? "Verify Email" : "Login"}</h2>
            <p className="muted-text">
              {mode === "login"
                ? "Welcome back! Please sign in to your account"
                : mode === "verify"
                ? "Please enter the verification code sent to your email"
                : "Create your account to get started"}
            </p>
          </div>
          <div className={Styles.headerButton}>
            <Button
              variant="icon"
              showIcon
              icon="X"
              onClick={() => router.back()}
              disabled={loading}
            />
          </div>
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

        {/* Render components based on mode */}
        {mode === "signup" && (
          <SignIn
            {...commonProps}
          />
        )}

        {mode === "verify" && (
          <SignIn // Re-using SignIn for verification flow as it handles both
            {...commonProps}
          />
        )}

        {mode === "login" && (
          <>
            <div className={Styles.loginTabs}>
              <button
                className={`${Styles.tabButton} ${loginType === "volunteer" ? Styles.activeTab : ""}`}
                onClick={() => setLoginType("volunteer")}
                disabled={loading}
                type="button"
              >
                Volunteer
              </button>
              <button
                className={`${Styles.tabButton} ${loginType === "organization" ? Styles.activeTab : ""}`}
                onClick={() => setLoginType("organization")}
                disabled={loading}
                type="button"
              >
                Organization
              </button>
            </div>

            {loginType === "volunteer" ? (
              <LoginUser
                {...commonProps}
                router={router}
              />
            ) : (
              <LoginOrganization
                {...commonProps}
                router={router}
              />
            )}
          </>
        )}

        {/* Switch Mode Text */}
        <div className={Styles.actions}>
          {mode === "signup" && (
            <p className={Styles.switchModeText}>
              Already have an account?{" "}
              <button
                className={Styles.switchModeButton}
                onClick={() => setMode("login")}
                disabled={loading}
                type="button"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === "login" && (
            <p className={Styles.switchModeText}>
              Don&apos;t have an account?{" "}
              <button
                className={Styles.switchModeButton}
                onClick={() => setMode("signup")}
                disabled={loading}
                type="button"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}