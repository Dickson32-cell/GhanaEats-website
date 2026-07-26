import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as menuApi from '../../api/menuApi';
import * as favApi from '../../api/favoritesApi';
import { useAuth } from '../../context/AuthContext';
import MenuCard from '../../components/menu/MenuCard';
import Spinner from '../../components/ui/Spinner';

const HomePage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      menuApi.getCategories(),
      menuApi.getItems({ limit: 6 }),
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const handleFavoriteToggle = (id, isFav) =>
    setFavoriteIds((prev) => isFav ? [...prev, id] : prev.filter((x) => x !== id));

  return (
    <div className="bg-cream overflow-hidden">

      {/* ══════════════════════════════════════
          HERO - NEO-BRUTALIST ASYMMETRIC
      ══════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center bg-accent-yellow overflow-hidden">
        {/* Geometric shapes background */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-accent-pink rotate-12 opacity-60" />
        <div className="absolute bottom-20 left-10 w-80 h-40 bg-accent-cyan -rotate-6 opacity-50" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-brand-500 rounded-full opacity-40" />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Asymmetric Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Left Content - Takes 7 columns */}
              <div className="lg:col-span-7">
                {/* Badge Sticker */}
                <div className="inline-block mb-6 reveal">
                  <div className="bg-black text-white px-5 py-2 border-4 border-black rotate-[-2deg] shadow-brutal-sm">
                    <span className="text-sm font-bold uppercase tracking-wider">⚡ 30min Delivery</span>
                  </div>
                </div>

                {/* Giant Bold Typography */}
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black leading-none mb-6 reveal delay-100">
                  <span className="block text-black">EAT</span>
                  <span className="block text-brand-500 -mt-4">GOOD</span>
                  <span className="block text-black -mt-4">FOOD</span>
                </h1>

                <p className="text-xl sm:text-2xl text-black font-medium mb-8 max-w-md reveal delay-200">
                  Order from local restaurants. Fresh ingredients. Fast delivery. No BS.
                </p>

                {/* CTA Buttons - Stacked Asymmetric */}
                <div className="flex flex-col sm:flex-row gap-4 reveal delay-300">
                  <Link
                    to="/menu"
                    className="inline-block bg-brand-500 text-white px-10 py-5 text-xl font-black uppercase border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    Order Now →
                  </Link>
                  {!user && (
                    <Link
                      to="/signup"
                      className="inline-block bg-white text-black px-10 py-5 text-xl font-black uppercase border-4 border-black shadow-brutal-sm hover:bg-accent-lime transition-colors"
                    >
                      Sign Up Free
                    </Link>
                  )}
                </div>

                {/* Stats - Quirky Layout */}
                <div className="flex flex-wrap gap-6 mt-12 reveal delay-400">
                  <div className="bg-white border-4 border-black px-6 py-4 shadow-brutal-sm rotate-[-1deg]">
                    <div className="text-3xl font-black text-brand-500">10k+</div>
                    <div className="text-sm font-bold uppercase">Orders</div>
                  </div>
                  <div className="bg-accent-cyan border-4 border-black px-6 py-4 shadow-brutal-sm rotate-[2deg]">
                    <div className="text-3xl font-black text-black">4.8★</div>
                    <div className="text-sm font-bold uppercase">Rating</div>
                  </div>
                  <div className="bg-accent-pink border-4 border-black px-6 py-4 shadow-brutal-sm rotate-[-2deg]">
                    <div className="text-3xl font-black text-white">50+</div>
                    <div className="text-sm font-bold uppercase">Dishes</div>
                  </div>
                </div>
              </div>

              {/* Right Image - Takes 5 columns */}
              <div className="lg:col-span-5 relative reveal delay-200">
                <div className="relative">
                  {/* Main Image with Brutal Border */}
                  <div className="border-8 border-black shadow-brutal-lg rotate-[3deg] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80"
                      alt="Delicious Pizza"
                      className="w-full h-[400px] object-cover"
                    />
                  </div>

                  {/* Floating Sticker */}
                  <div className="absolute -bottom-6 -left-6 bg-accent-lime border-4 border-black px-6 py-4 shadow-brutal rotate-[-8deg]">
                    <div className="text-2xl font-black">FRESH!</div>
                  </div>

                  {/* Floating Review Card */}
                  <div className="absolute -top-4 -right-4 bg-white border-4 border-black p-4 shadow-brutal-sm rotate-[5deg] max-w-[140px]">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="text-xs font-bold">"Best food ever!"</p>
                    <p className="text-xs text-gray-600">- Sarah M.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED MENU - BROKEN GRID
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white relative">
        {/* Geometric accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-purple opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Asymmetric */}
          <div className="mb-12 reveal">
            <div className="inline-block bg-black text-accent-yellow px-6 py-2 border-4 border-black rotate-[-1deg] mb-4">
              <span className="text-sm font-black uppercase tracking-widest">Featured Dishes</span>
            </div>
            <h2 className="text-6xl sm:text-7xl font-black text-black leading-none">
              POPULAR<br/>
              RIGHT NOW
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 border-4 border-black bg-accent-yellow">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-2xl font-black">MENU COMING SOON</p>
            </div>
          ) : (
            /* Broken Grid - Asymmetric Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`reveal-scale ${
                    i % 3 === 1 ? 'lg:mt-12' : i % 3 === 2 ? 'lg:mt-6' : ''
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <MenuCard item={item} favoriteIds={favoriteIds} onFavoriteToggle={handleFavoriteToggle} />
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12 reveal">
            <Link
              to="/menu"
              className="inline-block bg-brand-500 text-white px-12 py-5 text-2xl font-black uppercase border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              See Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS - BOLD BLOCKS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent-cyan opacity-10 rotate-12" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-pink opacity-10 -rotate-12" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl sm:text-7xl font-black mb-16 text-center reveal">
            HOW IT<br/>
            <span className="text-accent-yellow">WORKS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Choose', desc: 'Pick your favorite dishes from local restaurants', color: 'bg-accent-pink' },
              { num: '02', title: 'Order', desc: 'Secure checkout in seconds. Multiple payment options', color: 'bg-accent-cyan' },
              { num: '03', title: 'Enjoy', desc: 'Fresh food delivered to your door in 30 minutes', color: 'bg-accent-lime' },
            ].map((step, i) => (
              <div key={step.num} className="reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="bg-white text-black p-8 border-4 border-white hover:-translate-y-2 transition-transform">
                  <div className={`text-8xl font-black ${step.color} bg-clip-text text-transparent mb-4`}>
                    {step.num}
                  </div>
                  <h3 className="text-3xl font-black mb-3 uppercase">{step.title}</h3>
                  <p className="text-lg font-medium text-gray-700">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION - BOLD & IMPACTFUL
      ══════════════════════════════════════ */}
      <section className="py-24 bg-brand-500 relative overflow-hidden">
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)',
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="reveal">
            <h2 className="text-6xl sm:text-8xl font-black text-white leading-none mb-6">
              HUNGRY?
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-10">
              Start ordering in seconds.
            </p>
            <Link
              to={user ? '/menu' : '/signup'}
              className="inline-block bg-black text-accent-yellow px-14 py-6 text-3xl font-black uppercase border-4 border-black shadow-brutal-lg hover:bg-accent-yellow hover:text-black transition-colors"
            >
              {user ? 'Order Now' : 'Get Started'} →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
