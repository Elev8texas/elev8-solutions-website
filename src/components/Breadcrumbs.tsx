import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const pathMap: { [key: string]: string } = {
    '/': 'Home',
    '/services': 'Services',
    '/about': 'About Us',
    '/contact': 'Contact',
    '/quote': 'Get Quote',
    '/commercial': 'Commercial Services',
    '/gallery': 'Gallery',
    '/help': 'Help & Support',
    '/privacy-policy': 'Privacy Policy',
    '/terms-of-service': 'Terms of Service'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    if (location.pathname === '/') {
      return [];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';
    pathnames.forEach((pathname) => {
      currentPath += `/${pathname}`;
      const label = pathMap[currentPath] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  // Generate JSON-LD structured data for breadcrumbs
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.label,
      "item": `https://elev8texas.com${breadcrumb.path}`
    }))
  };

  React.useEffect(() => {
    // Add breadcrumb JSON-LD to head
    let script = document.querySelector('script[data-breadcrumb-ld]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-breadcrumb-ld', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(breadcrumbJsonLd);

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[data-breadcrumb-ld]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [breadcrumbJsonLd]);

  return (
    <nav aria-label="Breadcrumb" className="bg-background-secondary py-3 border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <svg 
                  className="w-4 h-4 text-text-muted mx-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span 
                  className="text-gold-500 font-medium"
                  aria-current="page"
                >
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-text-secondary hover:text-gold-500 transition-colors duration-200"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs; 