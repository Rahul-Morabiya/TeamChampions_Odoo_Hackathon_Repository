"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/fetcher";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useSWR("/api/auth/me", fetcher);
  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    { href: "/(dashboard)/admin", label: "Admin", roles: ["admin"] },
    { href: "/(dashboard)/employee", label: "Employee", roles: ["employee", "manager", "admin"] },
    { href: "/(dashboard)/approver", label: "Approver", roles: ["manager", "admin"] },
  ];

  const show = (roles: string[]) => {
    if (!data?.user) return false;
    return roles.includes(data.user.role);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link className="font-semibold" href="/">
            Expense Approvals
          </Link>
          <nav className="flex items-center gap-2">
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              nav
                .filter((item) => show(item.roles))
                .map((item) => (
                  <Link
                    key={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm hover:bg-accent",
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))
            )}
            {data?.user ? (
              <Button size="sm" variant="secondary" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}