import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useDarkMode } from '../../context/DarkModeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`relative text-sm font-semibold transition-colors group py-1 ${
        location.pathname === to ? 'text-brand-500' : 'text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white'
      }`}
    >
      {label}
      <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-brand-500 rounded-full transition-all duration-300 ${
        location.pathname === to ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </Link>
  );

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 dark:bg-dark/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,15,20,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] border-b border-white/50 dark:border-white/10'
        : 'bg-white/60 dark:bg-dark/80 backdrop-blur-md border-b border-gray-100/60 dark:border-white/5'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-[0_4px_14px_rgba(255,90,31,0.35)] group-hover:shadow-[0_6px_20px_rgba(255,90,31,0.45)] transition-shadow duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-dark dark:text-white tracking-tight">Ghana Eats</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLink('/', 'Home')}
            {navLink('/menu', 'Menu')}
            {user && navLink('/orders', 'My Orders')}
            {user && navLink('/favorites', 'Favorites')}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            {user && (
              <button
                onClick={toggleCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-100 hover:bg-brand-50 text-dark transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(255,90,31,0.4)] animate-bounce-subtle">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-100 dark:bg-dark-700 hover:bg-brand-50 dark:hover:bg-dark-600 text-dark dark:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-bold text-sm flex-shrink-0 ring-2 ring-brand-200 hover:ring-brand-400 transition-all cursor-pointer"
                  title="My Profile"
                >
                  {user.name?.[0]?.toUpperCase()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-dark/60 dark:text-white/60 hover:text-dark dark:hover:text-white transition-colors px-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-2xl bg-dark dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-dark hover:bg-dark-700 dark:hover:bg-gray-100 transition-all duration-200 shadow-[0_4px_14px_rgba(15,15,20,0.2)] hover:shadow-[0_6px_20px_rgba(15,15,20,0.3)] hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 dark:bg-dark-700 text-dark dark:text-white transition-colors"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-100 dark:border-white/10 py-4 space-y-1">
            {[['/', 'Home'], ['/menu', 'Menu'], ...(user ? [['/orders', 'My Orders'], ['/favorites', 'Favorites']] : [])].map(([to, label]) => (
              <Link key={to} to={to} className="block px-3 py-2.5 text-sm font-semibold text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                {label}
              </Link>
            ))}
            {isAdmin && <Link to="/admin" className="block px-3 py-2.5 text-sm font-semibold text-violet-600 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20">Admin Panel</Link>}
            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <button onClick={handleLogout} className="w-full rounded-2xl border border-gray-200 dark:border-white/20 py-2.5 text-sm font-semibold text-dark/70 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="block text-center rounded-2xl border border-gray-200 dark:border-white/20 py-2.5 text-sm font-semibold text-dark/70 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">Sign In</Link>
                  <Link to="/signup" className="block text-center rounded-2xl bg-dark dark:bg-white py-2.5 text-sm font-semibold text-white dark:text-dark">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
