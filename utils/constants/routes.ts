export const ROUTES = {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    FORGET_PASSWORD: "/auth/forget-password",
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
    CONFIRMATION_MAIL_SENT: "/auth/confirmation-mail-sent",
    MAIL_VALIDATION: (token: string) => `/auth/mail-validation/${token}`,
    ACCOUNT_NOT_VERIFIED: "/auth/account-not-verified",

    // Main
    HOME: "/",

    // User
    PROFILE: "/profile",
    NOTIFICATIONS: "/notifications",
    MESSAGES: "/messages",
    FAVORITES: "/favorites",
    WALLET: "/wallet",
    PAYMENT_CALLBACK: "/payment-callback",
    CART: "/?cart=true",

    // Shop
    SEARCH: "/search",
    CATEGORIES: "/categories",
    CATEGORY: (slug: string) => `/categories/${slug}`,
    BOUTIQUES: "/boutiques",
    PRODUCT_DETAILS: (id: string) => `/product/${id}`,
    PRODUCT: (slug: string) => `/p/${slug}`,

    ORDERS: "/orders",
    ORDER_PUBLIC: (orderId: string) => `/o/${orderId}`,

    // Company
    COMPANY_AUTH: "/company/auth",
    COMPANY_COMPLETE_REGISTRATION: "/company/complete-registration",
    COMPANY_COMPLETE_INVITATION_REGISTRATION_BASE: '/company/complete-invitation-registration',
    COMPANY_COMPLETE_INVITATION_REGISTRATION: (companyId: string, token: string) => `/company/complete-invitation-registration/${companyId}/${token}`,
    COMPANY_CONFIRMATION_MAIL_SENT: "/company/validation",
    COMPANY_DASHBOARD: "/company/dashboard",
    COMPANY_ORDERS: "/company/orders",
    COMPANY_PRODUCTS: "/company/products",
    COMPANY_PROFILE: (slug: string) => `/c/${slug}`,
    COMPANY_PROFILE_ME: "/c/me",
    ADD_PRODUCT: "/company/products/create",

    RESELLER_PRODUCTS: "/reseller/products",
    RESELLER_STOCKS: "/reseller/stocks",

    ADMIN_FAQS: "/admin/faqs",
    ADMIN_CATEGORIES: "/admin/categories",
    TRANSACTIONS: "/admin/transactions",
    AFFILIATIONS: "/admin/affiliations",
    PAYMENTS: "/admin/payments",
    ADMIN_DASHBOARD: "/admin",
    ADMIN_USERS: "/admin/users",
    ADMIN_PRODUCTS: "/admin/products",
    ADMIN_ORDERS: "/admin/orders",
    ADMIN_COMPANIES: "/admin/companies",
    ADMIN_WITHDRAWALS: "/admin/withdrawals",
    ADMIN_MESSAGES: "/admin/messages",
};