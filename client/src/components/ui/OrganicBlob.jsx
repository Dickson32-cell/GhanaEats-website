/**
 * Organic Blob Shape Component
 * Creates flowing, organic shapes similar to the smoothie design
 */

const OrganicBlob = ({
  className = '',
  color = 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20',
  animate = false,
  size = 'large' // small, medium, large
}) => {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-64 h-64',
    large: 'w-96 h-96',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color} blur-3xl opacity-60 ${animate ? 'animate-morph' : ''} ${className}`}
      style={{
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
      }}
    />
  );
};

export default OrganicBlob;
