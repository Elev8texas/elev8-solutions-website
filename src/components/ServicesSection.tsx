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
      description: "Professional window cleaning services that deliver crystal clear, streak-free results for residential and commercial properties.",
      side: "left"
    },
    {
      id: 2,
      title: "Power Washing & Pressure Washing",
      description: "Expert pressure washing services near you - from driveway cleaning service to house power washing and soft wash pressure washing for all exterior surfaces.",
      side: "right"
    },
    {
      id: 3,
      title: "Roof Cleaning Services",
      description: "Professional roof cleaning services near me using safe soft wash pressure washing techniques to remove algae, moss, and stains without damage.",
      side: "left"
    },
    {
      id: 4,
      title: "Exterior Cleaning",
      description: "Complete exterior surface cleaning including siding, decks, and outdoor structures using professional power washing equipment.",
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
            Professional <span className="text-gold-500">Pressure Washing Services Near Me</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Top-rated pressure washing company in Austin TX delivering power washing services, driveway cleaning, and soft wash roof cleaning with exceptional results
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