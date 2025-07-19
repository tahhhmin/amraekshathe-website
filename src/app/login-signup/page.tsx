// app/login-signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/ui/input/Input";
import VerificationCodeInput from "@/ui/input/VerificationCodeInput";
import Button from "@/ui/button/Button";
import Styles from './page.module.css'


export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"signup" | "verify" | "login">("signup");

  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/users/signup", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();

    if (data.success) {
      alert("Verification code sent to email");
      setMode("verify");
    } else {
      alert(data.message);
    }
  };

  const handleVerify = async () => {
    const res = await fetch("/api/users/verify-signup", {
      method: "POST",
      body: JSON.stringify({ email, password, code }),
    });
    const data = await res.json();

    if (data.success) {
      alert("Signup complete. You can now log in.");
      setMode("login");
    } else {
      alert(data.message);
    }
  };

  const handleLogin = async () => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.success) {
      router.push("/profile");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className={Styles.page}>

        <div className={Styles.formContainer}>
            <div className={Styles.formHeader}>
                <div>
                <h2>
                    {mode === "signup"
                    ? "Sign Up"
                    : mode === "verify"
                    ? "Verify Email"
                    : "Login"}
                </h2>
                 <p className='muted-text'>Login Form</p>
                 </div>

                 <div className={Styles.headerButton}>
                    <Button
                        variant="icon"
                        showIcon
                        icon="X"
                        onClick={() => router.back()}
                    />
                 </div>
            </div>
            <div className={Styles.inputGroup}>
        {/* Email Input */}
        {mode !== "verify" && (
            <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                showIcon
                icon="Mail"
                showHelpText
                helpText="Enter your email here"
            />
        )}

        {/* Username Input (only in signup) */}
        {mode === "signup" && (
            <Input
                label="Username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                showIcon
                icon="User"
                              showHelpText
                helpText="Enter your username here"
            />
        )}

        {/* Password Input (in signup and login) */}
        {(mode === "signup" || mode === "login") && (
                    <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    showIcon
                    icon="Lock"
                                  showHelpText
                helpText="Enter your password here"
            />
            

        )}

        {/* Verification Code Input (in verify mode only) */}
        {mode === "verify" && (
        <VerificationCodeInput
            label="Verification Code"
            value={code}
            onChange={(val) => setCode(val)} 
            length={6}
            autoFocus
            helpText="Enter the 6-digit code sent to your email."
        />
        )}
        </div>
        {/* Action Button */}
            <div className={Styles.buttonContainer}>
            <Button
                onClick={
                mode === "signup"
                    ? handleSignup
                    : mode === "verify"
                    ? handleVerify
                    : handleLogin
                }
                label={
                mode === "signup"
                    ? "Send Verification Code"
                    : mode === "verify"
                    ? "Verify & Register"
                    : "Login"
                }
                variant="primary"
                showIcon
            />
            </div>
        

        {/* Footer Links */}
        <div className={Styles.formFooter}>
            {mode === "signup" ? (
            <span>
                Already have an account?{" "}
                <a className="underline" onClick={() => setMode("login")}>
                Login here
                </a>
            </span>
            ) : mode === "login" ? (
            <span>
                Don&#39;t have an account?{" "}
                <a className="underline" onClick={() => setMode("signup")}>
                Sign Up
                </a>
            </span>
            ) : null}
        </div>
        </div>
    </div>
  );
}
