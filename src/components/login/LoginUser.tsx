// components/login/LoginUser.tsx

"use client";

import { useState } from "react";
import Input from "@/ui/input/Input";
import Button from "@/ui/button/Button";
import Styles from "../../app/login-signup/page.module.css"; // Assuming Styles are common
import { useRouter } from "next/navigation"; // Import useRouter directly

interface LoginUserProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: (type: "success" | "error", text: string) => void;
  router: ReturnType<typeof useRouter>; // Correct type for useRouter hook
  setEmail: (email: string) => void;
  currentEmail: string;
  setMode: (mode: "signup" | "verify" | "login") => void;
}

export default function LoginUser({
  loading,
  setLoading,
  showMessage,
  router,
  setEmail,
  currentEmail,
}: LoginUserProps) {
  const [email, setLocalEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");

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
        loginType: "volunteer", // This is for your internal tracking if needed
      };

      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("success", "Login successful! Redirecting to volunteer profile...");
        setTimeout(() => {
          router.push("/user/profile");
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
        placeholder="Enter your email address"
        showIcon
        icon="Mail"
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
