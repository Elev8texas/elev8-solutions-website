// Google Analytics utility functions for tracking events and page views

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-G84RB91LH1', {
      page_path: url,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, parameters?: {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters);
  }
};

// Predefined tracking functions for common events
export const analytics = {
  // Form submissions
  trackFormSubmission: (formType: 'contact' | 'quote' | 'newsletter' | 'commercial' | 'help') => {
    trackEvent('form_submit', {
      event_category: 'engagement',
      event_label: formType,
    });
  },

  // Service interactions
  trackServiceView: (serviceName: string) => {
    trackEvent('view_service', {
      event_category: 'services',
      event_label: serviceName,
    });
  },

  // Quote interactions
  trackQuoteStep: (step: number) => {
    trackEvent('quote_step_progress', {
      event_category: 'quote_form',
      event_label: `step_${step}`,
      value: step,
    });
  },

  // Phone/email clicks
  trackContactClick: (method: 'phone' | 'email') => {
    trackEvent('contact_click', {
      event_category: 'contact',
      event_label: method,
    });
  },

  // Button clicks
  trackButtonClick: (buttonName: string, location?: string) => {
    trackEvent('click', {
      event_category: 'ui_interaction',
      event_label: buttonName,
      custom_parameter: location,
    });
  },

  // Gallery interactions
  trackGalleryView: (imageCategory?: string) => {
    trackEvent('view_gallery', {
      event_category: 'engagement',
      event_label: imageCategory || 'main_gallery',
    });
  },

  // Help button usage
  trackHelpButtonUsage: () => {
    trackEvent('help_button_click', {
      event_category: 'support',
      event_label: 'sticky_help_button',
    });
  },

  // Popup interactions
  trackPopupInteraction: (action: 'view' | 'close' | 'submit', popupType: string) => {
    trackEvent(`popup_${action}`, {
      event_category: 'popup',
      event_label: popupType,
    });
  },

  // Navigation tracking
  trackNavigation: (destination: string, source?: string) => {
    trackEvent('navigate', {
      event_category: 'navigation',
      event_label: destination,
      source: source,
    });
  },

  // Conversion tracking
  trackConversion: (conversionType: 'quote_request' | 'contact_form' | 'phone_call' | 'email_signup') => {
    trackEvent('conversion', {
      event_category: 'conversion',
      event_label: conversionType,
    });
  }
};

export default analytics; 