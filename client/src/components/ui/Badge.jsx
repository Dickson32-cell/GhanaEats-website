const config = {
  PENDING:    { dot: 'bg-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Pending' },
  PREPARING:  { dot: 'bg-blue-400',    bg: 'bg-blue-50',    text: 'text-blue-700',    label: 'Preparing' },
  ON_THE_WAY: { dot: 'bg-violet-400',  bg: 'bg-violet-50',  text: 'text-violet-700',  label: 'On the Way' },
  DELIVERED:  { dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Delivered' },
  CANCELLED:  { dot: 'bg-red-400',     bg: 'bg-red-50',     text: 'text-red-600',     label: 'Cancelled' },
};

const Badge = ({ status, className = '' }) => {
  const c = config[status] || { dot: 'bg-gray-400', bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${c.bg} ${c.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

export default Badge;
