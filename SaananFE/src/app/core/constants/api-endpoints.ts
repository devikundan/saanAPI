export const API_ENDPOINTS = {
  // Public
  services: '/services',
  blogs: '/blogs',
  leads: '/leads',
  newsletter: '/newsletter',
  portfolio: '/portfolio',
  contactMessages: '/contact-messages',
  testimonials: '/testimonials',
  faqs: '/faqs',
  content: '/content',
  serviceCategories: '/service-categories',

  // Auth
  auth: {
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
    changePassword: '/auth/change-password'
  },

  // Admin
  admin: {
    services: '/admin/services',
    blogs: '/admin/blogs',
    leads: '/admin/leads',
    newsletter: '/admin/newsletter',
    portfolio: '/admin/portfolio',
    testimonials: '/admin/testimonials',
    faqs: '/admin/faqs',
    content: '/admin/content',
    serviceCategories: '/admin/service-categories',
    contactMessages: '/admin/contact-messages',
    analytics: '/admin/analytics',
    queryClassification: '/admin/query-classification',
    proposals: '/admin/proposals'
  }
} as const;
