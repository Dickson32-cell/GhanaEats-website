import { useState, useEffect } from 'react';
import * as adminApi from '../../api/adminApi';
import * as menuApi from '../../api/menuApi';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: '',
  isAvailable: true,
  tags: '',
  spiceLevel: '',
  pairsWith: '',
  proteinOptions: ''
};

const AdminMenuPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchItems = () => adminApi.getAllMenuItems().then((r) => setItems(r.data.data)).finally(() => setLoading(false));

  useEffect(() => { fetchItems(); menuApi.getCategories().then((r) => setCategories(r.data.data)); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setSelectedFile(null); setModalOpen(true); };
  const openEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
      tags: item.tags?.join(', ') || '',
      spiceLevel: item.spiceLevel !== null ? item.spiceLevel : '',
      pairsWith: item.pairsWith || '',
      proteinOptions: item.proteinOptions || ''
    });
    setEditId(item.id);
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading to: http://localhost:5000/api/upload');

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setForm({ ...form, imageUrl: `http://localhost:5000${data.imageUrl}` });
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.message || 'Upload failed');
        console.error('Upload failed:', data.message);
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        spiceLevel: form.spiceLevel !== '' ? parseInt(form.spiceLevel) : null,
        pairsWith: form.pairsWith || null,
        proteinOptions: form.proteinOptions || null
      };
      if (editId) { await adminApi.updateMenuItem(editId, data); toast.success('Item updated'); }
      else { await adminApi.createMenuItem(data); toast.success('Item created'); }
      setModalOpen(false);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, itemName) => {
    if (!confirm(`Are you sure you want to permanently delete "${itemName}"? This action cannot be undone.`)) return;
    try {
      await adminApi.deleteMenuItem(id);
      toast.success('Item deleted successfully');
      fetchItems();
    }
    catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark dark:text-white">Menu</h1>
          <p className="text-dark/50 dark:text-white/50 text-sm mt-1">{items.length} items total</p>
        </div>
        <Button onClick={openAdd} size="md">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-dark-600/50">
                  {['Item', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-600">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-600/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=60'} alt={item.name} className="h-11 w-11 rounded-2xl object-cover flex-shrink-0 shadow-sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-dark dark:text-white truncate">{item.name}</p>
                          <p className="text-xs text-dark/40 dark:text-white/40 truncate max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-xl bg-gray-100 dark:bg-dark-600 px-3 py-1 text-xs font-bold text-dark/60 dark:text-white/60">{item.category?.name}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-brand-500 dark:text-brand-400">{formatPrice(item.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {item.isAvailable ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(item)} className="text-sm font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">Delete</button>
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
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Ghana Jollof Rice" />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark/80">Description</label>
            <textarea className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 resize-none transition-all" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the dish" />
          </div>

          <Input label="Price (GH₵)" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="15.00" />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark/80 dark:text-white/80">Upload Image</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-700 px-4 py-8 text-center transition-all hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/20">
                  {uploading ? (
                    <>
                      <svg className="h-6 w-6 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
            {form.imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark/80">Category *</label>
            <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Ghana Menu Fields */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-bold text-dark/70 mb-3">Ghana Menu Details (Optional)</h4>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-sm font-semibold text-dark/80">Tags</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all"
                placeholder="Popular, Best Seller, Must Try (comma-separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-sm font-semibold text-dark/80">Spice Level</label>
              <select
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all"
                value={form.spiceLevel}
                onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })}
              >
                <option value="">None</option>
                <option value="1">🌶️ Mild</option>
                <option value="2">🌶️🌶️ Medium</option>
                <option value="3">🌶️🌶️🌶️ Hot</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-sm font-semibold text-dark/80">Pairs With</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all"
                placeholder="Fried chicken, grilled fish, plantain"
                value={form.pairsWith}
                onChange={(e) => setForm({ ...form, pairsWith: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-dark/80">Protein Options</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all"
                placeholder="Chicken, goat, beef, fish"
                value={form.proteinOptions}
                onChange={(e) => setForm({ ...form, proteinOptions: e.target.value })}
              />
            </div>
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

          <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editId ? 'Save Changes' : 'Create Item'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMenuPage;
