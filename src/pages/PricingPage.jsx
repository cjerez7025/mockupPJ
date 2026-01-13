// src/pages/PricingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from '../components/Pricing/PricingCard';
import { PLANS } from '../config/plans';
import { 
  Globe, 
  DollarSign, 
  Check, 
  Shield, 
  Heart, 
  Users,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import './PricingPage.css';

const PricingPage = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('CLP');
  const [currentUserPlan, setCurrentUserPlan] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    // TODO: Obtener plan actual del usuario desde Firebase
    // setCurrentUserPlan(userPlanId);
  }, []);

  const handleSelectPlan = (plan) => {
    if (plan.custom) {
      // Redirigir a contacto
      window.open('mailto:carlos@parajoaquin.cl?subject=Consulta Plan Organizaciones', '_blank');
    } else if (plan.id === 'free') {
      // Redirigir a registro
      navigate('/register');
    } else {
      // Iniciar proceso de pago con Stripe
      navigate(`/checkout?plan=${plan.id}`);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: '¿Puedo cambiar de plan después?',
      answer: 'Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu panel de configuración. Los cambios se aplican inmediatamente y ajustamos la facturación proporcionalmente.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias y pagos recurrentes automáticos a través de Stripe, una plataforma segura de pagos.'
    },
    {
      question: '¿Los datos están seguros?',
      answer: 'Absolutamente. Usamos Firebase de Google con encriptación SSL/TLS, almacenamiento seguro en la nube, y cumplimos con estándares internacionales de protección de datos. Tus recuerdos están respaldados automáticamente.'
    },
    {
      question: '¿Hay descuentos para ONGs?',
      answer: 'Sí, ofrecemos planes especiales con hasta 40% de descuento para organizaciones sin fines de lucro, tribunales de familia y fundaciones. Contáctanos para más información.'
    },
    {
      question: '¿Qué pasa si cancelo mi suscripción?',
      answer: 'Puedes cancelar en cualquier momento. Mantendrás acceso hasta el final de tu período de facturación actual. Tus datos se conservan por 30 días después de la cancelación por si cambias de opinión.'
    },
    {
      question: '¿Puedo probar antes de pagar?',
      answer: 'Sí, todos los planes de pago incluyen 14 días de prueba gratuita sin necesidad de tarjeta de crédito. Puedes cancelar en cualquier momento durante el período de prueba.'
    }
  ];

  const benefits = [
    {
      icon: <Shield size={32} />,
      title: 'Seguridad Garantizada',
      description: 'Tus recuerdos protegidos con encriptación de nivel bancario'
    },
    {
      icon: <Heart size={32} />,
      title: 'Conexión Familiar',
      description: 'Mantén viva la relación con quienes más amas'
    },
    {
      icon: <Users size={32} />,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva para todas las edades'
    },
    {
      icon: <MessageCircle size={32} />,
      title: 'Soporte Dedicado',
      description: 'Estamos aquí para ayudarte cuando nos necesites'
    }
  ];

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <div className="pricing-hero">
        <h1 className="hero-title">
          Planes que se adaptan a <span className="gradient-text">tu familia</span>
        </h1>
        <p className="hero-subtitle">
          Elige el plan perfecto para mantener viva la conexión familiar.<br />
          Comienza gratis, actualiza cuando lo necesites.
        </p>
        
        <div className="pricing-controls">
          <div className="currency-toggle">
            <button 
              className={currency === 'CLP' ? 'active' : ''}
              onClick={() => setCurrency('CLP')}
            >
              <DollarSign size={16} /> Pesos Chilenos
            </button>
            <button 
              className={currency === 'USD' ? 'active' : ''}
              onClick={() => setCurrency('USD')}
            >
              <Globe size={16} /> Dólares USD
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {Object.values(PLANS).map(plan => (
          <PricingCard
            key={plan.id}
            plan={plan}
            currency={currency}
            onSelect={handleSelectPlan}
            isCurrentPlan={currentUserPlan === plan.id}
          />
        ))}
      </div>

      {/* Trust Section */}
      <div className="trust-section">
        <h2>¿Por qué confiar en nosotros?</h2>
        <div className="trust-grid">
          <div className="trust-item">
            <Check className="trust-icon" />
            <p><strong>Sin permanencia</strong> - Cancela cuando quieras</p>
          </div>
          <div className="trust-item">
            <Check className="trust-icon" />
            <p><strong>Datos seguros</strong> - Encriptación de extremo a extremo</p>
          </div>
          <div className="trust-item">
            <Check className="trust-icon" />
            <p><strong>Soporte rápido</strong> - Respuesta en menos de 24hrs</p>
          </div>
          <div className="trust-item">
            <Check className="trust-icon" />
            <p><strong>Actualizaciones gratis</strong> - Nuevas funciones sin costo extra</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pricing-faq">
        <h2 className="faq-title">
          <HelpCircle size={32} className="faq-icon" />
          Preguntas Frecuentes
        </h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-toggle">{openFaqIndex === index ? '−' : '+'}</span>
              </div>
              {openFaqIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="pricing-cta-section">
        <div className="cta-content">
          <h2>¿Necesitas algo personalizado?</h2>
          <p>
            Para organizaciones grandes, tribunales de familia o necesidades especiales,<br />
            contáctanos para crear un plan a tu medida
          </p>
          <div className="cta-buttons">
            <button 
              className="contact-sales-btn primary"
              onClick={() => window.open('mailto:carlos@parajoaquin.cl?subject=Consulta Plan Personalizado', '_blank')}
            >
              Hablar con Ventas
            </button>
            <button 
              className="contact-sales-btn secondary"
              onClick={() => navigate('/register')}
            >
              Comenzar Gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;