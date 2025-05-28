import React from 'react';

interface CustomerReview {
  name: string;
  rating: number;
  text: string;
  service: string;
  timeAgo: string;
}

const ReviewsSection: React.FC = () => {
  // Hardcoded customer reviews
  const customerReviews: CustomerReview[] = [
    {
      name: "Anonymous Customer",
      rating: 5,
      text: "These guys went above and beyond and not only cleaned all the windows of my house for a great price, but also cleaned up a bunch of broken glass that fell out of my garage door (at no additional charge). I highly recommend!",
      service: "Window Cleaning",
      timeAgo: "2 weeks ago"
    },
    {
      name: "Anonymous Customer",
      rating: 5,
      text: "Really great guys. Arrived on time. No hassles. Did windows cleaning and pressure washing. Reasonable pricing and very professional.",
      service: "Window Cleaning & Pressure Washing",
      timeAgo: "1 month ago"
    },
    {
      name: "Anonymous Customer",
      rating: 5,
      text: "I wanted to take a moment to commend Brett and Caleb for their outstanding work on cleaning our window exteriors. They did an excellent job, and we're really pleased with the results. Their attention to detail and professionalism were much appreciated. Highly recommend their service!",
      service: "Exterior Window Cleaning",
      timeAgo: "3 weeks ago"
    },
    {
      name: "Anonymous Customer",
      rating: 5,
      text: "Exceptional service from start to finish. The team was punctual, thorough, and left our property looking spotless. Will definitely be using their services again!",
      service: "Pressure Washing",
      timeAgo: "1 week ago"
    },
    {
      name: "Anonymous Customer",
      rating: 5,
      text: "Outstanding work on our roof and gutters. The team was professional, efficient, and the results exceeded our expectations. Highly recommended!",
      service: "Roof & Gutter Cleaning",
      timeAgo: "2 months ago"
    },
    {
      name: "Anonymous Customer",
      rating: 5,
      text: "Great experience with Elev8 Solutions. They transformed the exterior of our home with their comprehensive cleaning services. Professional team and fair pricing.",
      service: "Exterior Cleaning Package",
      timeAgo: "1 month ago"
    }
  ];

  const averageRating = 5.0;
  const totalReviews = "30+";

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-background-primary font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Customer <span className="text-gold-500">Reviews</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            See what our satisfied customers say about our cleaning services
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gold-500 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(averageRating)}
              </div>
              <p className="text-text-secondary">
                Based on {totalReviews} customer reviews
              </p>
            </div>
            
            {/* Elev8 Logo/Badge */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E8</span>
              </div>
              <span className="text-text-secondary font-medium">Elev8 Solutions</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customerReviews.map((review, index) => (
            <div key={index} className="bg-background-card/50 backdrop-blur-sm border border-border-primary rounded-xl p-6 hover:bg-background-card/70 transition-all duration-300 hover:shadow-luxe">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-text-primary font-semibold">Verified Customer</h4>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-text-secondary text-sm">{review.timeAgo}</span>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-gold-500/10 text-gold-500 text-xs font-medium rounded-full">
                  {review.service}
                </span>
              </div>
              <p className="text-text-secondary leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gold-500/10 to-gold-400/10 border border-gold-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Join Our Satisfied Customers
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Experience the same exceptional service that our customers rave about. 
              Get your free quote today and see why we're Austin's trusted cleaning professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300"
              >
                Get Free Quote
              </a>
              <a
                href="tel:+15127018085"
                className="inline-flex items-center px-8 py-3 bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-background-primary font-semibold rounded-lg transition-all duration-300"
              >
                Call (512) 701-8085
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection; 