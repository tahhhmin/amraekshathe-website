"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/ui/input/Input";
import VerificationCodeInput from "@/ui/input/VerificationCodeInput";
import Button from "@/ui/button/Button";
import Styles from "./page.module.css";

// Define the location type with optional address property
type LocationType = {
  type: "Point";
  coordinates: [number, number];
  address?: string;
};

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signup" | "verify" | "login">("signup");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Signup fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [institution, setInstitution] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState<"volunteer" | "organisation">("volunteer");

  // Location stored as GeoJSON Point with proper typing
  const [location, setLocation] = useState<LocationType | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Verification code
  const [code, setCode] = useState("");

  // Clear message after 5 seconds
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Get user's current location
  function handleGetLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: LocationType = {
          type: "Point" as const,
          coordinates: [position.coords.longitude, position.coords.latitude] as [number, number],
        };

        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              coords.address = data.results[0].formatted;
            }
          }
        } catch (e) {
          // Ignore geocoding errors, just use coordinates
          console.log("Reverse geocoding failed:", e);
        }

        setLocation(coords);
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        setLocationError("Unable to retrieve your location: " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }

  // Client-side validation
  function validateSignupForm(): boolean {
    if (!email || !username || !password || !name || !phoneNumber || 
        !dateOfBirth || !gender || !institution || !educationLevel || !address) {
      showMessage("error", "Please fill in all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      showMessage("error", "Passwords do not match");
      return false;
    }

    if (password.length < 8) {
      showMessage("error", "Password must be at least 8 characters long");
      return false;
    }

    if (username.length < 3 || username.length > 30) {
      showMessage("error", "Username must be between 3 and 30 characters");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showMessage("error", "Username can only contain letters, numbers, and underscores");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showMessage("error", "Please enter a valid email address");
      return false;
    }

    if (!/^\+?[0-9\s\-]{7,15}$/.test(phoneNumber)) {
      showMessage("error", "Please enter a valid phone number");
      return false;
    }

    // Check age
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      showMessage("error", "Age must be between 13 and 120 years");
      return false;
    }

    return true;
  }

  async function handleSignup() {
    if (!validateSignupForm()) return;

    setLoading(true);
    try {
      const signupData = {
        email: email.trim(),
        username: username.trim(),
        password,
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth,
        gender,
        institution: institution.trim(),
        educationLevel: educationLevel.trim(),
        address: address.trim(),
        userType,
        ...(location && { location }),
      };

      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Verification code sent to your email!");
        setMode("verify");
      } else {
        showMessage("error", data.message || "Signup failed");
      }
    } catch (e) {
      showMessage("error", "Signup failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!email || !code) {
      showMessage("error", "Please enter email and verification code");
      return;
    }

    if (code.length !== 6) {
      showMessage("error", "Verification code must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/verify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Account verified successfully! You can now log in");
        setMode("login");
        // Clear form fields
        setPassword("");
        setConfirmPassword("");
        setCode("");
      } else {
        showMessage("error", data.message || "Verification failed");
      }
    } catch (e) {
      showMessage("error", "Verification failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (!email) {
      showMessage("error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/verify-signup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "New verification code sent to your email");
        setCode(""); // Clear existing code
      } else {
        showMessage("error", data.message || "Failed to resend code");
      }
    } catch (e) {
      showMessage("error", "Failed to resend code: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      showMessage("error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(), 
          password 
        }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/profile");
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

        <div className={Styles.inputGroup}>
          {/* Email Input - Always visible except in verify mode initially */}
          {mode !== "verify" && (
            <Input
              label="Email Address *"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              showIcon
              icon="Mail"
              disabled={loading}
              required
            />
          )}

          {/* Signup fields */}
          {mode === "signup" && (
            <>
              <Input
                label="Username *"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                showIcon
                icon="User"
                showHelpText
                helpText="3-30 characters, letters, numbers, and underscores only"
                disabled={loading}
                required
              />
              
              <Input
                label="Full Name *"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
                required
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Input
                  label="Phone Number *"
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  disabled={loading}
                  required
                />
                
                <Input
                  label="Date of Birth *"
                  name="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={loading}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                    Account Type
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as "volunteer" | "organisation")}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="organisation">Organisation</option>
                  </select>
                </div>
              </div>

              <Input
                label="Institution *"
                name="institution"
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Your school, university, or workplace"
                disabled={loading}
                required
              />

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                  Education Level *
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  disabled={loading}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                >
                  <option value="">Select Education Level</option>
                  <option value="high_school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="professional">Professional</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Input
                label="Address *"
                name="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your current address"
                disabled={loading}
                required
              />

              {/* Location Button */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                  Location (Optional)
                </label>
                <Button
                  onClick={handleGetLocation}
                  disabled={locationLoading || loading}
                  label={
                    locationLoading
                      ? "Getting Location..."
                      : location
                      ? "✓ Location Captured"
                      : "📍 Get Current Location"
                  }
                  variant={location ? "primary" : "secondary"}
                />
                {locationError && (
                  <p style={{ color: "#dc3545", marginTop: "0.5rem", fontSize: "14px" }}>
                    {locationError}
                  </p>
                )}
                {location && (
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "8px 12px",
                    marginTop: "0.5rem",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#6c757d",
                  }}>
                    📍 Location: {location.coordinates[1].toFixed(6)}, {location.coordinates[0].toFixed(6)}
                    {location.address && <div>📍 {location.address}</div>}
                  </div>
                )}
              </div>

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
            </>
          )}

          {/* Verification mode */}
          {mode === "verify" && (
            <>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                helpText="Enter the 6-digit code sent to your email"
              />
            </>
          )}

          {/* Login mode */}
          {mode === "login" && (
            <>
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
            </>
          )}
        </div>

        <div className={Styles.actions}>
          {/* Action Buttons */}
          {mode === "signup" && (
            <>
              <Button 
                onClick={handleSignup} 
                loading={loading} 
                label="Create Account" 
                disabled={loading}

              />
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
            </>
          )}

          {mode === "verify" && (
            <>
              <Button 
                onClick={handleVerify} 
                loading={loading} 
                label="Verify Account" 
                disabled={loading || code.length !== 6}

              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  className={Styles.switchModeButton}
                  onClick={handleResendCode}
                  disabled={loading}
                  type="button"
                  style={{ fontSize: "14px" }}
                >
                  Resend Code
                </button>
                <button
                  className={Styles.switchModeButton}
                  onClick={() => setMode("signup")}
                  disabled={loading}
                  type="button"
                  style={{ fontSize: "14px" }}
                >
                  Back to Sign Up
                </button>
              </div>
            </>
          )}

          {mode === "login" && (
            <>
              <Button 
                onClick={handleLogin} 
                loading={loading} 
                label="Sign In" 
                disabled={loading}

              />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}




