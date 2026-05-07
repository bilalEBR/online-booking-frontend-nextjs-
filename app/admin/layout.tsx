"use client";
import Sidebar from "@/app/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "MANAGER") {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="MANAGER" />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}