"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { CircleUser, Compass } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SmartSearch from "./smart-search";
import { addBasePath } from "next/dist/client/add-base-path";

export function Header({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function checkSession() {
      const response = await fetch(addBasePath("/api/session/validate"));
      const { session } = await response.json();
      setIsLoggedIn(!!session);
    }
    checkSession();
  }, []);

  async function handleLogout() {
    await fetch(addBasePath("/api/session/logout"), { method: "POST" }); // Logging out user
    setIsLoggedIn(false); // Update state to logged out
  }

  async function handleSignIn() {
    router.push("/login"); // Redirecting to login page
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg md:text-base compass-origin"
          >
            <Compass className="h-6 w-6 compass" />
            <span className="hidden whitespace-nowrap md:flex">
              Spartan Compass
            </span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto">
          {pathname !== "/" && pathname !== "/search" && (
            <SmartSearch type="half" />
          )}
          {(pathname === "/" || pathname === "/search") && (
            <span className="ml-auto flex-initial"></span>
          )}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/userprofile")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignIn}>
                  Sign In
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
        </div>
      </header>
      {children}
    </div>
  );
}
