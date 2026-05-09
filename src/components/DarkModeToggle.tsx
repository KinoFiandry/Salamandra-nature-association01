"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-terracotta-400" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
