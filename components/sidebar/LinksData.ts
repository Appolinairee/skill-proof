import { ROUTES } from "@/utils/constants/routes";

export const navLinksGuest: NavLink[] = [
  {
    label: "Accueil",
    href: ROUTES.HOME,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon",
  },
  {
    label: "Catégories",
    href: ROUTES.CATEGORIES,
    icon: "CategoryIcon",
    iconBold: "CategoryBoldIcon",
  },
  {
    label: "Boutiques",
    href: ROUTES.BOUTIQUES,
    icon: "BuildingsIcon",
    iconBold: "BuildingsBoldIcon",
  },
  {
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: "NotificationIcon",
    iconBold: "NotificationBoldIcon",
  },
  {
    label: "Commandes",
    href: ROUTES.ORDERS,
    icon: "ShoppingCartIcon",
    iconBold: "ShoppingCartBoldIcon",
  },
  {
    label: "Connexion",
    href: ROUTES.LOGIN,
    icon: "LoginIcon",
    iconBold: "LoginIcon",
  },
];

export const userNavLinks: NavLink[] = [
  {
    label: "Accueil",
    href: ROUTES.HOME,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon",
  },
  {
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: "NotificationIcon",
    iconBold: "NotificationBoldIcon",
  },
  {
    label: "Catégories",
    href: ROUTES.CATEGORIES,
    icon: "CategoryIcon",
    iconBold: "CategoryBoldIcon",
  },
  {
    label: "Portefeuille",
    href: ROUTES.WALLET,
    icon: "WalletIcon",
    iconBold: "WalletBoldIcon",
  },
  {
    label: "Boutiques",
    href: ROUTES.BOUTIQUES,
    icon: "BuildingsIcon",
    iconBold: "BuildingsBoldIcon",
  },
  // {
  //   label: "Messages",
  //   href: ROUTES.MESSAGES,
  //   icon: "MessageIcon",
  //   iconBold: "MessageBoldIcon",
  // },
  {
    label: "Mes Favoris",
    href: ROUTES.FAVORITES,
    icon: "ArchiveTickIcon",
    iconBold: "ArchiveTickBoldIcon",
  },
  // {
  //   label: "Boutiques",
  //   href: ROUTES.COMPANIES,
  //   icon: "ShopIcon",
  //   iconBold: "ShopBoldIcon",
  // },
];

export const companyNavLinks: NavLink[] = [
  {
    label: "Tableau",
    href: ROUTES.COMPANY_DASHBOARD,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon",
  },
  {
    label: "Ajouter",
    href: ROUTES.ADD_PRODUCT,
    icon: "AddSquareIcon",
    iconBold: "AddSquareIcon",
  },
  {
    label: "Mes Produits",
    href: ROUTES.COMPANY_PRODUCTS,
    icon: "ShopIcon",
    iconBold: "ShopBoldIcon",
  },
  {
    label: "Portefeuille",
    href: ROUTES.WALLET,
    icon: "WalletIcon",
    iconBold: "WalletBoldIcon",
  },
  {
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: "NotificationIcon",
    iconBold: "NotificationBoldIcon",
  },
  {
    label: "Ventes",
    href: ROUTES.COMPANY_ORDERS,
    icon: "ShoppingCartIcon",
    iconBold: "ShoppingCartBoldIcon",
  },
  {
    label: "Messages",
    href: ROUTES.MESSAGES,
    icon: "MessageIcon",
    iconBold: "MessageBoldIcon",
  },
];

// Reseller-specific sidebar links (distinct from company)
export const resellerNavLinks: NavLink[] = [
  {
    label: "Tableau",
    href: ROUTES.COMPANY_DASHBOARD,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon"
  },
  {
    label: "Produits",
    href: ROUTES.RESELLER_PRODUCTS,
    icon: "TagIcon",
    iconBold: "TagIcon"
  },
  {
    label: "Ventes",
    href: ROUTES.COMPANY_ORDERS,
    icon: "ShoppingCartIcon",
    iconBold: "ShoppingCartBoldIcon"
  },
  {
    label: "Portefeuille",
    href: ROUTES.WALLET,
    icon: "WalletIcon",
    iconBold: "WalletIcon"
  },
  {
    label: "Messages",
    href: ROUTES.MESSAGES,
    icon: "MessageIcon",
    iconBold: "MessageBoldIcon"
  },
  {
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: "NotificationIcon",
    iconBold: "NotificationBoldIcon"
  },
];

export const moreLinks: NavLink[] = [
  {
    label: "Commandes",
    href: ROUTES.ORDERS,
    icon: "ShoppingCartIcon",
    iconBold: "ShoppingCartBoldIcon",
  },
  // { label: "Profil", href: ROUTES.PROFILE, icon: "UserIcon", iconBold: "UserBoldIcon" },
  // { label: "Paramètres", href: ROUTES.SETTINGS, icon: "SettingIcon", iconBold: "SettingBoldIcon" },
];

export const adminNavLinks: NavLink[] = [
  {
    label: "Dashboard",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon",
  },
  {
    label: "Utilisateurs",
    href: ROUTES.ADMIN_USERS,
    icon: "UserIcon",
    iconBold: "UserBoldIcon",
  },
  {
    label: "Boutiques",
    href: ROUTES.ADMIN_COMPANIES,
    icon: "BuildingsIcon",
    iconBold: "BuildingsBoldIcon",
  },
  {
    label: "Produits",
    href: ROUTES.ADMIN_PRODUCTS,
    icon: "TagIcon",
    iconBold: "TagIcon",
  },
  {
    label: "Catégories",
    href: ROUTES.ADMIN_CATEGORIES,
    icon: "CategoryIcon",
    iconBold: "CategoryBoldIcon",
  },
  {
    label: "Commandes",
    href: ROUTES.ADMIN_ORDERS,
    icon: "ShoppingCartIcon",
    iconBold: "ShoppingCartBoldIcon",
  },
  {
    label: "Messages",
    href: ROUTES.ADMIN_MESSAGES,
    icon: "MessageIcon",
    iconBold: "MessageBoldIcon",
  },
  {
    label: "Retraits",
    href: ROUTES.ADMIN_WITHDRAWALS,
    icon: "WalletMinusIcon",
    iconBold: "WalletMinusIcon",
  },
  {
    label: "Transactions",
    href: ROUTES.TRANSACTIONS,
    icon: "MoneysIcon",
    iconBold: "MoneysIcon",
  },
  {
    label: "Affiliations",
    href: ROUTES.AFFILIATIONS,
    icon: "AffiliationIcon",
    iconBold: "AffiliationIcon",
  },
  {
    label: "Paiements",
    href: ROUTES.PAYMENTS,
    icon: "WalletAddIcon",
    iconBold: "WalletAddIcon",
  },
  {
    label: "FAQ",
    href: ROUTES.ADMIN_FAQS,
    icon: "MessageQuestionIcon",
    iconBold: "MessageQuestionBoldIcon",
  },
];

export const mobileBottomNavLinks: NavLink[] = [
  {
    label: "Accueil",
    href: ROUTES.HOME,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon",
  },
  {
    label: "Boutiques",
    href: ROUTES.BOUTIQUES,
    icon: "BuildingsIcon",
    iconBold: "BuildingsBoldIcon",
  },
  {
    label: "Panier",
    href: ROUTES.CART,
    icon: "ShoppingCartIcon",
    iconBold: "ShoppingCartBoldIcon",
  },
  {
    label: "Messages",
    href: ROUTES.MESSAGES,
    icon: "MessageIcon",
    iconBold: "MessageBoldIcon",
  },
  {
    label: "Vous",
    href: ROUTES.PROFILE,
    icon: "UserIcon",
    iconBold: "UserBoldIcon",
  },
];

export const mobileBottomNavLinksCompany: NavLink[] = [
  {
    label: "Tableau",
    href: ROUTES.COMPANY_DASHBOARD,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon",
  },
  {
    label: "Produits",
    href: ROUTES.COMPANY_PRODUCTS,
    icon: "TagIcon",
    iconBold: "TagIcon",
  },
  {
    label: "Ajouter",
    href: ROUTES.ADD_PRODUCT,
    icon: "AddSquareIcon",
    iconBold: "AddSquareIcon",
  },
  {
    label: "Messages",
    href: ROUTES.MESSAGES,
    icon: "MessageIcon",
    iconBold: "MessageBoldIcon",
  },
  {
    label: "Vous",
    href: ROUTES.COMPANY_PROFILE_ME,
    icon: "UserIcon",
    iconBold: "UserBoldIcon",
  },
];

export const mobileBottomNavLinksReseller: NavLink[] = [
  {
    label: "Tableau",
    href: ROUTES.COMPANY_DASHBOARD,
    icon: "HomeIcon",
    iconBold: "HomeBoldIcon",
  },
  {
    label: "Produits",
    href: ROUTES.RESELLER_PRODUCTS,
    icon: "TagIcon",
    iconBold: "TagIcon",
  },
  {
    label: "Ventes",
    href: ROUTES.COMPANY_ORDERS,
    icon: "ShoppingCartIcon",
    iconBold: "ShoppingCartBoldIcon",
  },
  {
    label: "Portefeuille",
    href: ROUTES.WALLET,
    icon: "WalletIcon",
    iconBold: "WalletBoldIcon",
  },
  {
    label: "Vous",
    href: ROUTES.COMPANY_PROFILE_ME,
    icon: "UserIcon",
    iconBold: "UserBoldIcon",
  },
];
