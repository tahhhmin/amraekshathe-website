// app/auth/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      body: JSON.stringify({ email, username, password })
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
      body: JSON.stringify({ email, password, code })
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
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      router.push("/profile");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === "signup" ? "Sign Up" : mode === "verify" ? "Verify Email" : "Login"}
      </h1>

      {mode !== "verify" && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="block w-full mb-2 px-4 py-2 border rounded"
        />
      )}

      {mode === "signup" && (
        <>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="block w-full mb-2 px-4 py-2 border rounded"
          />
        </>
      )}

      {(mode === "signup" || mode === "login") && (
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full mb-2 px-4 py-2 border rounded"
        />
      )}

      {mode === "verify" && (
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Verification Code"
          className="block w-full mb-2 px-4 py-2 border rounded"
        />
      )}

      <button
        onClick={mode === "signup" ? handleSignup : mode === "verify" ? handleVerify : handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        {mode === "signup" ? "Send Verification Code" : mode === "verify" ? "Verify & Register" : "Login"}
      </button>

      <div className="mt-4 text-sm text-center">
        {mode === "signup" ? (
          <span>
            Already have an account?{' '}
            <button className="underline" onClick={() => setMode("login")}>Login</button>
          </span>
        ) : mode === "login" ? (
          <span>
            Don't have an account?{' '}
            <button className="underline" onClick={() => setMode("signup")}>Sign Up</button>
          </span>
        ) : null}
      </div>
    </div>
  );
}
