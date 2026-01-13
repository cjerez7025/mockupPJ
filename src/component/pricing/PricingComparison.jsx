// src/components/Pricing/PricingComparison.jsx
import React from 'react';
import { Check, X } from 'lucide-react';
import { PLANS } from '../../config/plans';
import './PricingComparison.css';

const PricingComparison = () => {
  const features = [
    { key: 'families', label: 'Número de familias' },
    { key: 'members', label: 'Miembros por familia' },
    { key: 'posts', label: 'Publicaciones' },
    { key: 'storage', label: 'Almacenamiento' },
    { key: 'videoLength', label: 'Duración de videos (seg)' },
    { key: 'support', label: 'Soporte' },
    { key: 'analytics', label: 'Estadísticas' },
    { key: 'videoCall', label: 'Videollamadas' },
    { key: 'branding', label: 'Sin marca de agua' },
    { key: 'customDomain', label: 'Dominio personalizado' },
    { key: 'adminDashboard', label: 'Panel administrativo' },
    { key: 'bulkInvites', label: 'Invitaciones masivas' },
    { key: 'reporting', label: 'Reportes' },
  ];

  const plans = Object.values(PLANS);

  const renderFeatureValue = (value) => {
    if (value === true) {
      return <Check size={20} className="feature-check" />;
    }
    if (value === false) {
      return <X size={20} className="feature-x" />;
    }
    if (typeof value === 'number') {
      return <span className="feature-value">{value}</span>;
    }
    return <span className="feature-value">{value}</span>;
  };

  return (
    <div className="pricing-comparison">
      <h2 className="comparison-title">Comparación Detallada de Planes</h2>
      
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="feature-column">Características</th>
              {plans.map(plan => (
                <th key={plan.id} className={plan.popular ? 'popular-column' : ''}>
                  <div className="plan-header">
                    {plan.popular && <span className="popular-tag">Popular</span>}
                    <div className="plan-name">{plan.name}</div>
                    <div className="plan-price">
                      {plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString('es-CL')}`}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr key={feature.key}>
                <td className="feature-label">{feature.label}</td>
                {plans.map(plan => (
                  <td key={plan.id} className={plan.popular ? 'popular-column' : ''}>
                    {renderFeatureValue(plan.features[feature.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingComparison;