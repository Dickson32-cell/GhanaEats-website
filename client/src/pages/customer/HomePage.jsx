import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as menuApi from '../../api/menuApi';
import * as favApi from '../../api/favoritesApi';
import * as featuredApi from '../../api/featuredApi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import MenuCard from '../../components/menu/MenuCard';
import Spinner from '../../components/ui/Spinner';
import PromoScrollBanner from '../../components/home/PromoScrollBanner';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const HomePage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const carouselRef = useRef(null);
  const slideIntervalRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    Promise.all([
      menuApi.getCategories(),
      featuredApi.getFeaturedItems(),
      user ? favApi.getFavorites().catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
    ]).then(([cats, featured, favs]) => {
      setCategories(cats.data.data || []);
      // Extract menu items from featured items
      const featuredMenuItems = (featured.data || []).map(item => item.menuItem).filter(Boolean);
      // Fallback: if no featured items, fetch regular menu items
      if (featuredMenuItems.length > 0) {
        setItems(featuredMenuItems);
      } else {
        import('../../api/menuApi').then(({ default: api }) => {
          api.get('/items?limit=12').then(res => {
            setItems(res.data.data.items || []);
          }).catch(() => setItems([]));
        });
      }
      setFavoriteIds((favs.data.data || []).map((f) => f.menuItemId));
    }).catch((err) => {
      console.error('Homepage data fetch error:', err);
      setItems([]);
    }).finally(() => setLoading(false));
  }, [user]);

  // Auto-rotating slideshow
  useEffect(() => {
    if (items.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setSelectedItemIndex((prev) => (prev + 1) % items.length);
      }, 5000); // Rotate every 5 seconds

      return () => {
        if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
      };
    }
  }, [items.length]);

  // Pause slideshow on hover
  const handleMouseEnter = () => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
  };

  const handleMouseLeave = () => {
    if (items.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setSelectedItemIndex((prev) => (prev + 1) % items.length);
      }, 5000);
    }
  };

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const handleFavoriteToggle = (id, isFav) =>
    setFavoriteIds((prev) => isFav ? [...prev, id] : prev.filter((x) => x !== id));

  const selectedItem = items[selectedItemIndex] || null;

  // Handle Order Now - Add to Cart
  const handleOrderNow = async () => {
    if (!user) {
      toast.error('Please sign in to order');
      navigate('/login');
      return;
    }
    if (!selectedItem) return;

    try {
      await addToCart(selectedItem.id);
      toast.success(`${selectedItem.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  // Handle Search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle Filter
  const handleFilter = (category) => {
    setSelectedFilter(category);
    if (category === 'all') {
      navigate('/menu');
    } else {
      navigate(`/menu?category=${category}`);
    }
  };

  // Handle Favorites
  const handleFavorites = () => {
    if (!user) {
      toast.error('Please sign in to view favorites');
      navigate('/login');
    } else {
      navigate('/favorites');
    }
  };

  // Handle Voice Search
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search not supported in your browser');
      return;
    }

    if (voiceListening) {
      recognitionRef.current?.stop();
      setVoiceListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setVoiceListening(true);
      toast('🎤 Listening... Speak now!', { duration: 3000 });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      navigate(`/menu?search=${encodeURIComponent(transcript)}`);
      toast.success(`Searching for: ${transcript}`);
    };

    recognition.onerror = (event) => {
      setVoiceListening(false);
      console.error('Speech recognition error:', event.error);

      // Provide specific error messages
      switch (event.error) {
        case 'no-speech':
          toast.error('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          toast.error('Microphone not found. Please check your device.');
          break;
        case 'not-allowed':
          toast.error('Microphone permission denied. Please allow access in your browser settings.');
          break;
        case 'network':
          toast.error('Network error. Please check your connection.');
          break;
        case 'aborted':
          // User stopped listening - no error needed
          break;
        default:
          toast.error('Voice search error. Please try again.');
      }
    };

    recognition.onend = () => {
      setVoiceListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setVoiceListening(false);
      toast.error('Failed to start voice search. Please try again.');
    }
  };

  // Handle Filter Modal
  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden section-stitched" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20" onClick={() => setSearchOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for dishes..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-peach-300"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-dark text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Popular:</span>
              {['Pizza', 'Burger', 'Pasta', 'Salad'].map(term => (
                <button
                  key={term}
                  onClick={() => { setSearchQuery(term); handleSearch(); }}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setFilterOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Filter by Category</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  handleFilter('all');
                  setFilterOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left font-semibold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    handleFilter(category.slug);
                    setFilterOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-left font-semibold transition-all ${
                    selectedFilter === category.slug
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-peach-300/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-peach-400/30 to-orange-300/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}></div>
      </div>

      {/* ══════════════════════════════════════
          HERO SECTION - AUTO-ROTATING SLIDESHOW
      ══════════════════════════════════════ */}
      <section className="relative min-h-[88vh] overflow-hidden">
        {/* Enhanced Background Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-peach-200/40 to-pink-200/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/30 to-peach-200/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 border-4 border-peach-300/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 border-4 border-pink-300/30 rounded-lg rotate-12 animate-bounce-slow"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          {/* Promo Scroll Banner */}
          <div className="mb-6">
            <PromoScrollBanner />
          </div>

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 reveal">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Welcome</p>
              <h1 className="text-xl font-bold text-dark">FoodApp</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {user && (
                <button
                  onClick={() => navigate('/orders')}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner size="lg" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-xl font-semibold text-gray-400">Menu coming soon</p>
            </div>
          ) : (
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {/* Main Food Display */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
                {/* Left - Food Image */}
                <div className="relative flex-1 reveal delay-100">
                  <div className="relative w-full max-w-[450px] h-[450px] mx-auto flex items-center justify-center">
                    <img
                      key={selectedItemIndex}
                      src={selectedItem?.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'}
                      alt={selectedItem?.name || 'Food'}
                      className="w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ease-in-out"
                      style={{ animation: 'fadeIn 0.7s ease-in-out' }}
                    />
                  </div>
                </div>

                {/* Right - Food Info */}
                <div className="flex-1 max-w-lg reveal delay-200">
                  <p className="text-sm text-gray-400 uppercase tracking-widest mb-3">Today's Special</p>
                  <h2 className="text-4xl sm:text-5xl font-bold text-dark mb-3 leading-tight">
                    {selectedItem?.name?.toUpperCase() || 'DELICIOUS FOOD'}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {selectedItem?.description || 'Fresh ingredients, expertly prepared.'}
                  </p>

                  {/* Rating Badge */}
                  <div className="inline-flex items-center gap-2 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#ff6b9d] flex flex-col items-center justify-center text-white shadow-lg corner-stitches">
                      <div className="text-2xl font-black">4.6</div>
                      <div className="text-[9px] uppercase">Rating</div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl font-bold text-dark">{formatPrice(selectedItem?.price || 12.99)}</div>
                    <button
                      onClick={handleOrderNow}
                      className="px-8 py-3 bg-dark text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg btn-stitched"
                    >
                      Order Now
                    </button>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>30 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fresh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular Thumbnail Carousel */}
              <div className="relative reveal delay-300 mb-8">
                <div
                  ref={carouselRef}
                  className="flex items-center justify-center gap-4 overflow-x-auto pb-4 scrollbar-hide px-12"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemIndex(index)}
                      className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-300 ${
                        selectedItemIndex === index ? 'scale-110' : 'scale-95 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-[70px] h-[70px] rounded-full overflow-hidden bg-white shadow-lg border-3 ${
                        selectedItemIndex === index ? 'border-[#FFB4A2]' : 'border-white'
                      }`}>
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 text-center max-w-[70px] truncate">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {items.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedItemIndex(i => (i - 1 + items.length) % items.length)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedItemIndex(i => (i + 1) % items.length)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Icon Navigation */}
              <div className="flex items-center justify-center gap-10 pt-6 border-t border-gray-200 reveal delay-400">
                <button
                  onClick={handleFilterClick}
                  className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-dark transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-xs font-medium">Filter</span>
                </button>
                <button
                  onClick={handleFavorites}
                  className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-dark transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs font-medium">Favorites</span>
                </button>
                <button
                  onClick={handleVoiceSearch}
                  className={`flex flex-col items-center gap-1.5 transition-colors ${
                    voiceListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-dark'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-xs font-medium">Voice</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Popular Menu Section */}
      <section className="py-16 bg-gradient-to-br from-white/60 via-orange-50/40 to-pink-50/40 backdrop-blur-sm stitched-frame">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 reveal">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Discover</p>
            <h2 className="text-3xl font-bold text-dark">Popular Menu</h2>
          </div>
          <div className="stitched-divider"></div>

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.slice(0, 4).map((item, i) => (
                <div key={item.id} className="reveal-scale" style={{ transitionDelay: `${i * 80}ms` }}>
                  <MenuCard item={item} favoriteIds={favoriteIds} onFavoriteToggle={handleFavoriteToggle} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 reveal">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3 bg-dark text-white rounded-full font-semibold hover:shadow-lg transition-all shadow-md btn-stitched"
            >
              View Full Menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
