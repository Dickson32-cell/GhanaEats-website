/**
 * Seed default site settings into the database.
 * Run with: node prisma/seed-site-settings.js
 */
import prisma from '../src/config/db.js';

const DEFAULT_SETTINGS = [
  // General / Brand
  { key: 'brand_name', value: 'FoodApp', category: 'general' },
  { key: 'brand_tagline', value: 'Delicious food delivered to your door — fresh, fast, and always satisfying.', category: 'general' },
  { key: 'brand_logo_url', value: '', category: 'general' },
  { key: 'login_bg_url', value: '/uploads/waakye.jpeg', category: 'general' },
  { key: 'signup_button_text', value: 'Get Started', category: 'general' },
  { key: 'signin_button_text', value: 'Sign In', category: 'general' },
  { key: 'logout_button_text', value: 'Logout', category: 'general' },

  // Navbar links
  { key: 'nav_home_label', value: 'Home', category: 'navbar' },
  { key: 'nav_menu_label', value: 'Menu', category: 'navbar' },
  { key: 'nav_orders_label', value: 'My Orders', category: 'navbar' },
  { key: 'nav_favorites_label', value: 'Favorites', category: 'navbar' },

  // Footer — Explore section
  { key: 'footer_explore_title', value: 'Explore', category: 'footer' },
  { key: 'footer_explore_home', value: 'Home', category: 'footer' },
  { key: 'footer_explore_menu', value: 'Menu', category: 'footer' },
  { key: 'footer_explore_orders', value: 'My Orders', category: 'footer' },
  { key: 'footer_explore_favorites', value: 'Favorites', category: 'footer' },

  // Footer — Account section
  { key: 'footer_account_title', value: 'Account', category: 'footer' },
  { key: 'footer_account_signin', value: 'Sign In', category: 'footer' },
  { key: 'footer_account_signup', value: 'Create Account', category: 'footer' },

  // Footer — Company section
  { key: 'footer_company_title', value: 'Company', category: 'footer' },
  { key: 'footer_company_about', value: 'About Us', category: 'footer' },
  { key: 'footer_company_careers', value: 'Careers', category: 'footer' },
  { key: 'footer_company_blog', value: 'Blog', category: 'footer' },
  { key: 'footer_company_press', value: 'Press', category: 'footer' },

  // Footer — Support section
  { key: 'footer_support_title', value: 'Support', category: 'footer' },
  { key: 'footer_support_help', value: 'Help Center', category: 'footer' },
  { key: 'footer_support_contact', value: 'Contact Us', category: 'footer' },
  { key: 'footer_support_faqs', value: 'FAQs', category: 'footer' },
  { key: 'footer_support_delivery', value: 'Delivery Areas', category: 'footer' },

  // Contact info
  { key: 'contact_email', value: 'hello@foodapp.com', category: 'contact' },
  { key: 'contact_phone', value: '+1 (555) 000-0000', category: 'contact' },
  { key: 'contact_hours', value: 'Mon–Sun, 8am – 11pm', category: 'contact' },

  // Social links
  { key: 'social_twitter', value: '#', category: 'social' },
  { key: 'social_instagram', value: '#', category: 'social' },
  { key: 'social_facebook', value: '#', category: 'social' },
  { key: 'social_tiktok', value: '#', category: 'social' },
];

async function main() {
  console.log('Seeding site settings...');
  for (const setting of DEFAULT_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✓ Seeded ${DEFAULT_SETTINGS.length} site settings`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());