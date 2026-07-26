import { useState, useEffect } from 'react';
import * as siteSettingsApi from '../../api/siteSettingsApi';
import { useSiteSettings } from '../../context/SiteSettingsContext';
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
  const [activeTab, setActiveTab] = useState('general');

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
      { key: 'brand_logo_text', label: 'Logo Text (Navbar)', hint: 'Text shown next to the logo icon' },
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
      { key: 'footer_explore_title', label: 'Explore Section Title' },
      { key: 'footer_explore_home', label: 'Explore → Home' },
      { key: 'footer_explore_menu', label: 'Explore → Menu' },
      { key: 'footer_explore_orders', label: 'Explore → My Orders' },
      { key: 'footer_explore_favorites', label: 'Explore → Favorites' },
      { key: 'footer_account_title', label: 'Account Section Title' },
      { key: 'footer_account_signin', label: 'Account → Sign In' },
      { key: 'footer_account_signup', label: 'Account → Create Account' },
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
            <div key={field.key} className={field.textarea ? 'md:col-span-2' : ''}>
              {field.textarea ? (
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