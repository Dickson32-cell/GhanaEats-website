import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as menuApi from '../../api/menuApi';
import * as favApi from '../../api/favoritesApi';
import { useAuth } from '../../context/AuthContext';
import MenuCard from '../../components/menu/MenuCard';
import Spinner from '../../components/ui/Spinner';
import DiagonalAccent from '../../components/ui/DiagonalAccent';

const HomePage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    Promise.all([
      menuApi.getCategories(),
      menuApi.getItems({ limit: 8 }),
      user ? favApi.getFavorites() : Promise.resolve({ data: { data: [] } }),
    ]).then(([cats, its, favs]) => {
      setCategories(cats.data.data);
      setItems(its.data.data.items);
      setFavoriteIds(favs.data.data.map((f) => f.menuItemId));
    }).finally(() => setLoading(false));
  }, [user]);

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
  const averageRating = 4.6; // Mock rating

  return (
    <div className="bg-bg-light min-h-screen">

      {/* ══════════════════════════════════════
          HERO SECTION - ELEGANT FOOD DISPLAY
      ══════════════════════════════════════ */}
      <section className="relative min-h-[90vh] bg-white overflow-hidden">
        {/* Diagonal Peach Accent */}
        <DiagonalAccent position="top-right" color="bg-peach-300" size="large" opacity="opacity-50" />
        <DiagonalAccent position="bottom-left" color="bg-peach-200" size="medium" opacity="opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Top Navigation Hint */}
          <div className="flex items-center justify-between mb-8 reveal">
            <div>
              <p className="text-sm text-gray-400 mb-1">WELCOME TO</p>
              <h1 className="text-2xl font-bold text-dark">FoodApp</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {user && (
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
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
            <>
              {/* Main Food Display */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-12">
                {/* Left Side - Food Image */}
                <div className="relative reveal delay-100">
                  {/* Main Food Image */}
                  <div className="relative w-[500px] h-[500px] flex items-center justify-center">
                    <img
                      src={selectedItem?.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'}
                      alt={selectedItem?.name || 'Food'}
                      className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500"
                    />
                  </div>

                  {/* Floating Labels */}
                  <div className="absolute -top-4 left-8 bg-white px-4 py-2 rounded-full shadow-soft text-xs font-medium text-gray-600">
                    🔥 Popular
                  </div>
                  <div className="absolute bottom-8 left-4 bg-white px-4 py-2 rounded-full shadow-soft text-xs font-medium text-gray-600">
                    ✓ Best Seller
                  </div>
                </div>

                {/* Right Side - Food Info */}
                <div className="max-w-md reveal delay-200">
                  <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Featured Dish</p>
                  <h2 className="text-5xl font-bold text-dark mb-4 uppercase leading-tight">
                    {selectedItem?.name?.split(' ')[0] || 'DELICIOUS'}<br />
                    <span className="text-peach-500">{selectedItem?.name?.split(' ').slice(1).join(' ') || 'FOOD'}</span>
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {selectedItem?.description || 'Fresh ingredients, expertly prepared. A taste sensation you won\'t forget.'}
                  </p>

                  {/* Rating Badge - Floating */}
                  <div className="absolute top-0 right-0 lg:relative lg:inline-flex items-center gap-3 mb-6">
                    <div className="w-20 h-20 rounded-full bg-accent-pink flex flex-col items-center justify-center text-white shadow-soft">
                      <div className="text-3xl font-black">{averageRating}</div>
                      <div className="text-[10px] uppercase">Rating</div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-4xl font-bold text-dark">${selectedItem?.price || '12.99'}</div>
                    <Link
                      to="/menu"
                      className="px-8 py-4 bg-dark text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-soft hover:shadow-card"
                    >
                      Order Now →
                    </Link>
                  </div>

                  {/* Quick Info Icons */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>30 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      <span>Fresh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular Thumbnail Carousel */}
              <div className="relative reveal delay-300">
                <div
                  ref={carouselRef}
                  className="flex items-center justify-center gap-6 overflow-x-auto pb-6 scrollbar-hide"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemIndex(index)}
                      className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-300 ${
                        selectedItemIndex === index ? 'scale-110' : 'scale-100 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-20 h-20 rounded-full overflow-hidden bg-white shadow-soft border-4 ${
                        selectedItemIndex === index ? 'border-peach-400' : 'border-transparent'
                      }`}>
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 text-center max-w-[80px] truncate">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setSelectedItemIndex(i => Math.max(0, i - 1))}
                  disabled={selectedItemIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedItemIndex(i => Math.min(items.length - 1, i + 1))}
                  disabled={selectedItemIndex === items.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Bottom Icon Navigation */}
              <div className="flex items-center justify-center gap-12 pt-8 border-t border-gray-200 reveal delay-400">
                <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-dark transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-xs font-medium">Filter</span>
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-dark transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs font-medium">Favorites</span>
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-dark transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-xs font-medium">Voice</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          POPULAR MENU SECTION
      ══════════════════════════════════════ */}
      <section className="py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Discover</p>
            <h2 className="text-4xl font-bold text-dark">Popular Menu</h2>
          </div>

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.slice(0, 4).map((item, i) => (
                <div key={item.id} className="reveal-scale" style={{ transitionDelay: `${i * 100}ms` }}>
                  <MenuCard item={item} favoriteIds={favoriteIds} onFavoriteToggle={handleFavoriteToggle} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10 reveal">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark rounded-full font-semibold hover:shadow-card transition-all shadow-soft"
            >
              View Full Menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
