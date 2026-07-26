import { useParallax } from '../../hooks/useScrollAnimation';

/**
 * Floating Element Component for parallax effects
 * Similar to the floating berries in the smoothie design
 */

const FloatingElement = ({
  children,
  speed = 0.3,
  className = '',
  animationType = 'gentle' // 'gentle', 'drift', 'float'
}) => {
  const parallaxRef = useParallax(speed);

  const animations = {
    gentle: 'animate-float-gentle',
    drift: 'animate-float-drift',
    float: 'animate-float',
  };

  return (
    <div
      ref={parallaxRef}
      className={`${animations[animationType]} ${className}`}
    >
      {children}
    </div>
  );
};

export default FloatingElement;
