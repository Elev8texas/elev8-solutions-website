import React, { useState } from 'react';
import { saveEmail } from '../services/firebase';

interface NewsletterPopupProps {
  onClose: () => void;
  isVisible: boolean;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ onClose, isVisible }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Save email to Firebase Emails collection
      const docId = await saveEmail(email, 'newsletter-popup');
      console.log('Newsletter email saved with ID:', docId);
      
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background-card border border-border-primary rounded-xl max-w-md w-full mx-4 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Stay in the <span className="text-gold-500">Loop</span>
                </h3>
                <p className="text-text-secondary">
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
                    className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted"
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
                  className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-gold-glow transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe to Newsletter'
                  )}
                </button>
              </form>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-border-primary">
                <p className="text-sm text-text-muted text-center mb-3">What you'll get:</p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3"></div>
                    Weekly cleaning and maintenance tips
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3"></div>
                    Seasonal property care reminders
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3"></div>
                    Exclusive subscriber discounts
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3"></div>
                    No spam, unsubscribe anytime
                  </li>
                </ul>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                Welcome Aboard!
              </h3>
              <p className="text-text-secondary">
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