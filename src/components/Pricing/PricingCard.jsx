import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureTooltip from './FeatureTooltip';
import { featureExplanations } from '../../config/featureExplanations';
import './PricingCard.css';

export default function PricingCard({ plan, currency = 'CLP', onSelect, isCurrentPlan }) {
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    if (onSelect) {
      onSelect(plan);
    } else {
      navigate(`/checkout?plan=${plan.id}`);
    }
  };

  const formatLimit = (value) => {
    if (value === -1 || value === 'unlimited' || value === 'Ilimitados') return 'Ilimitados';
    if (value === 'infinite' || value === 'Ilimitado') return 'Ilimitado';
    return value;
  };

  // Convertir el objeto features a un array para el renderizado
  const featuresArray = [
    { 
      key: 'analytics', 
      name: plan.features.analytics === true ? 'Estadísticas avanzadas' : 'Estadísticas básicas',
      included: plan.features.analytics,
      tooltip: featureExplanations.statistics
    },
    { 
      key: 'videoCall', 
      name: 'Videollamadas integradas',
      included: plan.features.videoCall,
      tooltip: featureExplanations.videoCalls
    },
    { 
      key: 'branding', 
      name: 'Sin marca de agua',
      included: plan.features.branding,
      tooltip: featureExplanations.noWatermark
    },
    { 
      key: 'customDomain', 
      name: 'Dominio personalizado',
      included: plan.features.customDomain,
      tooltip: featureExplanations.customDomain
    },
    { 
      key: 'adminDashboard', 
      name: 'Panel administrativo',
      included: plan.features.adminDashboard,
      tooltip: featureExplanations.adminPanel
    },
    { 
      key: 'bulkInvites', 
      name: 'Invitaciones masivas',
      included: plan.features.bulkInvites,
      tooltip: featureExplanations.massInvites
    },
    { 
      key: 'reporting', 
      name: 'Reportes y exportación',
      included: plan.features.reporting,
      tooltip: featureExplanations.reports
    },
  ];

  const getSupportTooltip = (supportLevel) => {
    if (supportLevel.includes('24/7') || supportLevel.includes('dedicado')) {
      return featureExplanations.dedicatedSupport;
    } else if (supportLevel.includes('prioritario') || supportLevel.includes('Chat')) {
      return featureExplanations.prioritySupport;
    } else {
      return featureExplanations.emailSupport;
    }
  };

  const displayPrice = currency === 'USD' ? plan.priceUSD : plan.price;
  const currencySymbol = currency === 'USD' ? '$' : '$';

  return (
    <div className={`pricing-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}>
      {plan.popular && <div className="popular-badge">Más Popular</div>}
      
      <div className="card-header">
        <h3 className="plan-name">{plan.name}</h3>
        <div className="plan-price">
          <span className="price-amount">
            {currencySymbol}{displayPrice ? displayPrice.toLocaleString('es-CL') : '0'}
          </span>
          <span className="price-interval">
            /{plan.interval === 'month' ? 'mes' : plan.interval === 'forever' ? 'siempre' : 'año'}
          </span>
        </div>
        {plan.trial && (
          <div className="trial-badge">
            {plan.trial} días de prueba gratis
          </div>
        )}
        <p className="plan-description">{plan.description}</p>
      </div>

      <div className="plan-features">
        {/* Límites principales */}
        <div className="features-section">
          <h4 className="features-title">Características incluidas</h4>
          <div className="feature included">
            <Check className="feature-icon" size={20} />
            <span className="feature-text">
              <strong>Familias:</strong> {formatLimit(plan.features.families)}
              <FeatureTooltip {...featureExplanations.families} />
            </span>
          </div>
          <div className="feature included">
            <Check className="feature-icon" size={20} />
            <span className="feature-text">
              <strong>Miembros:</strong> {formatLimit(plan.features.members)}
              <FeatureTooltip {...featureExplanations.members} />
            </span>
          </div>
          <div className="feature included">
            <Check className="feature-icon" size={20} />
            <span className="feature-text">
              <strong>Publicaciones:</strong> {formatLimit(plan.features.posts)}
              <FeatureTooltip {...featureExplanations.posts} />
            </span>
          </div>
          <div className="feature included">
            <Check className="feature-icon" size={20} />
            <span className="feature-text">
              <strong>Almacenamiento:</strong> {plan.features.storage}
              <FeatureTooltip {...featureExplanations.storage} />
            </span>
          </div>
          <div className="feature included">
            <Check className="feature-icon" size={20} />
            <span className="feature-text">
              <strong>Videos:</strong> {plan.features.videoLength} seg
              <FeatureTooltip {...featureExplanations.videoDuration} />
            </span>
          </div>
        </div>

        {/* Funciones avanzadas */}
        <div className="features-section">
          <h4 className="features-title">Funciones</h4>
          {featuresArray.map((feature) => (
            <div 
              key={feature.key} 
              className={`feature ${feature.included ? 'included' : 'excluded'}`}
            >
              {feature.included ? (
                <Check className="feature-icon" size={20} />
              ) : (
                <X className="feature-icon" size={20} />
              )}
              <span className="feature-text">
                {feature.name}
                {feature.included && feature.tooltip && (
                  <FeatureTooltip {...feature.tooltip} />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Soporte */}
        <div className="features-section">
          <h4 className="features-title">Soporte</h4>
          <div className="feature included">
            <Check className="feature-icon" size={20} />
            <span className="feature-text">
              {plan.features.support}
              <FeatureTooltip {...getSupportTooltip(plan.features.support)} />
            </span>
          </div>
        </div>
      </div>

      <button 
        className={`plan-cta ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}
        onClick={handleSelectPlan}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Plan Actual' : plan.cta || 'Seleccionar Plan'}
      </button>
    </div>
  );
}