import { useState, useEffect } from 'react';
import * as promosApi from '../../api/promosApi';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const EMPTY_FORM = { message: '', isActive: true, priority: 0 };

const AdminPromosPage = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPromos = () => promosApi.getAllPromos().then((r) => setPromos(r.data.data)).finally(() => setLoading(false));

  useEffect(() => { fetchPromos(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModalOpen(true); };
  const openEdit = (promo) => {
    setForm({ message: promo.message, isActive: promo.isActive, priority: promo.priority });
    setEditId(promo.id);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await promosApi.updatePromo(editId, form);
        toast.success('Promo updated');
      } else {
        await promosApi.createPromo(form);
        toast.success('Promo created');
      }
      setModalOpen(false);
      fetchPromos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this promo?')) return;
    try {
      await promosApi.deletePromo(id);
      toast.success('Promo deleted');
      fetchPromos();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark">Promo Messages</h1>
          <p className="text-dark/50 text-sm mt-1">{promos.length} promos total</p>
        </div>
        <Button onClick={openAdd} size="md">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Promo
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Message', 'Priority', 'Status', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-dark/40 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {promos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-dark max-w-md">{promo.message}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {promo.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${promo.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${promo.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-dark/40">
                      {new Date(promo.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(promo)} className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(promo.id)} className="text-sm font-bold text-red-400 hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Promo' : 'Add Promo'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark/80">Promo Message</label>
            <textarea
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 resize-none transition-all"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="e.g., 🎉 50% OFF on all pizzas this weekend!"
              required
            />
          </div>
          <Input
            label="Priority (higher shows first)"
            type="number"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-brand-500' : 'bg-gray-200'}`}>
                <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform m-0.5 ${form.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
            <span className="text-sm font-semibold text-dark/70">Active (visible on website)</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editId ? 'Save Changes' : 'Create Promo'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPromosPage;
