import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as orderApi from '../../api/orderApi';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getOrders().then((r) => setOrders(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-bold text-brand-500 mb-2 uppercase tracking-widest">History</p>
        <h1 className="font-display text-4xl font-bold text-dark mb-1">My Orders</h1>
        <p className="text-dark/40 text-sm">
          {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''} total` : 'No orders yet'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-gray-50/60 border border-gray-100">
          <div className="text-6xl mb-5">📦</div>
          <h3 className="font-display text-2xl font-bold text-dark/50 mb-2">No orders yet</h3>
          <p className="text-dark/30 text-sm mb-7 max-w-xs mx-auto">
            When you place your first order, it will appear here.
          </p>
          <Link to="/menu">
            <Button>Browse Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-display font-bold text-dark truncate">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <Badge status={order.status} />
                  </div>
                  <p className="text-sm text-dark/40 mb-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                    })}
                    {' · '}
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </p>
                  {order.deliveryAddress && (
                    <p className="text-sm text-dark/50 flex items-center gap-1.5 mt-1">
                      <svg className="h-3.5 w-3.5 flex-shrink-0 text-dark/25" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span className="truncate">{order.deliveryAddress}</span>
                    </p>
                  )}
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                  <span className="text-2xl font-bold text-brand-500">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </span>
                  <Link to={`/orders/${order.id}/track`}>
                    <Button variant="secondary" size="sm" className="whitespace-nowrap">
                      Track Order →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
