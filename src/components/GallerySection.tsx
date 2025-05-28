import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import gallery images
import img1 from '../assets/gallery/DSC09214.jpg';
import img2 from '../assets/gallery/DSC09231.jpg';
import img3 from '../assets/gallery/DSC09236.jpg';
import img4 from '../assets/gallery/DSC09262.jpg';
import img5 from '../assets/gallery/DSC09320.jpg';
import img6 from '../assets/gallery/DSC09369.jpg';
import img7 from '../assets/gallery/DSC09273.jpg';
import img8 from '../assets/gallery/C0068T01.jpg';

const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Featured images for the main gallery section
  const featuredImages = [
    { src: img1, alt: 'Professional roof cleaning service', title: 'Roof Cleaning' },
    { src: img2, alt: 'Window washing and cleaning', title: 'Window Cleaning' },
    { src: img3, alt: 'Pressure washing stone surfaces', title: 'Pressure Washing' },
    { src: img4, alt: 'Solar panel cleaning service', title: 'Solar Panel Cleaning' },
    { src: img5, alt: 'Exterior window cleaning', title: 'Exterior Cleaning' },
    { src: img6, alt: 'Professional cleaning team', title: 'Professional Service' },
    { src: img7, alt: 'Residential cleaning service', title: 'Residential Work' },
    { src: img8, alt: 'Commercial cleaning project', title: 'Commercial Work' },
  ];

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="py-20 bg-background-secondary font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Our <span className="text-gold-500">Work</span> Gallery
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            See the exceptional results we deliver for our clients across all our cleaning services
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-background-card border border-border-primary hover:border-gold-500/50 transition-all duration-300 cursor-pointer"
              onClick={() => handleImageClick(image.src)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                </div>
              </div>

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Gallery Button */}
        <div className="text-center">
          <Link 
            to="/gallery"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 transform hover:scale-105"
          >
            View Full Gallery
            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Detailed view of cleaning work"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection; 