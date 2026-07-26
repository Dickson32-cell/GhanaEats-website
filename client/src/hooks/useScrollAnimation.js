import { useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {string} animationType - Type of animation: 'fade', 'slideUp', 'slideLeft', 'slideRight', 'scale'
 * @param {number} threshold - Percentage of element visible before triggering (0-1)
 * @param {number} delay - Delay in milliseconds before animation starts
 */
export const useScrollAnimation = (animationType = 'fade', threshold = 0.15, delay = 0) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.add('animate-in');
            }, delay);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    element.classList.add(`scroll-${animationType}`);
    observer.observe(element);

    return () => observer.disconnect();
  }, [animationType, threshold, delay]);

  return elementRef;
};

/**
 * Parallax scroll effect hook
 * @param {number} speed - Speed multiplier for parallax (default: 0.5)
 */
export const useParallax = (speed = 0.5) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Only apply parallax when element is in viewport
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = (scrolled - elementTop) * speed;
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return elementRef;
};

export default useScrollAnimation;
