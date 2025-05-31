import React, { useState } from 'react';
import { saveEmail } from '../services/firebase';
import { analytics } from '../utils/analytics';

interface NewsletterPopupProps {
  onClose: () => void;
  isVisible: boolean;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ onClose, isVisible }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track popup view when it becomes visible
  React.useEffect(() => {
    if (isVisible) {
      analytics.trackPopupInteraction('view', 'newsletter');
    }
  }, [isVisible]);

  const handleClose = () => {
    analytics.trackPopupInteraction('close', 'newsletter');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Save email to Firebase Emails collection
      const docId = await saveEmail(email, 'newsletter-popup');
      console.log('Newsletter email saved with ID:', docId);
      
      // Track successful newsletter signup
      analytics.trackFormSubmission('newsletter');
      analytics.trackConversion('email_signup');
      analytics.trackPopupInteraction('submit', 'newsletter');
      
      setIsSubmitted(true);
      
      // Auto-close after success message
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setSubmitError('There was an error subscribing to our newsletter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-background-card border border-border-primary rounded-xl w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-text-muted hover:text-text-primary transition-colors duration-200 z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gold-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
                  Stay in the <span className="text-gold-500">Loop</span>
                </h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  Get weekly cleaning tips, seasonal maintenance reminders, and exclusive offers delivered to your inbox.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted text-sm sm:text-base"
                    required
                  />
                </div>
                
                {/* Error Message */}
                {submitError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-gold-glow transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe to Newsletter'
                  )}
                </button>
              </form>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-border-primary">
                <p className="text-xs sm:text-sm text-text-muted text-center mb-3">What you'll get:</p>
                <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span>Weekly cleaning and maintenance tips</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span>Seasonal property care reminders</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span>Exclusive subscriber discounts</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span>No spam, unsubscribe anytime</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
                Welcome Aboard!
              </h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Thanks for subscribing! You'll receive your first newsletter soon with valuable cleaning tips and exclusive offers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup; 