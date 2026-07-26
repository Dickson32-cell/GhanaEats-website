/**
 * Diagonal Accent Shape Component
 * Creates soft, diagonal accent shapes like in the video design
 */

const DiagonalAccent = ({
  className = '',
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  color = 'bg-peach-300',
  size = 'large', // 'small', 'medium', 'large'
  opacity = 'opacity-40'
}) => {
  const positions = {
    'top-right': 'top-0 right-0 -rotate-12',
    'top-left': 'top-0 left-0 rotate-12',
    'bottom-right': 'bottom-0 right-0 rotate-12',
    'bottom-left': 'bottom-0 left-0 -rotate-12',
  };

  const sizes = {
    small: 'w-48 h-48',
    medium: 'w-72 h-72',
    large: 'w-96 h-96',
  };

  return (
    <div
      className={`absolute ${positions[position]} ${sizes[size]} ${color} ${opacity} rounded-3xl transform ${className}`}
      style={{
        filter: 'blur(60px)',
      }}
    />
  );
};

export default DiagonalAccent;
