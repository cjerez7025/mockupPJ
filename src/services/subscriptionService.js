// src/services/subscriptionService.js
import { db } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { PLANS, getPlanById } from '../config/plans';

class SubscriptionService {
  
  // Obtener suscripción actual del usuario
  async getUserSubscription(userId) {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionSnap = await getDoc(subscriptionRef);
      
      if (subscriptionSnap.exists()) {
        return subscriptionSnap.data();
      }
      
      // Si no existe, crear suscripción gratuita por defecto
      const freeSubscription = {
        userId,
        planId: 'free',
        status: 'active',
        startDate: serverTimestamp(),
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(subscriptionRef, freeSubscription);
      return freeSubscription;
      
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  // Crear suscripción de pago
  async createSubscription(userId, planId, stripeSubscriptionId, stripeCustomerId) {
    try {
      const plan = getPlanById(planId);
      if (!plan) throw new Error('Plan no encontrado');

      const subscriptionData = {
        userId,
        planId,
        status: 'active',
        startDate: serverTimestamp(),
        currentPeriodEnd: this.calculatePeriodEnd(plan.interval),
        cancelAtPeriodEnd: false,
        stripeCustomerId,
        stripeSubscriptionId,
        trialEnd: plan.trial ? this.calculateTrialEnd(plan.trial) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const subscriptionRef = doc(db, 'subscriptions', userId);
      await setDoc(subscriptionRef, subscriptionData);

      // Actualizar contador de uso
      await this.initializeUsageCounters(userId, planId);

      return subscriptionData;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Actualizar suscripción
  async updateSubscription(userId, updates) {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      await updateDoc(subscriptionRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Cancelar suscripción
  async cancelSubscription(userId, immediate = false) {
    try {
      const updates = {
        cancelAtPeriodEnd: !immediate,
        status: immediate ? 'canceled' : 'active',
        canceledAt: serverTimestamp(),
      };

      if (immediate) {
        updates.endDate = serverTimestamp();
      }

      await this.updateSubscription(userId, updates);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Reactivar suscripción cancelada
  async reactivateSubscription(userId) {
    try {
      await this.updateSubscription(userId, {
        cancelAtPeriodEnd: false,
        canceledAt: null,
        status: 'active',
      });
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Inicializar contadores de uso
  async initializeUsageCounters(userId, planId) {
    try {
      const usageRef = doc(db, 'usage', userId);
      const plan = getPlanById(planId);

      const usageData = {
        userId,
        planId,
        families: 0,
        members: 0,
        posts: 0,
        storageBytes: 0,
        lastReset: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      await setDoc(usageRef, usageData);
    } catch (error) {
      console.error('Error initializing usage counters:', error);
      throw error;
    }
  }

  // Obtener uso actual
  async getUsage(userId) {
    try {
      const usageRef = doc(db, 'usage', userId);
      const usageSnap = await getDoc(usageRef);
      
      if (usageSnap.exists()) {
        return usageSnap.data();
      }
      
      return null;
    } catch (error) {
      console.error('Error getting usage:', error);
      throw error;
    }
  }

  // Verificar si el usuario puede usar una funcionalidad
  async canUseFeature(userId, featureName) {
    try {
      const subscription = await this.getUserSubscription(userId);
      const plan = getPlanById(subscription.planId);
      
      return plan.features[featureName] === true || 
             plan.features[featureName] === 'Ilimitados' ||
             (typeof plan.features[featureName] === 'number' && plan.features[featureName] > 0);
    } catch (error) {
      console.error('Error checking feature:', error);
      return false;
    }
  }

  // Verificar límites
  async checkLimit(userId, limitType) {
    try {
      const subscription = await this.getUserSubscription(userId);
      const usage = await this.getUsage(userId);
      const plan = getPlanById(subscription.planId);

      if (!usage) return true;

      const limit = plan.limits?.[limitType];
      if (limit === -1) return true; // Ilimitado

      const currentUsage = usage[limitType.replace('max', '').toLowerCase()] || 0;
      return currentUsage < limit;
    } catch (error) {
      console.error('Error checking limit:', error);
      return false;
    }
  }

  // Incrementar contador de uso
  async incrementUsage(userId, usageType, amount = 1) {
    try {
      const usageRef = doc(db, 'usage', userId);
      const usageSnap = await getDoc(usageRef);

      if (!usageSnap.exists()) {
        const subscription = await this.getUserSubscription(userId);
        await this.initializeUsageCounters(userId, subscription.planId);
      }

      const currentUsage = usageSnap.data()?.[usageType] || 0;
      await updateDoc(usageRef, {
        [usageType]: currentUsage + amount,
      });
    } catch (error) {
      console.error('Error incrementing usage:', error);
      throw error;
    }
  }

  // Calcular fin de período
  calculatePeriodEnd(interval) {
    const now = new Date();
    if (interval === 'month') {
      now.setMonth(now.getMonth() + 1);
    } else if (interval === 'year') {
      now.setFullYear(now.getFullYear() + 1);
    }
    return now;
  }

  // Calcular fin de prueba
  calculateTrialEnd(trialDays) {
    const now = new Date();
    now.setDate(now.getDate() + trialDays);
    return now;
  }

  // Obtener todas las suscripciones activas (para admin)
  async getAllActiveSubscriptions() {
    try {
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(subscriptionsRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting active subscriptions:', error);
      throw error;
    }
  }

  // Obtener estadísticas de suscripciones (para admin)
  async getSubscriptionStats() {
    try {
      const subscriptions = await this.getAllActiveSubscriptions();
      
      const stats = {
        total: subscriptions.length,
        byPlan: {},
        revenue: {
          monthly: 0,
          annual: 0,
        },
        trialUsers: 0,
      };

      subscriptions.forEach(sub => {
        // Contar por plan
        stats.byPlan[sub.planId] = (stats.byPlan[sub.planId] || 0) + 1;
        
        // Calcular revenue
        const plan = getPlanById(sub.planId);
        if (plan && plan.price > 0) {
          if (plan.interval === 'month') {
            stats.revenue.monthly += plan.price;
          } else {
            stats.revenue.annual += plan.price;
          }
        }
        
        // Contar usuarios en trial
        if (sub.trialEnd && new Date(sub.trialEnd) > new Date()) {
          stats.trialUsers++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      throw error;
    }
  }
}

export default new SubscriptionService();