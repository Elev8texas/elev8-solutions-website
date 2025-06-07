import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object;
  noindex?: boolean;
  service?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://elev8texas.com/logo512.png',
  ogType = 'website',
  jsonLd,
  noindex = false,
  service
}) => {
  const fullTitle = title.includes('Elev8') ? title : `${title} | Elev8 Solutions - Austin Pressure Washing & Cleaning`;
  const fullUrl = canonicalUrl || window.location.href;

  // Enhanced local business structured data
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Elev8 Solutions",
    "alternateName": "Elev8 Cleaning Solutions",
    "description": "Professional pressure washing, window cleaning, solar panel cleaning, and exterior cleaning services in Austin, Texas and surrounding areas.",
    "url": "https://elev8texas.com",
    "telephone": "+1-512-701-8085",
    "email": "info@elev8texas.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Austin Metro Area",
      "addressLocality": "Austin",
      "addressRegion": "TX",
      "postalCode": "78701",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.2672,
      "longitude": -97.7431
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Austin"
      },
      {
        "@type": "City", 
        "name": "Round Rock"
      },
      {
        "@type": "City",
        "name": "Cedar Park"
      },
      {
        "@type": "City",
        "name": "Leander"
      },
      {
        "@type": "City",
        "name": "Georgetown"
      },
      {
        "@type": "City",
        "name": "Pflugerville"
      },
      {
        "@type": "City",
        "name": "Lakeway"
      },
      {
        "@type": "City",
        "name": "Westlake"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 30.2672,
        "longitude": -97.7431
      },
      "geoRadius": "50000"
    },
    "openingHours": "Mo-Sa 07:00-19:00",
    "image": "https://elev8texas.com/logo512.png",
    "logo": "https://elev8texas.com/logo512.png",
    "priceRange": "$200-$2000",
    "paymentAccepted": ["Cash", "Credit Card", "Check"],
    "currenciesAccepted": "USD",
    "foundingDate": "2020",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Austin Homeowner"
        },
        "reviewBody": "Excellent pressure washing service. Professional, reliable, and great results."
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cleaning Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pressure Washing",
            "description": "Professional pressure washing for driveways, sidewalks, and exterior surfaces"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Window Cleaning",
            "description": "Interior and exterior window cleaning for residential and commercial properties"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Solar Panel Cleaning",
            "description": "Professional solar panel cleaning to maximize energy efficiency"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Gutter Cleaning", 
            "description": "Complete gutter cleaning and maintenance service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Roof Cleaning",
            "description": "Safe soft washing roof cleaning to remove algae and stains"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Exterior Cleaning",
            "description": "Complete exterior building and siding cleaning services"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/elev8solutions",
      "https://www.instagram.com/elev8solutions",
      "https://www.linkedin.com/company/elev8solutions"
    ]
  };

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Enhanced meta tags for better SEO
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    updateMetaTag('author', 'Elev8 Solutions');
    updateMetaTag('copyright', 'Elev8 Solutions');
    updateMetaTag('language', 'EN');
    updateMetaTag('geo.region', 'US-TX');
    updateMetaTag('geo.placename', 'Austin, Texas');
    updateMetaTag('geo.position', '30.2672;-97.7431');
    updateMetaTag('ICBM', '30.2672, -97.7431');

    // Business specific meta tags
    if (service) {
      updateMetaTag('service-type', service);
      updateMetaTag('service-area', 'Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Lakeway, Westlake, Leander');
    }

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'Elev8 Solutions', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:site', '@elev8solutions');

    // Enhanced JSON-LD structured data
    const combinedJsonLd = jsonLd ? [localBusinessData, jsonLd] : [localBusinessData];
    
    let script = document.querySelector('script[type="application/ld+json"][data-seo]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(combinedJsonLd);

    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-G84RB91LH1', {
        page_path: window.location.pathname,
        page_title: fullTitle,
      });
    }

  }, [fullTitle, description, keywords, fullUrl, ogImage, ogType, jsonLd, noindex, service, localBusinessData]);

  return null; // This component doesn't render anything
};

export default SEO; 