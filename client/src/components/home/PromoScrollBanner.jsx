import { useState, useEffect } from 'react';
import * as promosApi from '../../api/promosApi';

const PromoScrollBanner = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    promosApi.getActivePromos()
      .then((r) => setPromos(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || promos.length === 0) return null;

  // Duplicate promos for seamless scrolling
  const displayPromos = [...promos, ...promos, ...promos];

  return (
    <div className="relative bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500 text-white overflow-hidden rounded-2xl shadow-lg">
      {/* Decorative border effect */}
      <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none"></div>

      {/* Scrolling content container */}
      <div className="relative flex items-center py-3">
        {/* Megaphone icon on left */}
        <div className="absolute left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>

        {/* Horizontal scrolling text */}
        <div className="w-full pl-16 pr-4 overflow-hidden">
          <div className="flex animate-scroll-horizontal">
            {displayPromos.map((promo, index) => (
              <div
                key={`${promo.id}-${index}`}
                className="flex-shrink-0 px-6 font-bold text-base whitespace-nowrap"
              >
                {promo.message}
                <span className="mx-4 text-white/40">|</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edge gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-600 via-brand-600/80 to-transparent pointer-events-none z-20"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-600 via-brand-600/80 to-transparent pointer-events-none z-20"></div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll-horizontal {
          animation: scroll-horizontal 40s linear infinite;
        }
        .animate-scroll-horizontal:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default PromoScrollBanner;
