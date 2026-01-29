"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.projects': 'Projects',
      'nav.news': 'News',
      'nav.media': 'Media',
      'nav.events': 'Events',
      'nav.partners': 'Partners',
        'nav.contact': 'Contact',
        'nav.admin': 'Admin',
        'nav.donate': 'Donate Now',
      'hero.title': 'Protecting Madagascar\'s',
      'hero.titleAccent': 'Land Turtles',
      'hero.subtitle': 'Join us in our mission to conserve endangered land turtle species and preserve their dry forest habitats in southern Madagascar.',
      'hero.cta': 'Support Our Cause',
      'hero.learnMore': 'Learn More',
      'impact.title': 'Our Impact',
      'impact.years': 'Years of Conservation',
      'impact.turtles': 'Turtles Protected',
      'impact.communities': 'Local Communities',
      'impact.hectares': 'Hectares Protected',
      'programs.title': 'Our Programs',
      'programs.habitat.title': 'Habitat Protection',
      'programs.habitat.desc': 'Preserving critical dry forests and scrublands essential for land turtle survival in southern Madagascar.',
      'programs.edu.title': 'Community Education',
      'programs.edu.desc': 'Engaging local communities through awareness programs and sustainable livelihood alternatives.',
      'programs.research.title': 'Research & Monitoring',
      'programs.research.desc': 'Conducting scientific research to better understand and protect endangered land turtle populations.',
      'cta.title': 'Every Donation Makes a Difference',
      'cta.desc': 'Your support helps us protect endangered land turtles, preserve their habitats, and educate communities. Join us in making a lasting impact.',
      'cta.button': 'Make a Donation Today',
        'footer.desc': 'Salamandra Nature - Dedicated to protecting Madagascar\'s endangered land tortoises since 2004.',
      'footer.links': 'Quick Links',
      'footer.contact': 'Contact',
      'footer.follow': 'Follow Us',
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Have questions or want to volunteer? Send us a message.',
        'contact.name': 'Full Name',
        'contact.email': 'Email Address',
        'contact.subject': 'Subject',
        'contact.message': 'Message',
        'contact.send': 'Send Message',
        'contact.sending': 'Sending...',
        'contact.success': 'Message sent successfully!',
        'contact.error': 'Failed to send message. Please try again.',
        'contact.send_another': 'Send Another Message',
        'contact.address_label': 'Address',
        'contact.email_label': 'Email',
        'contact.phone_label': 'Phone',
        'about.title': 'About Us',
      'about.presentation': 'Overview',
      'about.actions': 'Our Actions',
      'news.title': 'Latest News',
      'projects.title': 'Our Conservation Projects',
      'media.title': 'Photo & Video Gallery',
      'events.title': 'Events Calendar',
      'events.search': 'Search Events',
      'partners.title': 'Our Partners',
      'admin.dashboard': 'Admin Dashboard',
      'donate.thanks': 'Thank You!',
      'donate.thanksDesc': 'Your generous donation of {amount} will help protect Madagascar\'s endangered turtles. Every contribution makes a difference in our conservation efforts.',
      'donate.emailSent': 'A confirmation email has been sent to {email}.',
      'donate.returnHome': 'Return Home',
      'donate.backHome': 'Back to Home',
      'donate.title': 'Support Turtle Conservation',
      'donate.subtitle': 'Your donation directly supports our mission to protect Madagascar\'s endangered turtle species and their habitats.',
      'donate.impactTitle': 'Your Impact',
      'donate.impact1': 'Provides food for rescued turtles for one week',
      'donate.impact2': 'Supports nest protection for one nesting season',
      'donate.impact3': 'Funds community education workshops',
      'donate.impact4': 'Sponsors habitat restoration for one hectare',
      'donate.secureTitle': '100% Secure Donation',
      'donate.secureDesc': 'Your payment information is encrypted and secure. Pay directly with your credit or debit card - no PayPal account required. Funds go directly to our association\'s PayPal account.',
      'donate.makeDonation': 'Make a Donation',
      'donate.selectAmount': 'Select Amount',
      'donate.customAmountLabel': 'Or enter custom amount',
      'donate.customAmountPlaceholder': 'Custom amount',
      'donate.fullName': 'Full Name',
      'donate.emailAddress': 'Email Address',
      'donate.donationAmount': 'Donation amount:',
      'donate.continue': 'Continue to Payment',
      'donate.details': 'Donation Details',
      'donate.edit': 'Edit'
    },
    fr: {
      'nav.home': 'Accueil',
      'nav.about': 'À Propos',
      'nav.projects': 'Projets',
      'nav.news': 'Actualités',
      'nav.media': 'Médias',
      'nav.events': 'Événements',
      'nav.partners': 'Partenaires',
        'nav.contact': 'Contact',
        'nav.admin': 'Admin',
        'nav.donate': 'Faire un Don',
      'hero.title': 'Protéger les',
      'hero.titleAccent': 'Tortues Terrestres de Madagascar',
      'hero.subtitle': 'Rejoignez-nous dans notre mission de conservation des espèces de tortues terrestres menacées et de préservation de leurs habitats de forêt sèche dans le sud de Madagascar.',
      'hero.cta': 'Soutenir notre Cause',
      'hero.learnMore': 'En savoir plus',
      'impact.title': 'Notre Impact',
      'impact.years': 'Années de Conservation',
      'impact.turtles': 'Tortues Protégées',
      'impact.communities': 'Communautés Locales',
      'impact.hectares': 'Hectares Protégés',
      'programs.title': 'Nos Programmes',
      'programs.habitat.title': 'Protection de l\'Habitat',
      'programs.habitat.desc': 'Préservation des forêts sèches et des broussailles critiques essentielles à la survie des tortues terrestres dans le sud de Madagascar.',
      'programs.edu.title': 'Éducation Communautaire',
      'programs.edu.desc': 'Impliquer les communautés locales par des programmes de sensibilisation et des alternatives de subsistance durables.',
      'programs.research.title': 'Recherche & Suivi',
      'programs.research.desc': 'Mener des recherches scientifiques pour mieux comprendre et protéger les populations de tortues terrestres menacées.',
      'cta.title': 'Chaque Don Fait la Différence',
      'cta.desc': 'Votre soutien nous aide à protéger les tortues terrestres menacées, préserver leurs habitats et éduquer les communautés.',
      'cta.button': 'Faire un Don Aujourd\'hui',
        'footer.desc': 'Salamandra Nature - Dévouée à la protection des tortues terrestres menacées de Madagascar depuis 2004.',
      'footer.links': 'Liens Rapides',
      'footer.contact': 'Contact',
        'footer.follow': 'Suivez-nous',
        'contact.title': 'Contactez-nous',
        'contact.subtitle': 'Vous avez des questions ou souhaitez devenir bénévole ? Envoyez-nous un message.',
        'contact.name': 'Nom complet',
        'contact.email': 'Adresse e-mail',
        'contact.subject': 'Sujet',
        'contact.message': 'Message',
        'contact.send': 'Envoyer le message',
        'contact.sending': 'Envoi en cours...',
        'contact.success': 'Message envoyé avec succès !',
        'contact.error': 'Échec de l\'envoi du message. Veuillez réessayer.',
        'contact.send_another': 'Envoyer un autre message',
        'contact.address_label': 'Adresse',
        'contact.email_label': 'Email',
        'contact.phone_label': 'Téléphone',
        'about.title': 'À Propos',
      'about.presentation': 'Présentation Générale',
      'about.actions': 'Nos Actions',
      'news.title': 'Dernières Actualités',
      'projects.title': 'Nos Projets de Conservation',
      'media.title': 'Galerie Photo & Vidéo',
      'events.title': 'Calendrier des Événements',
      'events.search': 'Rechercher des Événements',
      'partners.title': 'Nos Partenaires',
      'admin.dashboard': 'Tableau de Bord Admin',
      'donate.thanks': 'Merci !',
      'donate.thanksDesc': 'Votre don généreux de {amount} aidera à protéger les tortues menacées de Madagascar. Chaque contribution fait une différence dans nos efforts de conservation.',
      'donate.emailSent': 'Un e-mail de confirmation a été envoyé à {email}.',
      'donate.returnHome': 'Retour à l\'accueil',
      'donate.backHome': 'Retour à l\'accueil',
      'donate.title': 'Soutenir la Conservation des Tortues',
      'donate.subtitle': 'Votre don soutient directement notre mission de protection des espèces de tortues menacées de Madagascar et de leurs habitats.',
      'donate.impactTitle': 'Votre Impact',
      'donate.impact1': 'Fournit de la nourriture aux tortues sauvées pendant une semaine',
      'donate.impact2': 'Soutient la protection des nids pour une saison de nidification',
      'donate.impact3': 'Finance des ateliers d\'éducation communautaire',
      'donate.impact4': 'Parraine la restauration de l\'habitat pour un hectare',
      'donate.secureTitle': 'Don 100% Sécurisé',
      'donate.secureDesc': 'Vos informations de paiement sont cryptées et sécurisées. Payez directement avec votre carte de crédit ou de débit - aucun compte PayPal n\'est requis. Les fonds vont directement sur le compte PayPal de notre association.',
      'donate.makeDonation': 'Faire un Don',
      'donate.selectAmount': 'Sélectionnez le montant',
      'donate.customAmountLabel': 'Ou entrez un montant personnalisé',
      'donate.customAmountPlaceholder': 'Montant personnalisé',
      'donate.fullName': 'Nom complet',
      'donate.emailAddress': 'Adresse e-mail',
      'donate.donationAmount': 'Montant du don :',
      'donate.continue': 'Continuer vers le paiement',
      'donate.details': 'Détails du don',
      'donate.edit': 'Modifier'
    }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
