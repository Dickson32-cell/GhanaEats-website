import { useState, useEffect, useRef } from 'react';
import * as siteSettingsApi from '../../api/siteSettingsApi';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../api/axiosInstance';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

/**
 * AdminSiteSettingsPage
 * Editable form for all customer-facing site content:
 * Brand, Navbar, Footer links, Contact info, Social links.
 * Changes sync to the live website instantly via SiteSettingsContext refresh.
 */
const AdminSiteSettingsPage = () => {
  const { refresh } = useSiteSettings();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const logoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const tabs = [
    { id: 'general', label: 'Brand', icon: '🏪' },
    { id: 'navbar', label: 'Navigation', icon: '🧭' },
    { id: 'footer', label: 'Footer Links', icon: '🔗' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'social', label: 'Social', icon: '🌐' },
  ];

  // Field definitions per tab
  const fields = {
    general: [
      { key: 'brand_name', label: 'Brand Name', hint: 'Shown in footer & admin sidebar' },
      { key: 'brand_logo_url', label: 'Logo Image', hint: 'Upload a logo image (PNG, JPG, SVG). Shown in navbar instead of text.', isLogo: true },
      { key: 'login_bg_url', label: 'Login Background Image', hint: 'Image shown on the left panel of the login page.', isImage: true },
      { key: 'brand_tagline', label: 'Tagline', hint: 'Short description under the logo in footer', textarea: true },
      { key: 'signin_button_text', label: 'Sign In Button Text' },
      { key: 'signup_button_text', label: 'Sign Up Button Text' },
      { key: 'logout_button_text', label: 'Logout Button Text' },
    ],
    navbar: [
      { key: 'nav_home_label', label: 'Home Link Label' },
      { key: 'nav_menu_label', label: 'Menu Link Label' },
      { key: 'nav_orders_label', label: 'My Orders Link Label' },
      { key: 'nav_favorites_label', label: 'Favorites Link Label' },
    ],
    footer: [
      { key: 'footer_company_title', label: 'Company Section Title' },
      { key: 'footer_company_about', label: 'Company → About Us' },
      { key: 'footer_company_careers', label: 'Company → Careers' },
      { key: 'footer_company_blog', label: 'Company → Blog' },
      { key: 'footer_company_press', label: 'Company → Press' },
      { key: 'footer_support_title', label: 'Support Section Title' },
      { key: 'footer_support_help', label: 'Support → Help Center' },
      { key: 'footer_support_contact', label: 'Support → Contact Us' },
      { key: 'footer_support_faqs', label: 'Support → FAQs' },
      { key: 'footer_support_delivery', label: 'Support → Delivery Areas' },
    ],
    contact: [
      { key: 'contact_email', label: 'Email Address', hint: 'e.g., hello@foodapp.com' },
      { key: 'contact_phone', label: 'Phone Number', hint: 'e.g., +1 (555) 000-0000' },
      { key: 'contact_hours', label: 'Operating Hours', hint: 'e.g., Mon–Sun, 8am – 11pm' },
    ],
    social: [
      { key: 'social_twitter', label: 'Twitter URL', hint: 'Full URL or # for placeholder' },
      { key: 'social_instagram', label: 'Instagram URL' },
      { key: 'social_facebook', label: 'Facebook URL' },
      { key: 'social_tiktok', label: 'TikTok URL' },
    ],
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await siteSettingsApi.getAdminSettings();
      // Flatten grouped settings into key→value map
      const flat = {};
      Object.values(res.data.data).forEach((group) => {
        group.forEach((item) => { flat[item.key] = item.value; });
      });
      setSettings(flat);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        const logoUrl = res.data.imageUrl;
        setSettings((prev) => ({ ...prev, brand_logo_url: logoUrl }));
        // Save immediately so it persists
        await siteSettingsApi.updateSettings({ brand_logo_url: logoUrl });
        refresh();
        toast.success('Logo uploaded — live site updated');
      } else {
        toast.error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    setSettings((prev) => ({ ...prev, brand_logo_url: '' }));
    await siteSettingsApi.updateSettings({ brand_logo_url: '' });
    refresh();
    toast.success('Logo removed — reverted to text');
  };

  const handleImageUpload = async (e, fieldKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        const imgUrl = res.data.imageUrl;
        setSettings((prev) => ({ ...prev, [fieldKey]: imgUrl }));
        await siteSettingsApi.updateSettings({ [fieldKey]: imgUrl });
        refresh();
        toast.success('Image uploaded — live site updated');
      } else {
        toast.error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async (fieldKey) => {
    setSettings((prev) => ({ ...prev, [fieldKey]: '' }));
    await siteSettingsApi.updateSettings({ [fieldKey]: '' });
    refresh();
    toast.success('Image removed');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Send only the fields for the current tab
      const tabFields = fields[activeTab];
      const payload = {};
      tabFields.forEach((f) => {
        if (settings[f.key] !== undefined) payload[f.key] = settings[f.key];
      });
      await siteSettingsApi.updateSettings(payload);
      toast.success('Settings saved — live site updated');
      refresh(); // Refresh the public settings context so the website updates instantly
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark dark:text-white">Site Settings</h1>
          <p className="text-dark/50 dark:text-white/50 text-sm mt-1">
            Edit customer-facing content — changes appear on the live site instantly.
          </p>
        </div>
        <Button onClick={handleSave} loading={saving} size="md">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-dark-700 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-dark text-dark dark:text-white shadow-sm'
                : 'text-dark/50 dark:text-white/50 hover:text-dark dark:hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-dark-700 rounded-3xl border border-gray-100 dark:border-white/10 shadow-card p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields[activeTab].map((field) => (
            <div key={field.key} className={field.textarea || field.isLogo || field.isImage ? 'md:col-span-2' : ''}>
              {field.isLogo ? (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-dark dark:text-white/80">{field.label}</label>
                  <div className="flex items-center gap-6">
                    {/* Preview */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-600 overflow-hidden flex-shrink-0">
                      {settings[field.key] ? (
                        <img src={settings[field.key]} alt="Logo preview" className="h-full w-full object-contain p-1" />
                      ) : (
                        <svg className="h-8 w-8 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    {/* Upload controls */}
                    <div className="flex flex-col gap-2">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        loading={uploadingLogo}
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {settings[field.key] ? 'Replace Logo' : 'Upload Logo'}
                      </Button>
                      {settings[field.key] && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="text-sm font-semibold text-red-400 hover:text-red-500 transition-colors"
                        >
                          Remove Logo
                        </button>
                      )}
                      <p className="text-xs text-gray-400 dark:text-white/30">{field.hint}</p>
                    </div>
                  </div>
                </div>
              ) : field.isImage ? (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-dark dark:text-white/80">{field.label}</label>
                  <div className="flex items-center gap-6">
                    {/* Preview */}
                    <div className="flex h-24 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-600 overflow-hidden flex-shrink-0">
                      {settings[field.key] ? (
                        <img src={settings[field.key]} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <svg className="h-8 w-8 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    {/* Upload controls */}
                    <div className="flex flex-col gap-2">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={(e) => handleImageUpload(e, field.key)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        loading={uploadingImage}
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {settings[field.key] ? 'Replace Image' : 'Upload Image'}
                      </Button>
                      {settings[field.key] && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(field.key)}
                          className="text-sm font-semibold text-red-400 hover:text-red-500 transition-colors"
                        >
                          Remove Image
                        </button>
                      )}
                      <p className="text-xs text-gray-400 dark:text-white/30">{field.hint}</p>
                    </div>
                  </div>
                </div>
              ) : field.textarea ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-dark dark:text-white/80">{field.label}</label>
                  <textarea
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-600 px-4 py-3 text-sm text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 resize-none transition-all"
                    rows={3}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.hint || ''}
                  />
                  {field.hint && <p className="text-xs text-gray-400 dark:text-white/30">{field.hint}</p>}
                </div>
              ) : (
                <Input
                  label={field.label}
                  value={settings[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.hint || ''}
                  hint={field.hint}
                />
              )}
            </div>
          ))}
        </div>

        {/* Save button at bottom too */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
          <Button onClick={handleSave} loading={saving} size="md">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteSettingsPage;