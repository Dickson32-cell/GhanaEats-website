const CategoryFilter = ({ categories, selected, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
    <button
      onClick={() => onSelect('')}
      className={`flex-shrink-0 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-150 ${
        !selected
          ? 'bg-dark text-white shadow-sm'
          : 'bg-white border border-gray-200 text-dark/60 hover:border-gray-300 hover:text-dark'
      }`}
    >
      All
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.slug)}
        className={`flex-shrink-0 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-150 ${
          selected === cat.slug
            ? 'bg-dark text-white shadow-sm'
            : 'bg-white border border-gray-200 text-dark/60 hover:border-gray-300 hover:text-dark'
        }`}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
