export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
};

export type AdminNavItem = {
  label: string;
  href: string;
  icon?: string;
};

export const APP_CONFIG = {
  app: {
    name: "Scarpe App",
    shortName: "Scarpe",
    description: "Catalogo, promozioni e acquisti del tuo negozio di scarpe",
  },

  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ??
      "https://www.agentiplusdb.net/scarpe-api",
  },

  storage: {
    customerToken: "scarpe_app_token",
    customer: "scarpe_app_cliente",

    adminToken: "scarpe_app_admin_token",
    admin: "scarpe_app_admin",

    cart: "scarpe_app_cart",
  },

  routes: {
    home: "/",

    login: "/login",
    register: "/registrati",
    profile: "/profilo",

    catalog: "/catalogo",
    promotions: "/promozioni",

    cart: "/carrello",
    checkout: "/acquista",
    orders: "/ordini",

    admin: "/admin",
    adminLogin: "/admin/login",
  },
} as const;

export const MAIN_NAVIGATION: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "home",
  },
  {
    label: "Catalogo",
    href: "/catalogo",
    icon: "shopping-bag",
  },
  {
    label: "Promozioni",
    href: "/promozioni",
    icon: "percent",
  },
  {
    label: "Ordini",
    href: "/ordini",
    icon: "package",
    requiresAuth: true,
  },
  {
    label: "Profilo",
    href: "/profilo",
    icon: "user",
    requiresAuth: true,
  },
];

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "layout-dashboard",
  },
  {
    label: "Catalogo",
    href: "/admin/catalogo",
    icon: "shopping-bag",
  },
  {
    label: "Categorie",
    href: "/admin/categorie",
    icon: "tags",
  },
  {
    label: "Marche",
    href: "/admin/marche",
    icon: "badge",
  },
  {
    label: "Promozioni",
    href: "/admin/promozioni",
    icon: "percent",
  },
  {
    label: "Ordini",
    href: "/admin/ordini",
    icon: "package",
  },
  {
    label: "Clienti",
    href: "/admin/clienti",
    icon: "users",
  },
  {
    label: "Spedizioni",
    href: "/admin/spedizioni",
    icon: "truck",
  },
  {
    label: "Statistiche",
    href: "/admin/statistiche",
    icon: "chart-column",
  },
  {
    label: "Impostazioni",
    href: "/admin/impostazioni",
    icon: "settings",
  },
];

export const SHOE_GENDERS = [
  {
    value: "uomo",
    label: "Uomo",
  },
  {
    value: "donna",
    label: "Donna",
  },
  {
    value: "unisex",
    label: "Unisex",
  },
  {
    value: "bambino",
    label: "Bambino",
  },
  {
    value: "bambina",
    label: "Bambina",
  },
] as const;

export const DEFAULT_SHOE_SIZES = [
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "36.5",
  "37",
  "37.5",
  "38",
  "38.5",
  "39",
  "39.5",
  "40",
  "40.5",
  "41",
  "41.5",
  "42",
  "42.5",
  "43",
  "43.5",
  "44",
  "44.5",
  "45",
  "45.5",
  "46",
  "47",
  "48",
] as const;

export const ORDER_STATUSES = [
  {
    value: "nuovo",
    label: "Nuovo",
  },
  {
    value: "confermato",
    label: "Confermato",
  },
  {
    value: "in_preparazione",
    label: "In preparazione",
  },
  {
    value: "spedito",
    label: "Spedito",
  },
  {
    value: "consegnato",
    label: "Consegnato",
  },
  {
    value: "annullato",
    label: "Annullato",
  },
] as const;

export const SHIPPING_STATUSES = [
  {
    value: "da_preparare",
    label: "Da preparare",
  },
  {
    value: "preparato",
    label: "Preparato",
  },
  {
    value: "affidato_corriere",
    label: "Affidato al corriere",
  },
  {
    value: "in_transito",
    label: "In transito",
  },
  {
    value: "consegnato",
    label: "Consegnato",
  },
] as const;