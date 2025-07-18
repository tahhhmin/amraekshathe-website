// app/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/users/profile", { method: "POST" });
      const data = await res.json();
      if (!data?.data) return router.push("/auth");
      setUser(data.data);
    }
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user && (
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
