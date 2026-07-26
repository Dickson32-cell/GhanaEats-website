import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as orderApi from '../../api/orderApi';
import * as reviewsApi from '../../api/reviewsApi';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ open: false, order: null });
  const [ratings, setRatings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    orderApi.getOrders().then((r) => setOrders(r.data.data)).finally(() => setLoading(false));
  }, []);

  const openRatingModal = (order) => {
    const initialRatings = {};
    order.items.forEach(item => {
      initialRatings[item.menuItemId] = { rating: 5, comment: '' };
    });
    setRatings(initialRatings);
    setRatingModal({ open: true, order });
  };

  const closeRatingModal = () => {
    setRatingModal({ open: false, order: null });
    setRatings({});
  };

  const handleRatingChange = (menuItemId, rating) => {
    setRatings(prev => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId], rating }
    }));
  };

  const handleCommentChange = (menuItemId, comment) => {
    setRatings(prev => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId], comment }
    }));
  };

  const submitReviews = async () => {
    setSubmitting(true);
    try {
      const promises = ratingModal.order.items.map(item =>
        reviewsApi.createReview({
          orderId: ratingModal.order.id,
          menuItemId: item.menuItemId,
          rating: ratings[item.menuItemId].rating,
          comment: ratings[item.menuItemId].comment || null,
        })
      );
      await Promise.all(promises);
      toast.success('Reviews submitted successfully!');
      closeRatingModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reviews');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center py-16" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
      <Spinner />
    </div>
  );

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
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
          {orders.map((order, idx) => {
            const isExpanded = expandedOrders.has(order.id);
            const isDelivered = order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
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
                      {formatPrice(order.totalAmount)}
                    </span>
                    <div className="flex gap-2">
                      <Link to={`/orders/${order.id}/track`}>
                        <Button variant="secondary" size="sm" className="whitespace-nowrap">
                          Track Order →
                        </Button>
                      </Link>
                      {isDelivered && (
                        <Button
                          onClick={() => openRatingModal(order)}
                          variant="primary"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          ⭐ Rate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Show items button */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-sm text-brand-500 font-semibold hover:text-brand-600 transition-colors flex items-center gap-1"
                    >
                      {isExpanded ? 'Hide' : 'Show'} items
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 py-2">
                            <img
                              src={item.menuItem?.imageUrl || 'https://via.placeholder.com/60'}
                              alt={item.menuItem?.name || 'Item'}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-dark">
                                {item.menuItem?.name || 'Unknown Item'}
                              </p>
                              <p className="text-xs text-dark/40">
                                Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                              </p>
                            </div>
                            <p className="text-sm font-bold text-brand-500">
                              {formatPrice(parseFloat(item.unitPrice) * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal.open && ratingModal.order && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeRatingModal}>
          <div
            className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Rate Your Order</h2>
              <button
                onClick={closeRatingModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-dark/60 mb-6">
              Order #{ratingModal.order.id.slice(0, 8).toUpperCase()} · {new Date(ratingModal.order.createdAt).toLocaleDateString()}
            </p>

            <div className="space-y-6">
              {ratingModal.order.items.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item.menuItem?.imageUrl || 'https://via.placeholder.com/80'}
                      alt={item.menuItem?.name || 'Item'}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-dark">{item.menuItem?.name || 'Unknown Item'}</p>
                      <p className="text-sm text-dark/40">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-3">
                    <label className="text-sm font-semibold text-dark mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingChange(item.menuItemId, star)}
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className={`w-8 h-8 ${
                              star <= (ratings[item.menuItemId]?.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-sm font-semibold text-dark mb-2 block">Comment (Optional)</label>
                    <textarea
                      value={ratings[item.menuItemId]?.comment || ''}
                      onChange={(e) => handleCommentChange(item.menuItemId, e.target.value)}
                      placeholder="Share your experience with this dish..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeRatingModal}
                className="flex-1 px-6 py-3 bg-gray-100 text-dark rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReviews}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-brand-500 text-white rounded-full font-semibold hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Reviews'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default OrdersPage;
