import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureTooltip from './FeatureTooltip';
import { featureExplanations } from '../../config/featureExplanations';
import './PricingCard.css';

export default function PricingCard({ plan, isPopular }) {
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    navigate('/checkout', { state: { plan } });
  };

  const formatLimit = (value) => {
    if (value === 'unlimited') return 'Ilimitados';
    if (value === 'infinite') return 'Ilimitado';
    return value;
  };

  return (
    <div className={`pricing-card ${isPopular ? 'popular' : ''}`}>
      {isPopular && <div className="popular-badge">Más Popular</div>}
      
      <div className="card-header">
        <h3 className="plan-name">{plan.name}</h3>
        <div className="price-container">
          <span className="currency">$</span>
          <span className="price">{plan.price.toLocaleString('es-CL')}</span>
          <span className="period">/{plan.billingCycle}</span>
        </div>
        <p className="plan-description">{plan.description}</p>
      </div>

      <div className="card-body">
        <div className="limits-section">
          <h4 className="section-title">Características incluidas:</h4>
          <ul className="limits-list">
            <li className="limit-item">
              <span className="limit-label">
                Familias: 
                <FeatureTooltip {...featureExplanations.families} />
              </span>
              <span className="limit-value">{formatLimit(plan.limits.families)}</span>
            </li>
            <li className="limit-item">
              <span className="limit-label">
                Miembros: 
                <FeatureTooltip {...featureExplanations.members} />
              </span>
              <span className="limit-value">{formatLimit(plan.limits.members)}</span>
            </li>
            <li className="limit-item">
              <span className="limit-label">
                Publicaciones: 
                <FeatureTooltip {...featureExplanations.posts} />
              </span>
              <span className="limit-value">{formatLimit(plan.limits.posts)}</span>
            </li>
            <li className="limit-item">
              <span className="limit-label">
                Almacenamiento: 
                <FeatureTooltip {...featureExplanations.storage} />
              </span>
              <span className="limit-value">{plan.limits.storage}</span>
            </li>
            <li className="limit-item">
              <span className="limit-label">
                Duración de videos: 
                <FeatureTooltip {...featureExplanations.videoDuration} />
              </span>
              <span className="limit-value">{plan.limits.videoDuration}</span>
            </li>
          </ul>
        </div>

        <div className="features-section">
          <h4 className="section-title">Funciones:</h4>
          <ul className="features-list">
            {plan.features.map((feature, index) => (
              <li key={index} className="feature-item">
                {feature.included ? (
                  <Check className="feature-icon check" size={18} />
                ) : (
                  <X className="feature-icon x" size={18} />
                )}
                <span className={feature.included ? '' : 'disabled'}>
                  {feature.name}
                  {feature.included && getFeatureTooltip(feature.name)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="support-section">
          <h4 className="section-title">Soporte:</h4>
          <p className="support-text">
            Nivel de soporte: {plan.support.level}
            {getSupportTooltip(plan.support.level)}
          </p>
        </div>
      </div>

      <div className="card-footer">
        <button 
          className={`select-button ${isPopular ? 'popular' : ''}`}
          onClick={handleSelectPlan}
        >
          Seleccionar {plan.name}
        </button>
      </div>
    </div>
  );
}

// Función auxiliar para obtener el tooltip correcto según el nombre de la función
function getFeatureTooltip(featureName) {
  const tooltipMap = {
    'Estadísticas de uso': featureExplanations.statistics,
    'Estadísticas básicas': featureExplanations.statistics,
    'Estadísticas avanzadas': featureExplanations.statistics,
    'Videollamadas integradas': featureExplanations.videoCalls,
    'Sin marca de agua': featureExplanations.noWatermark,
    'Dominio personalizado': featureExplanations.customDomain,
    'Panel administrativo': featureExplanations.adminPanel,
    'Invitaciones masivas': featureExplanations.massInvites,
    'Reportes y exportación': featureExplanations.reports,
  };

  const explanation = tooltipMap[featureName];
  return explanation ? <FeatureTooltip {...explanation} /> : null;
}

// Función auxiliar para obtener el tooltip de soporte
function getSupportTooltip(supportLevel) {
  if (supportLevel.includes('24/7')) {
    return <FeatureTooltip {...featureExplanations.dedicatedSupport} />;
  } else if (supportLevel.includes('24h')) {
    return <FeatureTooltip {...featureExplanations.prioritySupport} />;
  } else {
    return <FeatureTooltip {...featureExplanations.emailSupport} />;
  }
}