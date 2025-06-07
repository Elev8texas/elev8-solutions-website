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
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://elev8texas.com/logo512.png',
  ogType = 'website',
  jsonLd,
  noindex = false
}) => {
  const fullTitle = title.includes('Elev8') ? title : `${title} | Elev8 Solutions - Austin Pressure Washing & Cleaning`;
  const fullUrl = canonicalUrl || window.location.href;

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

    // Update meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'Elev8 Solutions', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // JSON-LD structured data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"][data-seo]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-G84RB91LH1', {
        page_path: window.location.pathname,
        page_title: fullTitle,
      });
    }

  }, [fullTitle, description, keywords, fullUrl, ogImage, ogType, jsonLd, noindex]);

  return null; // This component doesn't render anything
};

export default SEO; 