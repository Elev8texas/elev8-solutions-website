import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCommercialClick = () => {
    navigate('/commercial');
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const services = [
    { name: 'Window Washing', path: '/services/window-washing' },
    { name: 'Pressure Washing', path: '/services/pressure-washing' },
    { name: 'Roof Cleaning', path: '/services/roof-cleaning' },
    { name: 'Gutter Cleaning', path: '/services/gutter-cleaning' },
    { name: 'Solar Panel Cleaning', path: '/services/solar-panel-cleaning' },
    { name: 'Exterior Cleaning', path: '/services/exterior-cleaning' },
    { name: 'Deck & Patio Cleaning', path: '/services/deck-patio-cleaning' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/85 backdrop-blur-md border-b border-gray-600/30' 
        : 'bg-black/70 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-6 flex-1">
            <button 
              onClick={handleCommercialClick}
              className="px-4 py-2 bg-gold-gradient hover:bg-gold-gradient-hover text-background-primary font-semibold rounded-lg transition-all duration-300 shadow-luxe hover:shadow-gold-glow transform hover:-translate-y-0.5 text-sm"
            >
              Commercial
            </button>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
                className="nav-link text-off-white hover:text-gold transition-colors duration-300 text-sm font-medium flex items-center space-x-1"
              >
                <span>Services</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
                className={`absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-gray-600/30 rounded-lg shadow-xl transition-all duration-200 ${
                  isServicesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div className="py-2">
                  <Link
                    to="/services"
                    className="block px-4 py-3 text-off-white hover:text-gold hover:bg-gold-500/10 transition-colors duration-200 border-b border-gray-600/20"
                  >
                    <div className="font-medium">All Services</div>
                    <div className="text-xs text-gray-400">Complete service overview</div>
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className="block px-4 py-2 text-sm text-off-white hover:text-gold hover:bg-gold-500/10 transition-colors duration-200"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link to="/about" className="nav-link text-off-white hover:text-gold transition-colors duration-300 text-sm font-medium">
              About
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center lg:flex-none">
            <Link to="/" className="block">
              <img 
                src={logo} 
                alt="Elev8 Cleaning Solutions" 
                className="h-10 sm:h-12 lg:h-16 w-auto transition-all duration-300 hover:scale-105 cursor-pointer"
              />
            </Link>
          </div>

          {/* Right Navigation & CTA - Desktop */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-end">
            <Link to="/gallery" className="nav-link text-off-white hover:text-gold transition-colors duration-300 text-sm font-medium">
              Gallery
            </Link>
            <Link to="/help" className="nav-link text-off-white hover:text-gold transition-colors duration-300 text-sm font-medium">
              Contact
            </Link>
            <Link to="/contact" className="px-6 py-2.5 bg-transparent border border-white/20 text-white hover:bg-gradient-to-r hover:from-gold-500 hover:to-gold-400 hover:text-charcoal hover:border-transparent rounded-lg hover:shadow-gold transition-all duration-300 font-semibold text-sm">
              Book an Estimate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-off-white hover:text-gold transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/90 backdrop-blur-md rounded-lg mt-2 border border-gray-600/30">
              <div className="px-3 py-2">
                <button 
                  onClick={handleCommercialClick}
                  className="w-full px-4 py-2 bg-gold-gradient hover:bg-gold-gradient-hover text-background-primary font-semibold rounded-lg transition-all duration-300 shadow-luxe hover:shadow-gold-glow"
                >
                  Commercial
                </button>
              </div>
              
              {/* Mobile Services Menu */}
              <div className="px-3 py-2">
                <Link to="/services" className="block text-off-white hover:text-gold transition-colors duration-300 font-medium mb-2" onClick={() => setIsMobileMenuOpen(false)}>
                  All Services
                </Link>
                <div className="ml-4 space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className="block text-sm text-gray-300 hover:text-gold transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link to="/about" className="block px-3 py-2 text-off-white hover:text-gold transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/gallery" className="block px-3 py-2 text-off-white hover:text-gold transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Gallery
              </Link>
              <Link to="/help" className="block px-3 py-2 text-off-white hover:text-gold transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
              <div className="px-3 py-2">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-6 py-2.5 bg-transparent border border-white/20 text-white hover:bg-gradient-to-r hover:from-gold-500 hover:to-gold-400 hover:text-charcoal hover:border-transparent rounded-lg hover:shadow-gold transition-all duration-300 font-semibold text-center">
                  Book an Estimate
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 