"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";

export function Navbar() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: 'nav.home' },
    { href: "/about", label: 'nav.about' },
    { href: "/projects", label: 'nav.projects' },
    { href: "/news", label: 'nav.news' },
    { href: "/media", label: 'nav.media' },
    { href: "/contact", label: 'nav.contact' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-emerald-900 leading-tight">Turtle Conservation</span>
                <span className="text-xs text-emerald-600 font-medium tracking-wider uppercase">Madagascar</span>
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-emerald-800/70 hover:text-emerald-900 transition-colors"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4 pl-4 border-l border-emerald-100">
              <LanguageSwitcher />
              <Link
                href="/donate"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {t('nav.donate')}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-900 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-bold text-emerald-800 border-b border-emerald-50 last:border-0"
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/donate"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-md"
              >
                {t('nav.donate')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
