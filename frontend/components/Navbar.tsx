"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          Expense Approvals
        </Link>
        <div className="hidden md:flex gap-3">
          {!loggedIn ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
        <button
          className="md:hidden p-2"
          aria-label="Open navigation menu"
          onClick={() => setOpen((p) => !p)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {open && (
          <div className="absolute top-[60px] right-3 flex flex-col bg-white/95 shadow rounded py-4 px-5 gap-2 md:hidden">
            {!loggedIn ? (
              <>
                <Link href="/login" className="py-2 px-0 font-bold" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="py-2 px-0 font-bold" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            ) : (
              <button className="py-2 px-0 font-bold" onClick={() => { setOpen(false); handleLogout(); }}>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}