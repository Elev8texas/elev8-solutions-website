import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServicesSection: React.FC = () => {
  const [visibleServices, setVisibleServices] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Window Washing",
      description: "Crystal clear windows that showcase your property's beauty with professional streak-free cleaning.",
      side: "left"
    },
    {
      id: 2,
      title: "Pressure Washing",
      description: "Powerful cleaning solutions that restore surfaces to their original pristine condition.",
      side: "right"
    },
    {
      id: 3,
      title: "Roof & Gutter Cleaning",
      description: "Comprehensive roof and gutter maintenance to protect your property from water damage.",
      side: "left"
    },
    {
      id: 4,
      title: "Exterior Cleaning",
      description: "Complete exterior surface cleaning including siding, decks, and outdoor structures.",
      side: "right"
    }
  ];

  const handleLearnMoreClick = () => {
    navigate('/services');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const serviceId = parseInt(entry.target.getAttribute('data-service-id') || '0');
            setVisibleServices(prev => [...prev, serviceId]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const serviceElements = sectionRef.current?.querySelectorAll('[data-service-id]');
    serviceElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background-primary font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Our <span className="text-gold-500">Premium</span> Services
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Delivering exceptional exterior cleaning solutions with unmatched attention to detail
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {services.map((service) => (
            <div
              key={service.id}
              data-service-id={service.id}
              className={`transform transition-all duration-1000 ease-out ${
                visibleServices.includes(service.id)
                  ? 'translate-x-0 opacity-100'
                  : service.side === 'left' 
                    ? '-translate-x-12 opacity-0' 
                    : 'translate-x-12 opacity-0'
              }`}
            >
              <div className="bg-background-card/50 backdrop-blur-sm border border-border-primary rounded-xl p-8 hover:bg-background-card/70 transition-all duration-300 hover:shadow-gold">
                
                {/* Service Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  {service.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <button 
                  onClick={handleLearnMoreClick}
                  className="text-gold-500 hover:text-gold-400 font-semibold transition-colors duration-300 group"
                >
                  Learn More 
                  <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 