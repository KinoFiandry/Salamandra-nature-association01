"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { DarkModeToggle } from "./DarkModeToggle";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/donate" || (pathname?.startsWith("/admin") && pathname !== "/admin/login")) {
    return null;
  }

  const aboutSubLinks = [
    { href: "/about#presentation", label: "nav.about.presentation" },
    { href: "/about#actions",      label: "nav.about.actions" },
    { href: "/about#documents",    label: "nav.about.docs" },
  ];

  const topLinks = [
    { href: "/",         label: "nav.home" },
    { href: "/partners", label: "nav.partners" },
    { href: "/projects", label: "nav.projects" },
    { href: "/news",     label: "nav.news_events" },
    { href: "/media",    label: "nav.media" },
    { href: "/contact",  label: "nav.contact" },
  ];

  return (
    <nav className="bg-white/80 dark:bg-sage-950/90 backdrop-blur-md border-b border-sage-100 dark:border-sage-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="Salamandra Nature"
                width={200}
                height={64}
                priority
                style={{ height: "4rem", width: "auto" }}
                className="group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {/* Home */}
              <Link
                href="/"
                className="text-sm font-semibold text-sage-700/70 dark:text-sage-300/80 hover:text-sage-800 dark:hover:text-sage-100 transition-colors"
              >
                {t("nav.home")}
              </Link>

              {/* About Us dropdown — pure CSS hover, no React state */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold text-sage-700/70 dark:text-sage-300/80 hover:text-sage-800 dark:hover:text-sage-100 transition-colors">
                  {t("nav.about")}
                  <ChevronDown className="w-4 h-4 transition-transform duration-150 group-hover:rotate-180" />
                </button>

                {/* pt-2 bridges the gap so the menu doesn't flicker on mouse-move */}
                <div className="absolute top-full left-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-100 z-50">
                  <div className="w-52 bg-white dark:bg-sage-900 rounded-2xl shadow-xl border border-sage-100 dark:border-sage-700 py-2">
                    {aboutSubLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-5 py-3 text-sm font-semibold text-sage-700 dark:text-sage-200 hover:bg-sage-50 dark:hover:bg-sage-800 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors"
                      >
                        {t(sub.label)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Remaining top-level links */}
              {topLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-sage-700/70 dark:text-sage-300/80 hover:text-sage-800 dark:hover:text-sage-100 transition-colors"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-sage-100 dark:border-sage-800">
              <DarkModeToggle />
              <LanguageSwitcher />
              <Link
                href="/donate"
                className="bg-terracotta-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-terracotta-600 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {t("nav.donate")}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <DarkModeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-sage-800 dark:text-sage-200 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-sage-950 border-b border-sage-100 dark:border-sage-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-bold text-sage-700 dark:text-sage-200 border-b border-sage-50 dark:border-sage-800"
            >
              {t("nav.home")}
            </Link>

            {/* About Us accordion */}
            <div className="border-b border-sage-50 dark:border-sage-800">
              <button
                onClick={() => setMobileAboutOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-4 text-base font-bold text-sage-700 dark:text-sage-200"
              >
                {t("nav.about")}
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileAboutOpen && (
                <div className="pl-6 pb-2 space-y-1">
                  {aboutSubLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => { setIsOpen(false); setMobileAboutOpen(false); }}
                      className="block px-3 py-3 text-sm font-semibold text-sage-600 dark:text-sage-300 hover:text-terracotta-600"
                    >
                      {t(sub.label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining links */}
            {topLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-bold text-sage-700 dark:text-sage-200 border-b border-sage-50 dark:border-sage-800 last:border-0"
              >
                {t(link.label)}
              </Link>
            ))}

            <div className="pt-4">
              <Link
                href="/donate"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-terracotta-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-md"
              >
                {t("nav.donate")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
