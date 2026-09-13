export const APP_CONFIG = {
  app: {
    name: "Shoes",
    shortName: "Shoes",
    description: "Catalogo, promozioni e acquisti del tuo negozio di scarpe",
  },
  api: {
    baseUrl: "/api",
  },
  storage: {
    customerToken: "shoes_app_token",
    customer: "shoes_app_cliente",
    cart: "shoes_app_cart",
  },
  routes: {
    home: "/",
    catalog: "/catalogo",
    login: "/login",
    profile: "/profilo",
    promotions: "/promozioni",
    cart: "/carrello",
    checkout: "/acquista",
    orders: "/ordini",
    admin: "/admin",
    adminLogin: "/admin/login",
  },
} as const;
