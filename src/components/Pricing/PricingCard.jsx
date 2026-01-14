// src/components/Pricing/PricingCard.jsx
import React from 'react';
import { Check, X, Star } from 'lucide-react';
import './PricingCard.css';
//import PricingCard from '../components/Pricing/PricingCard';
const PricingCard = ({ plan, onSelect, currency = 'CLP', isCurrentPlan = false }) => {
  const formatPrice = (price) => {
    if (price === 0) return 'Gratis';
    if (currency === 'CLP') {
      return `$${price.toLocaleString('es-CL')}`;
    }
    return `$${plan.priceUSD}`;
  };

  const renderFeature = (label, value, highlight = false) => {
    const isIncluded = value !== false && value !== 0;
    const displayValue = typeof value === 'boolean' 
      ? '' 
      : typeof value === 'string' 
        ? `: ${value}` 
        : value > 0 
          ? `: ${value}seg` 
          : '';

    return (
      <div className={`feature ${isIncluded ? 'included' : 'excluded'} ${highlight ? 'highlight' : ''}`}>
        {isIncluded ? (
          <Check size={18} className="feature-icon check" />
        ) : (
          <X size={18} className="feature-icon x" />
        )}
        <span className="feature-text">
          {label}{displayValue}
        </span>
      </div>
    );
  };

  return (
    <div className={`pricing-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}>
      {plan.popular && (
        <div className="popular-badge">
          <Star size={14} fill="currentColor" />
          <span>Más Popular</span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="current-plan-badge">Plan Actual</div>
      )}
      
      <div className="plan-header">
        <h3 className="plan-name">{plan.name}</h3>
        <p className="plan-description">{plan.description}</p>
        
        <div className="plan-price">
          <span className="price-amount">{formatPrice(plan.price)}</span>
          {plan.price > 0 && (
            <span className="price-interval">
              /{plan.interval === 'month' ? 'mes' : 'año'}
            </span>
          )}
        </div>
        
        {plan.trial && (
          <div className="trial-badge">
            {plan.trial} días de prueba gratis
          </div>
        )}
      </div>

      <div className="plan-features">
        <div className="features-section">
          <h4 className="features-title">Características incluidas:</h4>
          {renderFeature('Familias', plan.features.families, true)}
          {renderFeature('Miembros', plan.features.members, true)}
          {renderFeature('Publicaciones', plan.features.posts, true)}
          {renderFeature('Almacenamiento', plan.features.storage, true)}
          {renderFeature('Duración de videos', plan.features.videoLength)}
        </div>
        
        <div className="features-section">
          <h4 className="features-title">Funciones:</h4>
          {renderFeature('Estadísticas de uso', plan.features.analytics)}
          {renderFeature('Videollamadas integradas', plan.features.videoCall)}
          {renderFeature('Sin marca de agua', plan.features.branding)}
          {renderFeature('Dominio personalizado', plan.features.customDomain)}
          {renderFeature('Panel administrativo', plan.features.adminDashboard)}
          {renderFeature('Invitaciones masivas', plan.features.bulkInvites)}
          {renderFeature('Reportes y exportación', plan.features.reporting)}
        </div>
        
        <div className="features-section">
          <h4 className="features-title">Soporte:</h4>
          {renderFeature('Nivel de soporte', plan.features.support, true)}
        </div>
      </div>

      <button 
        className={`plan-cta ${plan.popular ? 'primary' : 'secondary'} ${isCurrentPlan ? 'disabled' : ''}`}
        onClick={() => !isCurrentPlan && onSelect(plan)}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Plan Actual' : plan.cta}
      </button>
      
      {plan.custom && (
        <p className="custom-note">
          * Plan personalizable según tus necesidades
        </p>
      )}
    </div>
  );
};

export default PricingCard;