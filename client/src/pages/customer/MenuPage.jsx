import { useState, useEffect, useRef } from 'react';
import * as menuApi from '../../api/menuApi';
import * as favApi from '../../api/favoritesApi';
import { useAuth } from '../../context/AuthContext';
import MenuCard from '../../components/menu/MenuCard';
import CategoryFilter from '../../components/menu/CategoryFilter';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import OrganicBlob from '../../components/ui/OrganicBlob';
import FloatingElement from '../../components/ui/FloatingElement';

const MenuPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('');
  const topRef = useRef(null);

  useEffect(() => {
    menuApi.getCategories().then((r) => setCategories(r.data.data));
    if (user) {
      favApi.getFavorites().then((r) => setFavoriteIds(r.data.data.map((f) => f.menuItemId)));
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    menuApi.getItems({ category: selectedCategory, search, page, limit: 12 })
      .then((r) => { setItems(r.data.data.items); setTotalPages(r.data.data.pages); })
      .finally(() => setLoading(false));
  }, [selectedCategory, search, page]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setActiveFilter(cat);
    setPage(1);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFavoriteToggle = (id, isFav) => {
    setFavoriteIds((prev) => isFav ? [...prev, id] : prev.filter((x) => x !== id));
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setActiveFilter('');
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const hasFilters = selectedCategory || search;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 to-peach-50 dark:from-dark dark:to-dark-800">
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 overflow-hidden" ref={topRef}>
      {/* Organic background decorations */}
      <div className="absolute top-20 right-10 opacity-30 pointer-events-none">
        <OrganicBlob
          color="bg-gradient-to-br from-brand-300/20 to-orange-200/10"
          size="medium"
          animate={true}
        />
      </div>
      <div className="absolute bottom-40 left-10 opacity-25 pointer-events-none">
        <OrganicBlob
          color="bg-gradient-to-br from-purple-300/15 to-indigo-200/10"
          size="large"
          animate={true}
        />
      </div>

      {/* Floating food decoration */}
      <FloatingElement speed={0.2} className="absolute top-32 right-32 hidden xl:block pointer-events-none z-0" animationType="gentle">
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl border-4 border-white/30 opacity-60">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80" alt="" className="w-full h-full object-cover" />
        </div>
      </FloatingElement>

      <div className="relative z-10">
        {/* Page header */}
        <div className="mb-12 reveal">
          <p className="text-sm font-bold text-brand-500 mb-3 uppercase tracking-widest">Explore</p>
          <h1 className="font-display text-5xl font-bold text-dark dark:text-white mb-2">Our Menu</h1>
          <p className="text-dark/50 dark:text-white/50 text-base">
            {loading ? 'Loading delicious options...' : `${items.length} delicious item${items.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

      {/* Search + filter bar */}
      <div className="mb-6 space-y-4 reveal delay-100">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark/30 dark:text-white/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 text-dark dark:text-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all placeholder:text-dark/30 dark:placeholder:text-white/30"
              placeholder="Search for food..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" size="md">Search</Button>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 px-4 py-3 text-sm font-semibold text-dark/60 dark:text-white/60 hover:text-dark dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </form>

        {/* Categories */}
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={handleCategoryChange} />
      </div>

      {/* Category Info Banner */}
      {selectedCategory && !search && (
        <div className="mb-6 reveal">
          {(() => {
            const category = categories.find(c => c.name === selectedCategory);
            if (!category) return null;
            return (
              <div className="bg-gradient-to-br from-white to-brand-50/30 dark:from-dark-800 dark:to-dark-700 rounded-3xl p-6 border border-brand-100/50 dark:border-brand-900/30 shadow-soft">
                {category.tagline && (
                  <p className="text-brand-600 dark:text-brand-400 font-semibold italic text-lg mb-2">
                    {category.tagline}
                  </p>
                )}
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Active filter chips */}
      {(selectedCategory || search) && (
        <div className="flex flex-wrap gap-2 mb-6 reveal">
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-dark dark:bg-white px-3 py-1.5 text-xs font-semibold text-white dark:text-dark">
              Category: {selectedCategory}
              <button onClick={() => handleCategoryChange('')} className="hover:text-brand-300 dark:hover:text-brand-500">×</button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-3 py-1.5 text-xs font-semibold">
              Search: "{search}"
              <button onClick={() => { setSearch(''); setSearchInput(''); }} className="hover:text-brand-900 dark:hover:text-brand-100">×</button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-dark/30 dark:text-white/30 text-sm">Finding the best dishes for you...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-gray-50/60 dark:bg-dark-800/60 border border-gray-100 dark:border-gray-700 reveal">
          <div className="text-6xl mb-5">🔍</div>
          <h3 className="font-display text-2xl font-bold text-dark/50 dark:text-white/50 mb-2">No items found</h3>
          <p className="text-dark/30 dark:text-white/30 text-sm mb-6 max-w-xs mx-auto">We couldn't find anything matching your search. Try a different category or keyword.</p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,90,31,0.3)] transition-all hover:-translate-y-0.5"
          >
            Browse all items
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item, i) => (
              <div key={item.id} className="reveal-scale" style={{ transitionDelay: `${Math.min(i * 60, 400)}ms` }}>
                <MenuCard item={item} favoriteIds={favoriteIds} onFavoriteToggle={handleFavoriteToggle} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12 reveal">
              <button
                disabled={page === 1}
                onClick={() => { setPage(p => p - 1); topRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 px-5 py-2.5 text-sm font-semibold text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1;
                  const isCurrent = p === page;
                  const isNear = Math.abs(p - page) <= 2 || p === 1 || p === totalPages;
                  if (!isNear && p !== 1 && p !== totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => { setPage(p); topRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isCurrent
                          ? 'bg-dark dark:bg-white text-white dark:text-dark shadow-sm'
                          : 'text-dark/50 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-dark dark:hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => { setPage(p => p + 1); topRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 px-5 py-2.5 text-sm font-semibold text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          <p className="text-center text-xs text-dark/30 dark:text-white/30 mt-6 reveal">
            Showing page {page} of {totalPages}
          </p>
        </>
      )}
      </div>
    </div>
    </div>
  );
};

export default MenuPage;
