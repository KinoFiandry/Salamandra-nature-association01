"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.news": "News",
    "nav.media": "Media",
    "nav.contact": "Contact",
    "nav.donate": "Donate",
    "hero.title": "Protecting the Sea Turtles of Madagascar",
    "hero.subtitle": "Dedicated to the conservation of endangered species and their habitats through community action and scientific research.",
    "hero.cta": "Support Our Mission",
    "about.title": "Our Mission",
    "about.history": "Founded with a passion for marine life, our NGO has been working for over a decade to protect Madagascar's unique turtle populations.",
    "projects.title": "Conservation Projects",
    "news.title": "Latest Updates",
    "contact.title": "Get in Touch",
    "footer.rights": "All rights reserved.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À Propos",
    "nav.projects": "Projets",
    "nav.news": "Actualités",
    "nav.media": "Média",
    "nav.contact": "Contact",
    "nav.donate": "Faire un don",
    "hero.title": "Protéger les Tortues Marines de Madagascar",
    "hero.subtitle": "Dédié à la conservation des espèces menacées et de leurs habitats grâce à l'action communautaire et à la recherche scientifique.",
    "hero.cta": "Soutenir notre mission",
    "about.title": "Notre Mission",
    "about.history": "Fondée avec une passion pour la vie marine, notre ONG travaille depuis plus d'une décennie pour protéger les populations de tortues uniques de Madagascar.",
    "projects.title": "Projets de Conservation",
    "news.title": "Dernières Nouvelles",
    "contact.title": "Contactez-nous",
    "footer.rights": "Tous droits réservés.",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved && (saved === "en" || saved === "fr")) {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
