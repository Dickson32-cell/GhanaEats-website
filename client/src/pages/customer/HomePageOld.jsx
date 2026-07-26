import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as menuApi from '../../api/menuApi';
import * as favApi from '../../api/favoritesApi';
import { useAuth } from '../../context/AuthContext';
import MenuCard from '../../components/menu/MenuCard';
import Spinner from '../../components/ui/Spinner';
import FloatingElement from '../../components/ui/FloatingElement';
import OrganicBlob from '../../components/ui/OrganicBlob';

const FEATURE_BADGES = [
  { icon: '⚡', text: '30 min delivery' },
  { icon: '⭐', text: '4.8 rated' },
  { icon: '🔒', text: 'Secure checkout' },
];

const STATS = [
  { value: '10k+', label: 'Happy Customers' },
  { value: '50+', label: 'Menu Items' },
  { value: '4.8', label: 'Average Rating' },
];

const WHY_US = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Average delivery in under 30 minutes, guaranteed. We prioritise speed without compromising quality.',
    color: 'bg-amber-50 text-amber-500',
    colorHover: 'group-hover:bg-amber-100',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Fresh Ingredients',
    desc: 'Every dish is crafted daily with hand-picked, high-quality ingredients. No preservatives, just real food.',
    color: 'bg-emerald-50 text-emerald-500',
    colorHover: 'group-hover:bg-emerald-100',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Easy Payment',
    desc: 'Secure checkout in seconds — multiple payment methods, zero friction, fully encrypted transactions.',
    color: 'bg-blue-50 text-blue-500',
    colorHover: 'group-hover:bg-blue-100',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    avatar: 'S',
    color: 'bg-pink-100 text-pink-600',
    text: 'The fastest food delivery I\'ve ever experienced! The burger was still sizzling when it arrived. Absolutely incredible.',
    rating: 5,
  },
  {
    name: 'James K.',
    avatar: 'J',
    color: 'bg-violet-100 text-violet-600',
    text: 'Best food app in town. Great variety, amazing portions, and the checkout process is seamless every time.',
    rating: 5,
  },
  {
    name: 'Priya R.',
    avatar: 'P',
    color: 'bg-brand-100 text-brand-600',
    text: 'I order at least 3 times a week. The quality is consistent, and the favorites feature is so handy.',
    rating: 5,
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(null);

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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const handleFavoriteToggle = (id, isFav) =>
    setFavoriteIds((prev) => isFav ? [...prev, id] : prev.filter((x) => x !== id));

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════
          HERO SECTION WITH ORGANIC SHAPES & FLOATING ELEMENTS
      ══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-dark to-dark min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80')" }}
        />
        {/* Organic blob shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px]">
          <OrganicBlob
            color="bg-gradient-to-br from-brand-500/20 to-brand-600/10"
            size="large"
            animate={true}
            className="w-full h-full"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px]">
          <OrganicBlob
            color="bg-gradient-to-br from-purple-500/15 to-indigo-600/10"
            size="large"
            animate={true}
            className="w-full h-full"
          />
        </div>

        {/* Floating food elements (parallax) */}
        <FloatingElement speed={0.2} className="absolute top-[15%] right-[10%] hidden lg:block z-20" animationType="gentle">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-2xl border-4 border-white/20">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80" alt="Pizza" className="w-full h-full object-cover" />
          </div>
        </FloatingElement>

        <FloatingElement speed={0.4} className="absolute top-[45%] right-[8%] hidden lg:block z-20" animationType="drift">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-2xl border-4 border-white/20">
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80" alt="Salad" className="w-full h-full object-cover" />
          </div>
        </FloatingElement>

        <FloatingElement speed={0.3} className="absolute top-[65%] right-[15%] hidden lg:block z-20" animationType="float">
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-2xl border-4 border-white/20">
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" alt="Burger" className="w-full h-full object-cover" />
          </div>
        </FloatingElement>

        <FloatingElement speed={0.25} className="absolute top-[25%] right-[25%] hidden xl:block z-20" animationType="gentle">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-2xl border-4 border-white/20">
            <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80" alt="Pasta" className="w-full h-full object-cover" />
          </div>
        </FloatingElement>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 backdrop-blur-md border border-white/10 px-4 py-2 mb-8 reveal">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-sm font-semibold text-white/90 tracking-wide">Now delivering to your area</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.0] tracking-tight mb-8 reveal delay-100">
              Delicious
              <br />
              <span className="relative inline-block">
                <span className="text-brand-400">food,</span>
                {/* Underline accent */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9C50 4 150 2 298 9" stroke="#ff5a1f" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" />
                </svg>
              </span>
              <br />
              delivered fast.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/50 mb-10 leading-relaxed max-w-lg reveal delay-200">
              Hand-crafted meals, fresh ingredients, delivered to your door in minutes. Your next favourite dish is just a tap away.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-12 reveal delay-300">
              {FEATURE_BADGES.map((b) => (
                <span key={b.text} className="inline-flex items-center gap-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 px-4 py-2 text-sm text-white/80 font-medium">
                  <span>{b.icon}</span> {b.text}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 reveal delay-400">
              <Link
                to="/menu"
                className="group inline-flex items-center gap-3 rounded-2xl bg-brand-500 hover:bg-brand-400 px-9 py-4.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(255,90,31,0.4)] hover:shadow-[0_12px_40px_rgba(255,90,31,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              >
                Order Now
                <svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {!user && (
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 hover:border-white/50 hover:bg-white/5 px-7 py-4.5 text-base font-semibold text-white/80 hover:text-white transition-all duration-300"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign up free
                </Link>
              )}
            </div>
          </div>

          {/* Floating food card decoration */}
          <div className="hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2">
            <div className="relative animate-float">
              <div className="w-72 h-80 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80"
                  alt="Pizza"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating mini card */}
              <div className="absolute -bottom-6 -left-10 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">✓</div>
                <div>
                  <p className="text-xs font-semibold text-dark/50">Order delivered</p>
                  <p className="text-sm font-bold text-dark">22 mins ago</p>
                </div>
              </div>
              {/* Rating floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-3 py-2.5 flex items-center gap-2">
                <span className="text-brand-500 text-sm">⭐</span>
                <span className="text-sm font-bold text-dark">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25">
          <span className="text-[11px] font-semibold uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <div className="bg-dark border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center py-6 px-4 reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</span>
                <span className="text-xs sm:text-sm text-white/40 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CATEGORIES STRIP
      ══════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5 py-6 overflow-x-auto scrollbar-hide">
              <span className="flex-shrink-0 text-xs font-bold text-dark/30 uppercase tracking-widest mr-2">Browse by</span>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/menu?category=${cat.slug}`}
                  className="flex-shrink-0 flex flex-col items-center gap-2.5 group"
                >
                  <div className="h-18 w-18 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-brand-400 transition-all duration-300 shadow-card group-hover:shadow-[0_6px_20px_rgba(15,15,20,0.12)] group-hover:-translate-y-1">
                    <div className="h-[72px] w-[72px]">
                      <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-dark/60 group-hover:text-brand-500 transition-colors whitespace-nowrap">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          FEATURED ITEMS WITH STAGGER ANIMATION
      ══════════════════════════════════════ */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        {/* Floating decorative element */}
        <FloatingElement speed={0.15} className="absolute -top-10 right-10 opacity-50 hidden xl:block" animationType="gentle">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400/20 to-orange-300/10 blur-2xl" />
        </FloatingElement>

        <div className="flex items-end justify-between mb-14 reveal">
          <div>
            <p className="text-sm font-bold text-brand-500 mb-3 uppercase tracking-widest">Handpicked for you</p>
            <h2 className="font-display text-5xl font-bold text-dark">Featured Dishes</h2>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition-all duration-300 group hover:gap-3"
          >
            View full menu
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 reveal">
            <div className="text-6xl mb-5">🍽️</div>
            <p className="font-display text-2xl font-semibold text-dark/40 mb-3">Menu coming soon</p>
            <p className="text-base text-dark/30">Check back shortly — we're preparing something special.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`reveal-scale delay-${Math.min(i * 100, 600)}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <MenuCard item={item} favoriteIds={favoriteIds} onFavoriteToggle={handleFavoriteToggle} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden reveal">
          <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition-all duration-300">
            View full menu →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY US - ASYMMETRIC LAYOUT WITH ORGANIC SHAPES
      ══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50/30 to-cream-50 py-32 overflow-hidden">
        {/* Organic background shapes */}
        <div className="absolute top-10 left-10 opacity-40">
          <OrganicBlob
            color="bg-gradient-to-br from-brand-400/20 to-orange-300/10"
            size="medium"
            animate={true}
          />
        </div>
        <div className="absolute bottom-20 right-20 opacity-30">
          <OrganicBlob
            color="bg-gradient-to-br from-purple-400/15 to-indigo-300/10"
            size="large"
            animate={true}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 reveal">
            <p className="text-sm font-bold text-brand-500 mb-3 uppercase tracking-widest">Why FoodApp?</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-dark mb-4">Built for food lovers</h2>
            <p className="text-dark/50 max-w-md mx-auto text-base">We obsess over every detail so you can just enjoy your meal.</p>
          </div>

          {/* Asymmetric grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {WHY_US.map((f, i) => (
              <div
                key={f.title}
                className={`group rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100/50 p-10 hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] reveal ${
                  i === 1 ? 'lg:mt-12' : i === 2 ? 'lg:mt-6' : ''
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6 transition-all duration-300 ${f.color} ${f.colorHover} shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-dark mb-4">{f.title}</h3>
                <p className="text-base text-dark/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14 reveal">
          <p className="text-sm font-bold text-brand-500 mb-3 uppercase tracking-widest">Reviews</p>
          <h2 className="font-display text-4xl font-bold text-dark">What people say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="rounded-3xl bg-white border border-gray-100 p-7 shadow-card hover:shadow-card-hover transition-all duration-300 reveal" style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-dark/70 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                  {t.avatar}
                </div>
                <span className="text-sm font-semibold text-dark">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-[2rem] overflow-hidden bg-dark px-8 sm:px-14 py-16 text-center reveal">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent" />
          <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute left-0 top-0 w-48 h-48 rounded-full bg-brand-400/8 blur-3xl" />

          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Hungry? Start your order.
            </h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto text-base">Join thousands of happy food lovers. Sign up in seconds and get your first meal delivered.</p>
            <Link
              to={user ? '/menu' : '/signup'}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 px-10 py-4.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(255,90,31,0.4)] hover:shadow-[0_12px_40px_rgba(255,90,31,0.5)] transition-all duration-300 hover:-translate-y-1"
            >
              {user ? 'Browse Menu' : 'Get Started — It\'s Free'}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
