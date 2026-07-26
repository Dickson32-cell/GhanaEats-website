import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as siteSettingsApi from '../api/siteSettingsApi';

const SiteSettingsContext = createContext(null);

// Default fallback values (used before API loads or if it fails)
const DEFAULTS = {
  brand_name: 'FoodApp',
  brand_tagline: 'Delicious food delivered to your door — fresh, fast, and always satisfying.',
  brand_logo_url: '',
  login_bg_url: '/uploads/waakye.jpeg',
  signup_button_text: 'Get Started',
  signin_button_text: 'Sign In',
  logout_button_text: 'Logout',
  nav_home_label: 'Home',
  nav_menu_label: 'Menu',
  nav_orders_label: 'My Orders',
  nav_favorites_label: 'Favorites',
  footer_explore_title: 'Explore',
  footer_explore_home: 'Home',
  footer_explore_menu: 'Menu',
  footer_explore_orders: 'My Orders',
  footer_explore_favorites: 'Favorites',
  footer_account_title: 'Account',
  footer_account_signin: 'Sign In',
  footer_account_signup: 'Create Account',
  footer_company_title: 'Company',
  footer_company_about: 'About Us',
  footer_company_careers: 'Careers',
  footer_company_blog: 'Blog',
  footer_company_press: 'Press',
  footer_support_title: 'Support',
  footer_support_help: 'Help Center',
  footer_support_contact: 'Contact Us',
  footer_support_faqs: 'FAQs',
  footer_support_delivery: 'Delivery Areas',
  contact_email: 'hello@foodapp.com',
  contact_phone: '+1 (555) 000-0000',
  contact_hours: 'Mon–Sun, 8am – 11pm',
  social_twitter: '#',
  social_instagram: '#',
  social_facebook: '#',
  social_tiktok: '#',
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await siteSettingsApi.getPublicSettings();
      if (res.data?.data) {
        setSettings((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch {
      // Silent fail — use defaults
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const get = (key) => settings[key] ?? DEFAULTS[key] ?? '';
  const refresh = () => fetchSettings();

  return (
    <SiteSettingsContext.Provider value={{ settings, get, refresh, loaded }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);