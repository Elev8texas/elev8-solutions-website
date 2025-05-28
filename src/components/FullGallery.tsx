import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import all gallery images
import img1 from '../assets/gallery/DSC09214.jpg';
import img2 from '../assets/gallery/DSC09231.jpg';
import img3 from '../assets/gallery/7931bd690adb86acebcdd5fcc062172c.jpg';
import img4 from '../assets/gallery/b140c3e20274f332e8f25b0ad9bdab8c.jpg';
import img5 from '../assets/gallery/C0068T01.jpg';
import img6 from '../assets/gallery/DSC09236.jpg';
import img7 from '../assets/gallery/DSC09262.jpg';
import img8 from '../assets/gallery/DSC09273.jpg';
import img9 from '../assets/gallery/DSC09310.jpg';
import img10 from '../assets/gallery/DSC09320.jpg';
import img11 from '../assets/gallery/DSC09369.jpg';
import img12 from '../assets/gallery/DSC09399.jpg';
import img13 from '../assets/gallery/IMG_0309.jpeg';
import img14 from '../assets/gallery/DSC09252.jpg';
import img15 from '../assets/gallery/Timeline 1_00086514.jpg';
import img16 from '../assets/gallery/DSC09214.jpg';

const FullGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // All gallery images with categories
  const allImages = [
    { src: img1, alt: 'Stone patio pressure washing before and after', category: 'pressure-washing', title: 'Patio Restoration' },
    { src: img2, alt: 'Stone wall pressure washing transformation', category: 'pressure-washing', title: 'Wall Cleaning' },
    { src: img3, alt: 'Roof cleaning and maintenance', category: 'roof-cleaning', title: 'Roof Cleaning' },
    { src: img4, alt: 'Solar panel cleaning service', category: 'solar-cleaning', title: 'Solar Panel Cleaning' },
    { src: img5, alt: 'Professional window cleaning', category: 'window-cleaning', title: 'Window Cleaning' },
    { src: img6, alt: 'Residential exterior cleaning', category: 'exterior-cleaning', title: 'Exterior Cleaning' },
    { src: img7, alt: 'Professional cleaning team at work', category: 'team', title: 'Professional Service' },
    { src: img8, alt: 'Commercial building cleaning', category: 'commercial', title: 'Commercial Work' },
    { src: img9, alt: 'Detailed window cleaning process', category: 'window-cleaning', title: 'Window Detailing' },
    { src: img10, alt: 'Pressure washing equipment in action', category: 'pressure-washing', title: 'Equipment' },
    { src: img11, alt: 'Residential property maintenance', category: 'residential', title: 'Residential Service' },
    { src: img12, alt: 'High-quality exterior cleaning', category: 'exterior-cleaning', title: 'Exterior Work' },
    { src: img13, alt: 'Professional cleaning results', category: 'before-after', title: 'Quality Results' },
    { src: img14, alt: 'Complete property cleaning service', category: 'residential', title: 'Full Service' },
    { src: img15, alt: 'Detailed cleaning work', category: 'detail-work', title: 'Detail Work' },
    { src: img16, alt: 'Professional cleaning standards', category: 'professional', title: 'Professional Standards' },
  ];

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'pressure-washing', name: 'Pressure Washing' },
    { id: 'window-cleaning', name: 'Window Cleaning' },
    { id: 'roof-cleaning', name: 'Roof Cleaning' },
    { id: 'solar-cleaning', name: 'Solar Cleaning' },
    { id: 'exterior-cleaning', name: 'Exterior Cleaning' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
  ];

  const filteredImages = filter === 'all' 
    ? allImages 
    : allImages.filter(image => image.category === filter);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-background-primary font-roboto pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Complete <span className="text-gold-500">Work</span> Gallery
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore our comprehensive portfolio of professional cleaning services and transformations
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                filter === category.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-white shadow-gold-glow'
                  : 'bg-background-card border border-border-primary text-text-secondary hover:border-gold-500/50 hover:text-text-primary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
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

        {/* Back to Home Button */}
        <div className="text-center mt-16">
          <Link 
            to="/"
            className="inline-flex items-center px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-gradient-to-r hover:from-gold-500 hover:to-gold-400 hover:text-charcoal hover:border-transparent rounded-lg transition-all duration-300 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl max-h-full">
            <img
              src={selectedImage}
              alt="Detailed view of professional cleaning work"
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
    </div>
  );
};

export default FullGallery; 