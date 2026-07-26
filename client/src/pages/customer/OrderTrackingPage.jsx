import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as orderApi from '../../api/orderApi';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/currency';

const STEPS = ['PENDING', 'PREPARING', 'ON_THE_WAY', 'DELIVERED'];
const STEP_LABELS = { PENDING: 'Order Placed', PREPARING: 'Preparing', ON_THE_WAY: 'On the Way', DELIVERED: 'Delivered' };
const STEP_ICONS = {
  PENDING: '📋', PREPARING: '👨‍🍳', ON_THE_WAY: '🚗', DELIVERED: '✅'
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchTracking = () => {
    orderApi.trackOrder(id).then((r) => setOrder(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    orderApi.getOrderById(id).then((r) => setOrder(r.data.data)).finally(() => setLoading(false));
    fetchTracking();
    intervalRef.current = setInterval(fetchTracking, 10000);
    return () => clearInterval(intervalRef.current);
  }, [id]);

  useEffect(() => {
    if (order?.status === 'DELIVERED' || order?.status === 'CANCELLED') {
      clearInterval(intervalRef.current);
    }
  }, [order?.status]);

  if (loading) return (
    <div className="min-h-screen flex justify-center py-16" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
      <Spinner />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen text-center py-16 text-gray-500" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
      Order not found.
    </div>
  );

  const currentStep = STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">Track Order</h1>
          <p className="text-sm text-dark/40 mt-1">Order #{id.slice(0, 8).toUpperCase()}</p>
        </div>
        <Badge status={order.status} />
      </div>

      {/* Stepper */}
      {!isCancelled ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-brand-500 transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STEPS.map((step, idx) => {
              const done = idx <= currentStep;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl border-2 transition-colors ${done ? 'bg-brand-500 border-brand-500' : 'bg-white border-gray-300'}`}>
                    {STEP_ICONS[step]}
                  </div>
                  <span className={`text-xs font-medium text-center ${done ? 'text-brand-500' : 'text-dark/30'}`}>{STEP_LABELS[step]}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center text-red-600 font-medium">
          This order has been cancelled.
        </div>
      )}

      {/* Order Items */}
      {order.items && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-dark mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-dark/60">{item.menuItem.name} × {item.quantity}</span>
                <span className="font-medium text-dark">{formatPrice(parseFloat(item.unitPrice) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr className="my-3 border-gray-100" />
          <div className="flex justify-between font-bold">
            <span className="text-dark">Total</span>
            <span className="text-brand-500">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      )}

      {/* Status History */}
      {order.statusHistory?.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
          <h2 className="font-display font-semibold text-dark mb-4">Status History</h2>
          <div className="space-y-2">
            {order.statusHistory.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <Badge status={h.status} />
                <span className="text-gray-500">{new Date(h.changedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link to="/orders" className="text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors">← Back to my orders</Link>
      </div>
    </div>
    </div>
  );
};

export default OrderTrackingPage;
