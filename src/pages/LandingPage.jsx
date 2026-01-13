// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  Video,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart size={40} />,
      title: 'Mantén la Conexión',
      description: 'Comparte momentos especiales que durarán para siempre, sin importar la distancia.'
    },
    {
      icon: <Shield size={40} />,
      title: 'Seguro y Privado',
      description: 'Tus recuerdos protegidos con encriptación de nivel bancario.'
    },
    {
      icon: <Video size={40} />,
      title: 'Videos y Fotos',
      description: 'Comparte videos, fotos y mensajes en un solo lugar seguro.'
    },
    {
      icon: <Clock size={40} />,
      title: 'Línea de Tiempo',
      description: 'Organiza tus recuerdos cronológicamente y revívelos cuando quieras.'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Madre',
      text: 'Esta plataforma me permite mantener viva la relación con mi hijo a pesar de la distancia. Es invaluable.',
      rating: 5
    },
    {
      name: 'Fundación Familias Unidas',
      role: 'ONG',
      text: 'Ayudamos a más de 50 familias a mantenerse conectadas. La herramienta perfecta para nuestro trabajo.',
      rating: 5
    },
    {
      name: 'Roberto Pérez',
      role: 'Padre',
      text: 'Simple, segura y efectiva. Mi hijo puede ver todos los recuerdos que compartimos juntos.',
      rating: 5
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Conecta con quienes más <span className="gradient-text">amas</span>
          </h1>
          <p className="hero-subtitle">
            Una plataforma segura para compartir recuerdos y mantener viva la conexión familiar,
            sin importar la distancia o las circunstancias.
          </p>
          <div className="hero-buttons">
            <button 
              className="hero-cta primary"
              onClick={() => navigate('/pricing')}
            >
              Ver Planes
              <ArrowRight size={20} />
            </button>
            <button 
              className="hero-cta secondary"
              onClick={() => navigate('/register')}
            >
              Comenzar Gratis
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Familias Conectadas</div>
            </div>
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Recuerdos Compartidos</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Seguro y Privado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <h2 className="section-title">Cómo Funciona</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Crea tu Familia</h3>
            <p>Registra tu cuenta y crea un espacio privado para tu familia</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Invita a tus Seres Queridos</h3>
            <p>Comparte un código de acceso seguro con quienes desees</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Comparte Recuerdos</h3>
            <p>Sube fotos, videos y mensajes que durarán para siempre</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Mantén la Conexión</h3>
            <p>Revive los momentos especiales cuando quieras</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">Lo que Dicen Nuestros Usuarios</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Comienza a Crear Recuerdos Hoy</h2>
          <p>Únete a cientos de familias que ya están conectadas</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/pricing')}
          >
            Ver Planes y Precios
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;