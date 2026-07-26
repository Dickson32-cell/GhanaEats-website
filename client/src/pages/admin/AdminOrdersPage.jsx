import { useState, useEffect } from 'react';
import * as adminApi from '../../api/adminApi';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const STATUSES = ['', 'PENDING', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];
const STATUS_LABELS = { '': 'All Orders', PENDING: 'Pending', PREPARING: 'Preparing', ON_THE_WAY: 'On the Way', DELIVERED: 'Delivered', CANCELLED: 'Cancelled' };

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = () => {
    setLoading(true);
    adminApi.getAllOrders({ status: statusFilter || undefined, page })
      .then((r) => { setOrders(r.data.data.orders); setTotalPages(r.data.data.pages); setTotal(r.data.data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-dark">Orders</h1>
        <p className="text-dark/50 text-sm mt-1">{total} total orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${statusFilter === s ? 'bg-dark text-white shadow-sm' : 'bg-white border border-gray-200 text-dark/50 hover:text-dark hover:border-gray-300'}`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-dark/30">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl mb-3">📭</div>
            <p className="font-semibold">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-dark/40 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-dark/40">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-dark">{order.user?.name}</p>
                      <p className="text-xs text-dark/40 mt-0.5">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark/60">{order.items?.length || 0} item(s)</td>
                    <td className="px-5 py-4 font-bold text-brand-500">{formatPrice(order.totalAmount)}</td>
                    <td className="px-5 py-4"><Badge status={order.status} /></td>
                    <td className="px-5 py-4 text-sm text-dark/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 cursor-pointer"
                      >
                        {STATUSES.filter(Boolean).map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-2xl border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors">Previous</button>
          <span className="text-sm font-medium text-dark/50">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-2xl border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors">Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
