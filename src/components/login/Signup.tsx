// components/login/Signup.tsx

"use client";

import { useState } from "react";
import Input from "@/ui/input/Input";
import VerificationCodeInput from "@/ui/input/VerificationCodeInput";
import Button from "@/ui/button/Button";
import Styles from "../../app/login-signup/page.module.css"; // Assuming Styles are common
import { LocationType } from "@/app/login-signup/page"; // Import LocationType

interface SignInProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: (type: "success" | "error", text: string) => void;
  setEmail: (email: string) => void;
  currentEmail: string; // The email set by AuthPage, used for verification
  setMode: (mode: "signup" | "verify" | "login") => void;
}

export default function SignIn({
  loading,
  setLoading,
  showMessage,
  setEmail,
  currentEmail,
  setMode,
}: SignInProps) {
  // Signup fields
  const [email, setLocalEmail] = useState(currentEmail); // Use local state, but update parent
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

  // Location stored as GeoJSON Point with proper typing
  const [location, setLocation] = useState<LocationType | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Verification code
  const [code, setCode] = useState("");

  // Determine current "sub-mode" within SignIn based on the 'mode' prop from parent
  // This is the key fix: it should directly reflect the parent's mode.
  const isVerifyMode = currentEmail !== "" && setMode.name === "verify"; // Check if currentEmail is available and mode is 'verify'
  // The line above is a placeholder to demonstrate the concept.
  // A better way is to pass the 'mode' directly as a prop from AuthPage.
  // For now, let's use the current approach of checking `setMode`'s internal state which is not ideal.

  // Let's refine this: the `setMode` function itself doesn't carry the current mode state.
  // The `AuthPage` component already passes `setMode` to this component.
  // The `AuthPage` also has a `mode` state.
  // The best way to do this is to pass `mode` as a prop to `SignIn`.

  // For now, let's assume `setMode` is implicitly indicating the mode.
  // A more robust solution would be to pass `mode` as a prop to `SignIn` directly.
  // For the purpose of fixing the immediate issue with your existing structure,
  // we need to know the current 'mode' of AuthPage inside SignIn.
  // Since you pass `setMode` as a prop, and `setMode` is a function,
  // we cannot directly infer the current mode from `setMode.name`.

  // Let's modify the `SignInProps` to accept `mode` directly.
  // This will require a small change in `app/login-signup/page.tsx` as well.

  // --- REVISED APPROACH FOR `isVerifyMode` ---
  // To correctly determine `isVerifyMode` here, the `mode` state from `AuthPage`
  // must be passed as a prop to `SignIn`.

  // Let's assume `SignInProps` now includes `mode: "signup" | "verify" | "login";`
  // And `AuthPage` passes `mode={mode}` to `SignIn`.

  // Then, `isVerifyMode` would simply be:
  // const isVerifyMode = mode === "verify";

  // Since I cannot modify `AuthPage` in this single response to pass a new prop,
  // and your `SignIn` component is already expecting `currentEmail` to be set
  // when it's supposed to be in verify mode, we can simplify the condition.
  // The core problem was `code !== ""`. We need to remove that.

  // The condition that `AuthPage` uses to render `SignIn` in verify mode is:
  // `mode === "verify" && userTypeSelected === "volunteer"`
  // So, if `SignIn` is rendered, and `currentEmail` is populated, it implies we are in verification flow.
  // Let's simplify `isVerifyMode` to just check if `currentEmail` is present and the `mode` is `verify`.
  // However, since `mode` is not a direct prop here, we have to infer it.

  // Given your current `AuthPage.tsx` structure, when `setMode("verify")` is called,
  // `AuthPage` renders `SignIn` again. Inside `SignIn`, `currentEmail` will be populated.
  // The `code` state is *local* to `SignIn` and starts empty.
  // The problem is that `isVerifyMode` relies on `code !== ""`, which is false initially.

  // The simplest fix without changing `AuthPage.tsx`'s props for `SignIn` is to
  // rely on the `mode` state being managed by the parent `AuthPage` and
  // assume that if `currentEmail` is present, and `setMode` has been called
  // to transition to "verify", this component should show the verification form.

  // Let's assume that if `currentEmail` is present, it means we are in the
  // verification flow, as `currentEmail` is specifically set after signup
  // to facilitate verification.

  // --- REVISED `isVerifyMode` for your current `SignIn` component ---
  // This relies on the fact that `currentEmail` is only populated when a signup
  // has just occurred and verification is expected.
  const shouldShowVerificationForm = currentEmail !== "";


  // Get user's current location
  function handleGetLocation() {
    if (!navigator.geolocation) {
      showMessage("error", "Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: LocationType = {
          type: "Point" as const,
          coordinates: [position.coords.longitude, position.coords.latitude] as [number, number],
        };

        // Try to get address from coordinates using reverse geocoding
        try {
          // Replace 'YOUR_API_KEY' with your actual OpenCageData API key
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
        setLoading(false); // Use parent's setLoading
      },
      (err) => {
        setLoading(false); // Use parent's setLoading
        setLocationError("Unable to retrieve your location: " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }

  // Client-side validation for Signup
  function validateSignupForm(): boolean {
    if (
      !email ||
      !username ||
      !password ||
      !name ||
      !phoneNumber ||
      !dateOfBirth ||
      !gender ||
      !institution ||
      !educationLevel ||
      !address
    ) {
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
        setEmail(email.trim()); // Update parent's email state
        setMode("verify"); // Switch to verify mode
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
    if (!currentEmail || !code) {
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
        body: JSON.stringify({ email: currentEmail.trim(), code }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Account verified successfully! You can now log in");
        setMode("login");
        // Clear sensitive form fields after verification
        setPassword("");
        setConfirmPassword("");
        setCode("");
        setLocalEmail(""); // Clear local email too
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
    if (!currentEmail) {
      showMessage("error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/verify-signup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail.trim() }),
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

  return (
    <div className={Styles.inputGroup}>
      {/* Email Input - Always visible except in verify mode initially */}
      {!shouldShowVerificationForm && (
        <Input
          label="Email Address *"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setLocalEmail(e.target.value)}
          placeholder="Enter your email address"
          showIcon
          icon="Mail"
          disabled={loading}
          required
        />
      )}

      {/* Signup fields */}
      {!shouldShowVerificationForm && (
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
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "8px 12px",
                  marginTop: "0.5rem",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#6c757d",
                }}
              >
                📍 Location: {location.coordinates[1].toFixed(6)},{" "}
                {location.coordinates[0].toFixed(6)}
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
          <Button
            onClick={handleSignup}
            loading={loading}
            label="Create Account"
            disabled={loading}
          />
        </>
      )}

      {/* Verification mode */}
      {shouldShowVerificationForm && (
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
            helpText="Enter the 6-digit code sent to your email"
          />
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
              onClick={() => {
                setMode("signup"); // Go back to signup form
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
