import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-primary border-t border-border-primary font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="/logo.png" 
                alt="Elev8 Cleaning Solutions" 
                className="h-10 w-auto mr-3"
              />
              <div>
                <h3 className="text-xl font-bold text-text-primary">Elev8</h3>
                <p className="text-sm text-gold-500">Cleaning Solutions</p>
              </div>
            </div>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Your neighborhood's go-to for effective cleaning solutions. Dedicated professionals driven by a passion for exceptional work.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/elev8solutions" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background-card border border-border-primary rounded-lg flex items-center justify-center text-text-secondary hover:text-gold-500 hover:border-gold-500/50 transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/elev8solutions" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background-card border border-border-primary rounded-lg flex items-center justify-center text-text-secondary hover:text-gold-500 hover:border-gold-500/50 transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a 
                href="https://business.google.com/elev8solutions" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background-card border border-border-primary rounded-lg flex items-center justify-center text-text-secondary hover:text-gold-500 hover:border-gold-500/50 transition-all duration-300"
                aria-label="Find us on Google Business"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Window Washing
                </a>
              </li>
              <li>
                <a href="#services" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Pressure Washing
                </a>
              </li>
              <li>
                <a href="#services" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Roof & Gutter Cleaning
                </a>
              </li>
              <li>
                <a href="#services" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Exterior Cleaning
                </a>
              </li>
              <li>
                <a href="#services" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Solar Panel Cleaning
                </a>
              </li>
              <li>
                <Link to="/gallery" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  View Our Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <a href="#services" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#bundles" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Service Packages
                </a>
              </li>
              <li>
                <Link to="/gallery" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Gallery
                </Link>
              </li>
              <li>
                <a href="#reviews" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                  Get Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-text-secondary">Phone</p>
                  <a href="tel:+1234567890" className="text-text-primary hover:text-gold-500 transition-colors duration-300 font-medium">
                    (123) 456-7890
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-text-secondary">Email</p>
                  <a href="mailto:info@elev8cleaning.com" className="text-text-primary hover:text-gold-500 transition-colors duration-300 font-medium">
                    info@elev8cleaning.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-text-secondary">Service Area</p>
                  <p className="text-text-primary font-medium">
                    Local Area & Surrounding Communities
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-text-secondary">Business Hours</p>
                  <div className="text-text-primary font-medium">
                    <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                    <p>Sat: 9:00 AM - 4:00 PM</p>
                    <p>Sun: By Appointment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-border-primary">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-text-secondary text-sm">
              © {currentYear} Elev8 Cleaning Solutions. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#terms" className="text-text-secondary hover:text-gold-500 transition-colors duration-300">
                Terms of Service
              </a>
              <div className="flex items-center space-x-2 text-text-secondary">
                <span>Licensed & Insured</span>
                <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 