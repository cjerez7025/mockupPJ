// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPlanById } from '../config/plans';
import stripeService from '../services/stripeService';
import { 
  CreditCard, 
  Lock, 
  Check, 
  ArrowLeft,
  AlertCircle,
  Loader
} from 'lucide-react';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  
  const planId = searchParams.get('plan');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    if (!planId) {
      navigate('/pricing');
      return;
    }

    const selectedPlan = getPlanById(planId);
    if (!selectedPlan) {
      navigate('/pricing');
      return;
    }

    setPlan(selectedPlan);
  }, [planId, navigate]);

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login?redirect=/checkout?plan=' + planId);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear sesión de checkout en Stripe
      const { sessionId } = await stripeService.createCheckoutSession(
        currentUser.uid,
        planId,
        `${window.location.origin}/checkout/success`,
        `${window.location.origin}/checkout/cancel`
      );

      // Redirigir a Stripe Checkout
      await stripeService.redirectToCheckout(sessionId);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Hubo un error al procesar tu pago. Por favor intenta nuevamente.');
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setLoading(true);
    try {
      // Validar cupón (implementar en backend)
      // const result = await stripeService.validateCoupon(couponCode);
      setAppliedCoupon({
        code: couponCode,
        discount: 20, // Ejemplo: 20% de descuento
      });
    } catch (err) {
      setError('Código de cupón inválido');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!plan) return 0;
    
    let total = plan.price;
    if (appliedCoupon) {
      total = total * (1 - appliedCoupon.discount / 100);
    }
    return total;
  };

  if (!plan) {
    return (
      <div className="checkout-loading">
        <Loader className="spinner" />
        <p>Cargando información del plan...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button className="back-button" onClick={() => navigate('/pricing')}>
            <ArrowLeft size={20} />
            Volver a planes
          </button>
          <h1>Confirmar Suscripción</h1>
        </div>

        <div className="checkout-content">
          {/* Resumen del Plan */}
          <div className="plan-summary">
            <div className="summary-card">
              <h2>Resumen de tu Plan</h2>
              
              <div className="plan-info">
                <div className="plan-name-badge">{plan.name}</div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-details">
                <h3>Incluye:</h3>
                <ul className="features-list">
                  <li><Check size={16} /> {plan.features.families} {typeof plan.features.families === 'number' ? 'familia' : 'familias'}</li>
                  <li><Check size={16} /> {plan.features.members} miembros</li>
                  <li><Check size={16} /> {plan.features.posts} publicaciones</li>
                  <li><Check size={16} /> {plan.features.storage} de almacenamiento</li>
                  <li><Check size={16} /> Videos de hasta {plan.features.videoLength} segundos</li>
                  {plan.features.analytics && <li><Check size={16} /> Estadísticas de uso</li>}
                  {plan.features.videoCall && <li><Check size={16} /> Videollamadas integradas</li>}
                  {plan.features.branding && <li><Check size={16} /> Sin marca de agua</li>}
                </ul>
              </div>

              {/* Cupón de descuento */}
              <div className="coupon-section">
                <h3>¿Tienes un código de descuento?</h3>
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Ingresa tu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={appliedCoupon || loading}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || appliedCoupon || loading}
                  >
                    Aplicar
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="coupon-applied">
                    <Check size={16} />
                    <span>Cupón aplicado: {appliedCoupon.discount}% de descuento</span>
                  </div>
                )}
              </div>

              {/* Precio */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>${plan.price.toLocaleString('es-CL')}</span>
                </div>
                {appliedCoupon && (
                  <div className="price-row discount">
                    <span>Descuento ({appliedCoupon.discount}%):</span>
                    <span>-${(plan.price * appliedCoupon.discount / 100).toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total:</span>
                  <span className="total-amount">
                    ${calculateTotal().toLocaleString('es-CL')}
                    <span className="billing-period">/{plan.interval === 'month' ? 'mes' : 'año'}</span>
                  </span>
                </div>
              </div>

              {plan.trial && (
                <div className="trial-notice">
                  <AlertCircle size={18} />
                  <p>Tendrás {plan.trial} días de prueba gratis. No se te cobrará hasta que termine el período de prueba.</p>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de Pago */}
          <div className="payment-section">
            <div className="payment-card">
              <h2>
                <CreditCard size={24} />
                Método de Pago
              </h2>

              {error && (
                <div className="error-message">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <div className="payment-info">
                <p>Serás redirigido a Stripe, nuestra plataforma de pagos segura, para completar tu suscripción.</p>
              </div>

              <button 
                className="checkout-button"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Proceder al Pago Seguro
                  </>
                )}
              </button>

              <div className="security-badges">
                <div className="badge">
                  <Lock size={16} />
                  <span>Pago 100% Seguro</span>
                </div>
                <div className="badge">
                  <Check size={16} />
                  <span>Encriptación SSL</span>
                </div>
              </div>

              <div className="payment-methods">
                <p>Aceptamos:</p>
                <div className="cards">
                  <span>💳 Visa</span>
                  <span>💳 Mastercard</span>
                  <span>💳 American Express</span>
                </div>
              </div>
            </div>

            {/* Garantías */}
            <div className="guarantees">
              <h3>Garantía de Satisfacción</h3>
              <ul>
                <li><Check size={16} /> Cancela cuando quieras</li>
                <li><Check size={16} /> Sin permanencia</li>
                <li><Check size={16} /> Reembolso en primeros 14 días</li>
                <li><Check size={16} /> Soporte prioritario</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;