import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure page content is loaded
    const timer = setTimeout(() => {
      // Scroll to top when pathname changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Smooth scroll animation
      });
    }, 100); // 100ms delay to ensure smooth transition

    // Cleanup timer on unmount or pathname change
    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
