import { useState, useEffect } from 'react';
import * as adminApi from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAllUsers().then((r) => setUsers(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-dark">Users</h1>
        <p className="text-dark/50 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['User', 'Email', 'Phone', 'Role', 'Joined'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-dark/40 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-bold text-sm flex-shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-dark">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark/60">{u.email}</td>
                    <td className="px-5 py-4 text-sm text-dark/50">{u.phone || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${u.role === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-dark/60'}`}>
                        {u.role === 'ADMIN' ? '⚡ Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
