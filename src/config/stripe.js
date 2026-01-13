// src/config/stripe.js
export const STRIPE_CONFIG = {
  // Reemplazar con tus claves reales de Stripe
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  
  // URLs de redirección después del pago
  successUrl: `${window.location.origin}/checkout/success`,
  cancelUrl: `${window.location.origin}/checkout/cancel`,
  
  // Configuración de webhook (para backend)
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

// IDs de productos en Stripe (debes crearlos en tu dashboard de Stripe)
export const STRIPE_PRICE_IDS = {
  personal_monthly: 'price_1234567890', // Reemplazar con ID real
  personal_annual: 'price_0987654321',
  family_plus_monthly: 'price_1111111111',
  family_plus_annual: 'price_2222222222',
  organization_monthly: 'price_3333333333',
  organization_annual: 'price_4444444444',
};

// Configuración de Stripe según el plan
export const getStripePriceId = (planId, interval = 'month') => {
  const key = `${planId}_${interval === 'month' ? 'monthly' : 'annual'}`;
  return STRIPE_PRICE_IDS[key];
};