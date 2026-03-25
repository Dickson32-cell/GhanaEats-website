const Spinner = ({ size = 'md' }) => {
  const s = { sm: 'h-5 w-5', md: 'h-9 w-9', lg: 'h-14 w-14' }[size];
  return (
    <svg className={`${s} animate-spin text-brand-500`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
};

export default Spinner;
