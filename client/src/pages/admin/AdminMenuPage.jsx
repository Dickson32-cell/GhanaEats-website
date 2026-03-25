import { useState, useEffect } from 'react';
import * as adminApi from '../../api/adminApi';
import * as menuApi from '../../api/menuApi';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', imageUrl: '', categoryId: '', isAvailable: true };

const AdminMenuPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => adminApi.getAllMenuItems().then((r) => setItems(r.data.data)).finally(() => setLoading(false));

  useEffect(() => { fetchItems(); menuApi.getCategories().then((r) => setCategories(r.data.data)); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: item.price, imageUrl: item.imageUrl || '', categoryId: item.categoryId, isAvailable: item.isAvailable });
    setEditId(item.id);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, price: parseFloat(form.price) };
      if (editId) { await adminApi.updateMenuItem(editId, data); toast.success('Item updated'); }
      else { await adminApi.createMenuItem(data); toast.success('Item created'); }
      setModalOpen(false);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDisable = async (id) => {
    if (!confirm('Disable this menu item?')) return;
    try { await adminApi.deleteMenuItem(id); toast.success('Item disabled'); fetchItems(); }
    catch { toast.error('Failed to disable'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark">Menu</h1>
          <p className="text-dark/50 text-sm mt-1">{items.length} items total</p>
        </div>
        <Button onClick={openAdd} size="md">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Item', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-dark/40 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=60'} alt={item.name} className="h-11 w-11 rounded-2xl object-cover flex-shrink-0 shadow-sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-dark truncate">{item.name}</p>
                          <p className="text-xs text-dark/40 truncate max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-bold text-dark/60">{item.category?.name}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-brand-500">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {item.isAvailable ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(item)} className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Edit</button>
                        <button onClick={() => handleDisable(item.id)} className="text-sm font-bold text-red-400 hover:text-red-500 transition-colors">Disable</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Menu Item' : 'Add Menu Item'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Classic Burger" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark/80">Description</label>
            <textarea className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 resize-none transition-all" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the dish" />
          </div>
          <Input label="Price ($)" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="0.00" />
          <Input label="Image URL" placeholder="https://images.unsplash.com/..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark/80">Category</label>
            <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="sr-only" />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.isAvailable ? 'bg-brand-500' : 'bg-gray-200'}`}>
                <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform m-0.5 ${form.isAvailable ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
            <span className="text-sm font-semibold text-dark/70">Available for ordering</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editId ? 'Save Changes' : 'Create Item'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMenuPage;
