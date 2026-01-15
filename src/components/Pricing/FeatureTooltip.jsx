import { useState } from 'react';
import { Info } from 'lucide-react';
import './FeatureTooltip.css';

export default function FeatureTooltip({ title, description }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="feature-tooltip-container">
      <div
        className="tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <Info size={16} className="info-icon" />
      </div>
      
      {isVisible && (
        <div className="tooltip-popup">
          <h4 className="tooltip-title">{title}</h4>
          <p className="tooltip-description">{description}</p>
        </div>
      )}
    </div>
  );
}