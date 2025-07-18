// components/AuthButton.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/users/profile", { method: "POST" });
        const data = await res.json();
        setIsLoggedIn(!!data?.data);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  const handleClick = () => {
    router.push(isLoggedIn ? "/profile" : "/auth");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {isLoggedIn ? "Profile" : "Login / Signup"}
    </button>
  );
}