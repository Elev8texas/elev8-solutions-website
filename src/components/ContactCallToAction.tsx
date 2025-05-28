import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactCallToAction: React.FC = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    // Navigate to the help contact form page
    navigate('/help');
  };

  return (
    <section className="bg-background-secondary border-t border-border-primary py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Not sure where to start?
        </h2>
        <p className="text-text-muted text-lg md:text-xl mb-8">
          Fill out the form and a representative will reach out.
        </p>
        <button
          onClick={handleContactClick}
          className="bg-gold-gradient hover:bg-gold-gradient-hover text-background-primary font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-luxe hover:shadow-gold-glow transform hover:-translate-y-0.5 text-lg"
        >
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default ContactCallToAction; 