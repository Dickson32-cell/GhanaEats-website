import { useState, useEffect } from 'react';

const SocialProofPopup = () => {
  const [visible, setVisible] = useState(false);
  const [currentProof, setCurrentProof] = useState(null);

  const proofMessages = [
    { name: 'Kwame from Accra', action: 'ordered Jollof Rice', emoji: '🔥', city: 'Accra' },
    { name: 'Ama from Kumasi', action: 'just ordered Waakye', emoji: '⭐', city: 'Kumasi' },
    { name: 'Kofi from Tema', action: 'ordered Fufu & Light Soup', emoji: '😋', city: 'Tema' },
    { name: 'Efua from Takoradi', action: 'just ordered Banku & Okro', emoji: '🍲', city: 'Takoradi' },
    { name: 'Yaw from Accra', action: 'ordered Grilled Tilapia', emoji: '🐟', city: 'Accra' },
  ];

  useEffect(() => {
    const showProof = () => {
      const randomProof = proofMessages[Math.floor(Math.random() * proofMessages.length)];
      setCurrentProof(randomProof);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    // Show first proof after 5 seconds
    const initialTimeout = setTimeout(showProof, 5000);

    // Show random proofs every 15-25 seconds
    const interval = setInterval(() => {
      const randomDelay = 15000 + Math.random() * 10000;
      setTimeout(showProof, randomDelay);
    }, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible || !currentProof) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slideInLeft">
      <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-sm border-2 border-gray-100 dark:border-white/10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-peach-400 to-pink-400 flex items-center justify-center text-2xl flex-shrink-0">
          {currentProof.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-dark dark:text-white">
            {currentProof.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentProof.action}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Just now • {currentProof.city}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SocialProofPopup;
