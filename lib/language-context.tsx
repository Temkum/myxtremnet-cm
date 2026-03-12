'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: 'Dashboard',
    products: 'Products',
    nav_services: 'Services',
    nav_support: 'Support',

    // Hero
    heroTitle: 'Stay Connected, Stay Ahead',
    heroSubtitle:
      "Experience seamless connectivity with Camtel - Cameroon's leading telecommunications provider. Fast, reliable, and always there for you.",
    exploreProducts: 'Explore Products',
    contactUs: 'Contact Us',

    // User Section
    welcome_simple: 'Welcome',
    customerInfo: 'Profile',
    changePassword: 'Change Password',
    logout: 'Logout',
    notLoggedIn: 'Not Logged In',
    manageServicesDesc: 'Access your account to manage services',

    // Products
    featuredOffer: 'Featured Offer',
    xtremNetDongle: 'X-tremNet Dongle',
    xtremNetDesc:
      'High-speed internet on the go with our 4G dongle. Perfect for work, study, or entertainment anywhere.',
    perMonth: 'per month',
    learnMore: 'Learn More',

    // Quick Actions
    quickActions: 'Quick Actions',
    viewBills: 'View Bills',
    recharge_action: 'Recharge',
    dataUsage: 'Data Usage',

    // Contact
    contactDetails: 'Contact Details',
    address: 'Address',
    addressValue: 'B.P. Box: 1571 Yaounde, Cameroon',
    phone: 'Phone',
    fax: 'Fax',
    website: 'Website',
    email: 'Email',
    followUs: 'Follow Us',

    // Footer
    copyright: 'Telecom Camtel. All rights reserved.',
    tagline: "...Et ce n'est pas fini!",
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    visits: 'Visits',

    // Dashboard
    offers: 'Offers',
    packages: 'Packages',
    support_dash: 'Support',
    needHelp: 'Need Help?',
    helpDescription:
      'Our support team is available 24/7 to assist you with any questions.',
    contactSupport: 'Contact Support',
    more: 'more',

    // Quick Actions (Dashboard)
    accountInfo: 'Account Info',
    accountInfoDesc: 'View your balance and account details',
    bundles: 'Bundles',
    bundlesDesc: 'Subscribe to Data bundles',
    recharge_dash: 'Recharge',
    rechargeDesc: 'Top up your account',
    orderHistory: 'Order History',
    orderHistoryDesc: 'Check your past orders',

    // Support Links (Dashboard)
    faq: 'FAQ',
    feedback: 'Feedback',
    contactUs_dash: 'Contact Us',

    // Badges
    popular: 'Popular',

    // Hero Stats
    camtelTelecommunications: 'Camtel Telecommunications',
    activeUsers: 'Active Users',
    uptime: 'Uptime',
    statsSupport: 'Support',

    // Product Section
    xtremNetBadge: 'X-tremNet',
    lte4g: '4G LTE',
    daysValidity: '30 Days Validity',
    plugPlay: 'Plug & Play USB',
    nationwide: 'Nationwide Coverage',

    // User Welcome
    welcome_comma: 'Welcome,',
    profile: 'Profile',
    exit: 'Exit',

    // Promo Banners
    xtremNetPlus: 'X-tremNet+',
    simCardTitle: '01 SIM CARD (data only+) To Go',
    simCardSubtitle: '1 DONGLE | PACK SINGLE',
    camFibre: 'CamFibre',
    fibreTitle: 'Fibre Optique Haut Débit',
    fibreSubtitle: 'PACK FAMILLE | UP TO 100 MBPS',
    camTV: 'CamTV+',
    tvTitle: 'Télévision Numérique Premium',
    tvSubtitle: '200+ CHAÎNES | HD & 4K',
    fibre_badge: 'FIBRE',
    new_badge: 'NOUVEAU',

    // Periods
    days30: '/ 30 days',
    month: '/ month',

    // Service Highlights
    highSpeedInternet: 'High Speed Internet',
    highSpeedInternetDesc: 'Up to 100 Mbps download speed',
    flexiblePackages: 'Flexible Packages',
    flexiblePackagesDesc: 'Choose from various data plans',
    mobileReady: 'Mobile Ready',
    mobileReadyDesc: 'Use with any compatible device',

    // Service Categories
    lte_service: 'LTE SERVICE',
    wttx_outdoor: 'WTTx Outdoor',
    wttx_indoor: 'WTTx Indoor',
    ul_service: 'UL Service',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    products: 'Produits',
    nav_services: 'Services',
    nav_support: 'Support',

    // Hero
    heroTitle: "Restez Connecté, Gardez l'Avance",
    heroSubtitle:
      'Découvrez une connectivité sans faille avec Camtel - le principal fournisseur de télécommunications du Cameroun. Rapide, fiable et toujours là pour vous.',
    exploreProducts: 'Découvrir les Produits',
    contactUs: 'Nous Contacter',

    // User Section
    welcome_simple: 'Bienvenue',
    customerInfo: 'Informations Client',
    changePassword: 'Changer le Mot de Passe',
    logout: 'Déconnexion',
    notLoggedIn: 'Non Connecté',
    manageServicesDesc: 'Accédez à votre compte pour gérer vos services',

    // Products
    featuredOffer: 'Offre Vedette',
    xtremNetDongle: 'Cle X-tremNet',
    xtremNetDesc:
      'Internet haut debit en deplacement avec notre cle 4G. Parfait pour le travail, les etudes ou le divertissement partout.',
    perMonth: 'par mois',
    learnMore: 'En Savoir Plus',

    // Quick Actions
    quickActions: 'Actions Rapides',
    viewBills: 'Voir les Factures',
    recharge_action: 'Recharger',
    dataUsage: 'Utilisation des Donnees',

    // Contact
    contactDetails: 'Coordonnees',
    address: 'Adresse',
    addressValue: 'B.P. Box: 1571 Yaounde, Cameroun',
    phone: 'Telephone',
    fax: 'Fax',
    website: 'Site Web',
    email: 'Email',
    followUs: 'Suivez-nous',

    // Footer
    copyright: 'Telecom Camtel. Tous droits reserves.',
    tagline: "...Et ce n'est pas fini!",
    privacyPolicy: 'Politique de Confidentialite',
    termsOfService: "Conditions d'Utilisation",
    visits: 'Visites',

    // Dashboard
    offers: 'Offres',
    packages: 'Forfaits',
    support_dash: 'Support',
    needHelp: "Besoin d'aide ?",
    helpDescription:
      'Notre équipe de support est disponible 24/7 pour vous aider avec toutes vos questions.',
    contactSupport: 'Contacter le Support',
    more: 'plus',

    // Quick Actions (Dashboard)
    accountInfo: 'Informations du Compte',
    accountInfoDesc: 'Voir votre solde et les détails du compte',
    bundles: 'Forfaits',
    bundlesDesc: 'Souscrire aux forfaits de données',
    recharge_dash: 'Recharger',
    rechargeDesc: 'Recharger votre compte',
    orderHistory: 'Historique des Commandes',
    orderHistoryDesc: 'Vérifier vos commandes passées',

    // Support Links (Dashboard)
    faq: 'FAQ',
    feedback: 'Retour',
    contactUs_dash: 'Nous Contacter',

    // Badges
    popular: 'Populaire',

    // Hero Stats
    camtelTelecommunications: 'Télécommunications Camtel',
    activeUsers: 'Utilisateurs Actifs',
    uptime: 'Disponibilité',
    statsSupport: 'Support',

    // Product Section
    xtremNetBadge: 'X-tremNet',
    lte4g: '4G LTE',
    daysValidity: '30 Jours de Validité',
    plugPlay: 'USB Plug & Play',
    nationwide: 'Couverture Nationale',

    // User Welcome
    welcome_comma: 'Bienvenue,',
    profile: 'Profil',
    exit: 'Quitter',

    // Promo Banners
    xtremNetPlus: 'X-tremNet+',
    simCardTitle: '01 CARTE SIM (données seulement+) À Emporter',
    simCardSubtitle: '1 CLÉ | PACK UNIQUE',
    camFibre: 'CamFibre',
    fibreTitle: 'Fibre Optique Haut Débit',
    fibreSubtitle: "PACK FAMILLE | JUSQU'À 100 MBPS",
    camTV: 'CamTV+',
    tvTitle: 'Télévision Numérique Premium',
    tvSubtitle: '200+ CHAÎNES | HD & 4K',
    fibre_badge: 'FIBRE',
    new_badge: 'NOUVEAU',

    // Periods
    days30: '/ 30 jours',
    month: '/ mois',

    // Service Highlights
    highSpeedInternet: 'Internet Haut Débit',
    highSpeedInternetDesc: "Jusqu'à 100 Mbps de vitesse de téléchargement",
    flexiblePackages: 'Forfaits Flexibles',
    flexiblePackagesDesc: 'Choisissez parmi divers plans de données',
    mobileReady: 'Prêt pour le Mobile',
    mobileReadyDesc: "Utilisez avec n'importe quel appareil compatible",

    // Service Categories
    lte_service: 'SERVICE LTE',
    wttx_outdoor: 'WTTx Extérieur',
    wttx_indoor: 'WTTx Intérieur',
    ul_service: 'Service UL',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
