"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiPlus,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import useAuthStore from "@/store/authStore";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/feed", label: "Feed", icon: FiHome },
    {
      href: `/profile/${user?._id}`,
      label: "Profile",
      icon: FiUser,
      auth: true,
    },
    { href: "/create-post", label: "Create", icon: FiPlus, auth: true },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/feed"
            className="text-xl font-bold text-primary-500 hover:text-primary-600 transition-colors"
          >
            SocialApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(
              (link) =>
                (!link.auth || isAuthenticated) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ),
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white shadow-xl md:hidden dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map(
                (link) =>
                  (!link.auth || isAuthenticated) && (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50 active:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:active:bg-slate-800 transition-colors"
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ),
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-900/10 dark:active:bg-red-900/20 transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                <div className="px-4 py-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary w-full justify-center py-3 text-base"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Simple backdrop area below if needed, though this is absolute so scrollable content is behind */}
            <div
              className="h-screen w-full bg-black/20 backdrop-blur-[1px] md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
