"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        // Redirect user after successful logout
        router.push("/login"); // or "/" or wherever you want
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      alert("An error occurred while logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
