import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import * as orderApi from '../../api/orderApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ deliveryAddress: user?.address || '', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deliveryAddress.trim()) { toast.error('Delivery address is required'); return; }
    setLoading(true);
    try {
      const res = await orderApi.placeOrder(form);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.data.id}/track`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-dark/40">
        <p className="font-display text-xl font-semibold mb-4">Your cart is empty</p>
        <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-dark">Delivery Details</h2>
          <Input label="Delivery Address" placeholder="Enter your full address" value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark/70">Order Notes (optional)</label>
            <textarea
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 resize-none transition-all"
              rows={3} placeholder="Any special instructions?"
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" loading={loading}>Place Order</Button>
        </form>

        {/* Order Summary */}
        <div className="bg-cream rounded-3xl border border-gray-100 p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-dark mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-dark/60">{item.menuItem.name} × {item.quantity}</span>
                <span className="font-medium text-dark">${(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="flex justify-between text-sm text-dark/60"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-dark/60 mt-1"><span>Delivery</span><span>$2.99</span></div>
          <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t border-gray-200">
            <span className="text-dark">Total</span>
            <span className="text-brand-500">${(totalPrice + 2.99).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
