import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BundleSection: React.FC = () => {
  const [visibleBundles, setVisibleBundles] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const bundles = [
    {
      id: 1,
      name: "Curb Appeal",
      price: "$399",
      description: "Perfect for maintaining your property's appearance",
      features: [
        "Window washing (exterior)",
        "Pressure washing walkways",
        "Driveway pressure washing",
        "Gutter cleaning",
        "Free consultation"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Big Tex Makeover",
      price: "$899",
      description: "Ultimate luxury cleaning experience",
      features: [
        "Driveway pressure washing",
        "Sidewalk pressure washing",
        "Interior window cleaning",
        "Exterior window cleaning",
        "Home exterior soft washing",
        "Roof soft washing",
        "Gutter cleaning",
        "Solar panel cleaning",
        "Deck and patio pressure washing",
        "Exterior light washing",
        "Priority scheduling",
        "Free consultation",
        "Free 30-day touch up"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Roof Renovation",
      price: "$499",
      description: "Complete exterior transformation for your property",
      features: [
        "Roof soft washing",
        "Gutter cleaning",
        "Solar panel cleaning (Improves efficiency by 30%*)",
        "Free touch ups for 30 days",
        "Free consultation"
      ],
      popular: false
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bundleId = parseInt(entry.target.getAttribute('data-bundle-id') || '0');
            setVisibleBundles(prev => [...prev, bundleId]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const bundleElements = sectionRef.current?.querySelectorAll('[data-bundle-id]');
    bundleElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background-secondary font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Service <span className="text-gold-500">Bundles</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Choose the perfect package for your property's needs
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {bundles.map((bundle, index) => (
            <div
              key={bundle.id}
              data-bundle-id={bundle.id}
              className={`transform transition-all duration-1000 ease-out delay-${index * 200} ${
                visibleBundles.includes(bundle.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              }`}
            >
              <div className={`relative bg-background-card/60 backdrop-blur-sm border rounded-xl p-8 hover:bg-background-card/80 transition-all duration-300 h-full ${
                bundle.popular 
                  ? 'border-gold-500 shadow-gold-glow scale-105' 
                  : 'border-border-primary hover:shadow-gold'
              }`}>
                
                {/* Popular Badge */}
                {bundle.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-gold-500 to-gold-400 text-background-primary px-6 py-2 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Bundle Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    {bundle.name}
                  </h3>
                  <div className="text-4xl font-bold text-gold-500 mb-3">
                    <div className="text-sm font-normal text-text-secondary mb-1">Starting at</div>
                    {bundle.price}
                  </div>
                  <p className="text-text-secondary">
                    {bundle.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {bundle.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-text-secondary">
                        <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <button 
                    onClick={() => navigate('/contact', { state: { selectedService: bundle.name } })}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      bundle.popular
                        ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-white hover:from-gold-400 hover:to-gold-300 hover:shadow-gold-glow'
                        : 'bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-background-primary'
                    }`}
                  >
                    Choose Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-text-secondary mb-6 text-lg">
            Not sure which package is right for you?
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-transparent border border-white/20 text-white hover:bg-gradient-to-r hover:from-gold-500 hover:to-gold-400 hover:text-charcoal hover:border-transparent rounded-lg transition-all duration-300 font-semibold"
          >
            Get Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default BundleSection; 