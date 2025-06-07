import React from 'react';
import { useNavigate } from 'react-router-dom';
import VideoFile from '../assets/Video.mp4';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden font-roboto">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ 
            width: '100vw', 
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        >
          <source src={VideoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-roboto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-off-white mb-8 leading-tight font-roboto">
          Power Washing Near Me | Professional Pressure Washing Services Austin
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-light-gray mb-12 max-w-3xl mx-auto leading-relaxed font-roboto">
          Top-rated pressure washing company offering house power washing, driveway cleaning service, soft wash roof cleaning, and professional pressure washing services near you in Austin, TX
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/contact')}
            className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-white hover:from-gold-400 hover:to-gold-300 hover:shadow-gold-glow rounded-lg transition-all duration-300 transform hover:scale-105 font-roboto"
          >
            Book an Estimate
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 