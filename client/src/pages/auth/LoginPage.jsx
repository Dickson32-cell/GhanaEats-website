import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-dark flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-brand-900/40" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-white">FoodApp</span>
          </Link>
        </div>

        <div className="relative z-10">
          <blockquote className="text-2xl font-display font-bold text-white leading-snug mb-4">
            "The best food is the kind that brings people together."
          </blockquote>
          <p className="text-white/50 text-sm">Order in minutes. Enjoy immediately.</p>
        </div>

        <div className="relative z-10 flex gap-4">
          {['🍕', '🍔', '🍜', '🍣', '🧁'].map((e) => (
            <span key={e} className="text-xl opacity-60">{e}</span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-dark">FoodApp</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-dark mb-2">Welcome back</h1>
            <p className="text-dark/50 text-sm">Sign in to continue ordering</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-dark/50">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-brand-500 hover:text-brand-600 transition-colors">
              Create one free
            </Link>
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-800 mb-1">Demo admin account</p>
            <p className="text-xs text-amber-700">admin@foodapp.com / Admin@1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
