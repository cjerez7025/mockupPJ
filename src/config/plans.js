// src/config/plans.js
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    interval: 'forever',
    features: {
      families: 1,
      members: 5,
      posts: 50,
      storage: '1 GB',
      videoLength: 30,
      support: 'Comunidad',
      branding: false,
      customDomain: false,
      analytics: false,
      videoCall: false,
      adminDashboard: false,
      bulkInvites: false,
      reporting: false,
    },
    limits: {
      maxFamilies: 1,
      maxMembers: 5,
      maxPosts: 50,
      maxStorageBytes: 1073741824, // 1GB
      maxVideoSeconds: 30,
    },
    cta: 'Comenzar Gratis',
    popular: false,
    description: 'Perfecto para comenzar a compartir recuerdos'
  },
  
  PERSONAL: {
    id: 'personal',
    name: 'Personal',
    price: 9990, // CLP
    priceUSD: 12,
    interval: 'month',
    stripePriceId: 'price_personal_monthly', // Reemplazar con ID real de Stripe
    features: {
      families: 1,
      members: 'Ilimitados',
      posts: 'Ilimitados',
      storage: '10 GB',
      videoLength: 120,
      support: 'Email prioritario',
      branding: false,
      customDomain: false,
      analytics: true,
      videoCall: false,
      adminDashboard: false,
      bulkInvites: false,
      reporting: false,
    },
    limits: {
      maxFamilies: 1,
      maxMembers: -1, // Ilimitado
      maxPosts: -1,
      maxStorageBytes: 10737418240, // 10GB
      maxVideoSeconds: 120,
    },
    cta: 'Comenzar Prueba',
    popular: true,
    trial: 14,
    description: 'Ideal para una familia conectada sin límites'
  },
  
  FAMILY_PLUS: {
    id: 'family_plus',
    name: 'Familiar Plus',
    price: 16990, // CLP
    priceUSD: 20,
    interval: 'month',
    stripePriceId: 'price_family_monthly',
    features: {
      families: 3,
      members: 'Ilimitados',
      posts: 'Ilimitados',
      storage: '50 GB',
      videoLength: 300,
      support: 'Chat en vivo',
      branding: true,
      customDomain: false,
      analytics: true,
      videoCall: true,
      adminDashboard: false,
      bulkInvites: false,
      reporting: false,
    },
    limits: {
      maxFamilies: 3,
      maxMembers: -1,
      maxPosts: -1,
      maxStorageBytes: 53687091200, // 50GB
      maxVideoSeconds: 300,
    },
    cta: 'Suscribirse',
    popular: false,
    description: 'Para familias extendidas con múltiples grupos'
  },
  
  ORGANIZATION: {
    id: 'organization',
    name: 'Organizaciones',
    price: 99000, // CLP
    priceUSD: 120,
    interval: 'month',
    stripePriceId: 'price_org_monthly',
    features: {
      families: 'Hasta 25',
      members: 'Ilimitados',
      posts: 'Ilimitados',
      storage: '500 GB',
      videoLength: 600,
      support: 'Soporte dedicado 24/7',
      branding: true,
      customDomain: true,
      analytics: true,
      videoCall: true,
      adminDashboard: true,
      bulkInvites: true,
      reporting: true,
    },
    limits: {
      maxFamilies: 25,
      maxMembers: -1,
      maxPosts: -1,
      maxStorageBytes: 536870912000, // 500GB
      maxVideoSeconds: 600,
    },
    cta: 'Contactar Ventas',
    popular: false,
    custom: true,
    description: 'Solución completa para ONGs y fundaciones'
  }
};

export const getPlanById = (planId) => {
  return Object.values(PLANS).find(plan => plan.id === planId);
};

export const isFeatureAvailable = (userPlan, feature) => {
  const plan = getPlanById(userPlan);
  return plan?.features[feature] || false;
};

export const checkLimit = (userPlan, limitType, currentValue) => {
  const plan = getPlanById(userPlan);
  const limit = plan?.limits?.[limitType];
  
  if (limit === -1) return true; // Ilimitado
  return currentValue < limit;
};