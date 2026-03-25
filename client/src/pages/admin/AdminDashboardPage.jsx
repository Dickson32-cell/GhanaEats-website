import { useState, useEffect } from 'react';
import * as adminApi from '../../api/adminApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Spinner from '../../components/ui/Spinner';

const StatCard = ({ icon, label, value, sub, colorClass }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 hover:shadow-card-hover transition-shadow">
    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl mb-4 ${colorClass}`}>
      {icon}
    </div>
    <p className="text-sm font-semibold text-dark/50 mb-1">{label}</p>
    <p className="font-display text-3xl font-bold text-dark">{value}</p>
    {sub && <p className="text-xs text-dark/40 mt-1">{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-dark text-white rounded-2xl px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-brand-400 font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getDashboard(), adminApi.getRevenue()])
      .then(([s, r]) => { setStats(s.data.data); setRevenue(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="mb-8 reveal">
        <h1 className="font-display text-3xl font-bold text-dark">Dashboard</h1>
        <p className="text-dark/50 text-sm mt-1">Welcome back — here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { icon: '💰', label: 'Total Revenue', value: `$${parseFloat(stats.totalRevenue).toFixed(2)}`, sub: 'From delivered orders', colorClass: 'bg-emerald-50 text-emerald-500', delay: 0 },
          { icon: '📦', label: 'Orders Today', value: stats.ordersToday, sub: 'Since midnight', colorClass: 'bg-blue-50 text-blue-500', delay: 100 },
          { icon: '🔥', label: 'Active Orders', value: stats.activeOrders, sub: 'In progress now', colorClass: 'bg-brand-50 text-brand-500', delay: 200 },
          { icon: '👥', label: 'Customers', value: stats.totalUsers, sub: 'Total registered', colorClass: 'bg-violet-50 text-violet-500', delay: 300 },
        ].map((s) => (
          <div key={s.label} className={`reveal-scale bg-white rounded-3xl border border-gray-100 shadow-card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5`} style={{ transitionDelay: `${s.delay}ms` }}>
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl mb-4 ${s.colorClass}`}>
              {s.icon}
            </div>
            <p className="text-sm font-semibold text-dark/50 mb-1">{s.label}</p>
            <p className="font-display text-3xl font-bold text-dark">{s.value}</p>
            {s.sub && <p className="text-xs text-dark/40 mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-dark">Revenue</h2>
            <p className="text-sm text-dark/40 mt-0.5">Last 30 days</p>
          </div>
          <div className="flex h-10 items-center gap-2 rounded-2xl bg-gray-100 px-4 text-sm font-semibold text-dark/50">
            📈 Monthly
          </div>
        </div>

        {revenue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-dark/30">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl mb-3">📊</div>
            <p className="font-semibold">No revenue data yet</p>
            <p className="text-sm mt-1">Complete some orders to see your chart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenue} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Plus Jakarta Sans' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Plus Jakarta Sans' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 8 }} />
              <Bar dataKey="revenue" fill="#ff5a1f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
