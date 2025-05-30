import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Utility function for smooth scroll to top
export const scrollToTop = (behavior: 'smooth' | 'auto' = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior
  });
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    scrollToTop('auto');
  }, [pathname]);

  return null;
};

export default ScrollToTop; 