// components/AuthButton.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from '@/ui/button/Button'

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
    router.push(isLoggedIn ? "/profile" : "/login-signup");
  };



  return (

    <Button
        onClick={handleClick}
        variant="primary"
        label= {isLoggedIn ? "Profile" : "Login / Signup"}
        showIcon
    />
  );
}