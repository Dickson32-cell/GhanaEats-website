import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from './modules/auth/auth.routes.js';
import menuRoutes from './modules/menu/menu.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import favoritesRoutes from './modules/favorites/favorites.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import featuredRoutes from './modules/featured/featured.routes.js';
import promosRoutes from './modules/promos/promos.routes.js';
import reviewsRoutes from './modules/reviews/reviews.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

const app = express();

// CORS — allow CLIENT_URL in dev, same-origin in production
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/featured', featuredRoutes);
app.use('/api/promos', promosRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api', uploadRoutes);

// Serve built React frontend (production)
app.use(express.static(path.join(rootDir, 'client', 'dist')));

// SPA fallback — all non-API routes go to React (Express 5 syntax)
app.get('{*splat}', (req, res) => {
  res.sendFile(path.join(rootDir, 'client', 'dist', 'index.html'));
});

app.use(errorHandler);

export default app;
