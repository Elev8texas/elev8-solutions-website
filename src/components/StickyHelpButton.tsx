import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { analytics } from '../utils/analytics';

const StickyHelpButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    // Track help button usage
    analytics.trackHelpButtonUsage();
    analytics.trackNavigation('/help', 'sticky_help_button');
    
    // Navigate to the help contact form page
    navigate('/help');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-gold-glow transition-all duration-300 transform hover:scale-105"
      >
        {/* Button Text */}
        <span className="whitespace-nowrap">Need Help?</span>
      </button>

      {/* Tooltip on hover */}
      <div className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-background-card/90 backdrop-blur-sm border border-border-primary text-text-primary text-sm rounded-lg whitespace-nowrap transition-all duration-300 ${
        isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2 pointer-events-none'
      }`}>
        Contact us for assistance
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background-card/90"></div>
      </div>
    </div>
  );
};

export default StickyHelpButton; 