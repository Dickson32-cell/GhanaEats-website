const Input = ({ label, error, hint, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-semibold text-dark/80">{label}</label>
    )}
    <input
      {...props}
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-dark placeholder-gray-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'} ${className}`}
    />
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

export default Input;
