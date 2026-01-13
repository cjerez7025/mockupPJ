// src/services/stripeService.js
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Inicializar Stripe
let stripePromise = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

class StripeService {
  
  // Crear sesión de checkout
  async createCheckoutSession(userId, planId, successUrl, cancelUrl) {
    try {
      const functions = getFunctions();
      const createCheckout = httpsCallable(functions, 'createCheckoutSession');
      
      const result = await createCheckout({
        userId,
        planId,
        successUrl: successUrl || STRIPE_CONFIG.successUrl,
        cancelUrl: cancelUrl || STRIPE_CONFIG.cancelUrl,
      });

      return result.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Redirigir a Stripe Checkout
  async redirectToCheckout(sessionId) {
    try {
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  // Crear portal de facturación del cliente
  async createCustomerPortalSession(userId, returnUrl) {
    try {
      const functions = getFunctions();
      const createPortal = httpsCallable(functions, 'createCustomerPortalSession');
      
      const result = await createPortal({
        userId,
        returnUrl: returnUrl || window.location.origin,
      });

      return result.data;
    } catch (error) {
      console.error('Error creating customer portal:', error);
      throw error;
    }
  }

  // Redirigir al portal del cliente
  async redirectToCustomerPortal(userId) {
    try {
      const { url } = await this.createCustomerPortalSession(userId);
      window.location.href = url;
    } catch (error) {
      console.error('Error redirecting to portal:', error);
      throw error;
    }
  }

  // Obtener información de pago del cliente
  async getPaymentMethods(customerId) {
    try {
      const functions = getFunctions();
      const getPaymentMethods = httpsCallable(functions, 'getPaymentMethods');
      
      const result = await getPaymentMethods({ customerId });
      return result.data.paymentMethods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // Actualizar método de pago por defecto
  async updateDefaultPaymentMethod(customerId, paymentMethodId) {
    try {
      const functions = getFunctions();
      const updatePayment = httpsCallable(functions, 'updateDefaultPaymentMethod');
      
      await updatePayment({ customerId, paymentMethodId });
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  // Obtener historial de facturas
  async getInvoices(customerId, limit = 10) {
    try {
      const functions = getFunctions();
      const getInvoices = httpsCallable(functions, 'getCustomerInvoices');
      
      const result = await getInvoices({ customerId, limit });
      return result.data.invoices;
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  }

  // Descargar factura
  async downloadInvoice(invoiceId) {
    try {
      const functions = getFunctions();
      const getInvoice = httpsCallable(functions, 'getInvoicePdf');
      
      const result = await getInvoice({ invoiceId });
      
      // Abrir PDF en nueva ventana
      window.open(result.data.pdfUrl, '_blank');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }

  // Aplicar código de descuento
  async applyCoupon(customerId, couponCode) {
    try {
      const functions = getFunctions();
      const applyCoupon = httpsCallable(functions, 'applyCouponToCustomer');
      
      const result = await applyCoupon({ customerId, couponCode });
      return result.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  // Cambiar plan
  async changePlan(subscriptionId, newPriceId) {
    try {
      const functions = getFunctions();
      const changePlan = httpsCallable(functions, 'changeSubscriptionPlan');
      
      const result = await changePlan({ subscriptionId, newPriceId });
      return result.data;
    } catch (error) {
      console.error('Error changing plan:', error);
      throw error;
    }
  }

  // Cancelar suscripción
  async cancelSubscription(subscriptionId, immediate = false) {
    try {
      const functions = getFunctions();
      const cancelSub = httpsCallable(functions, 'cancelSubscription');
      
      const result = await cancelSub({ 
        subscriptionId, 
        cancelAtPeriodEnd: !immediate 
      });
      return result.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Reactivar suscripción
  async reactivateSubscription(subscriptionId) {
    try {
      const functions = getFunctions();
      const reactivate = httpsCallable(functions, 'reactivateSubscription');
      
      const result = await reactivate({ subscriptionId });
      return result.data;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }
}

export default new StripeService();