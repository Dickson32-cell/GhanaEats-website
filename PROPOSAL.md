# FoodApp — Project Proposal

**Prepared by:** RameTech Consultancy
**Date:** March 2026
**Project Type:** Full-Stack Food Ordering Web Application

---

## 1. Executive Summary

This proposal outlines the design, development, and delivery of **FoodApp** — a complete, production-ready food ordering web platform. The platform enables customers to browse a menu, place orders, track delivery in real time, and save their favourite meals, while giving the business a dedicated admin panel to manage orders, menu items, and monitor revenue.

---

## 2. Problem Statement

Many food businesses rely on third-party platforms (e.g. Uber Eats, Deliveroo) that charge high commission fees and provide no ownership of customer data. A custom-built platform solves this by:

- Eliminating per-order commission fees
- Giving the business full control over the menu, pricing, and branding
- Providing direct access to customer data and ordering insights
- Delivering a branded experience that builds customer loyalty

---

## 3. Proposed Solution

A custom web application with two distinct interfaces:

### 3.1 Customer-Facing Website
A modern, mobile-responsive ordering platform where customers can:

- **Browse the menu** by category or search
- **Add items to cart** with real-time cart sync across devices
- **Place orders** with delivery address and special instructions
- **Track orders** through live status updates (Pending → Preparing → On the Way → Delivered)
- **Save favourites** to quickly re-order preferred meals
- **Create accounts** and manage their profile

### 3.2 Admin Panel
A secure, separate dashboard accessible only to authorised staff where the business can:

- **Monitor revenue** with a 30-day bar chart and summary statistics
- **Manage all orders** — filter by status, update order progress in real time
- **Manage the menu** — add, edit, or disable items with images and categories
- **View all registered users** and their details

---

## 4. Technical Approach

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite | Fast, component-based UI with instant hot-reload |
| Styling | Tailwind CSS | Utility-first — rapid, consistent, responsive design |
| Backend | Node.js + Express | Lightweight, scalable REST API |
| Database | PostgreSQL | Relational, reliable, ideal for orders and users |
| ORM | Prisma v5 | Type-safe database access with easy migrations |
| Auth | JWT (JSON Web Tokens) | Stateless, secure authentication |
| Passwords | bcryptjs | Industry-standard hashing |
| Charts | Recharts | Composable revenue visualisation |

### Security measures included:
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens with 7-day expiry
- Role-based access control (CUSTOMER / ADMIN)
- Admin routes protected by server-side middleware — not just frontend guards
- CORS restricted to the client origin

---

## 5. Key Features

### Customer Features
| Feature | Description |
|---|---|
| Registration & Login | Email/password auth with JWT sessions |
| Menu Browsing | Category filter, keyword search, paginated results |
| Cart | Server-synced cart — persists across devices and sessions |
| Checkout | Delivery address, order notes, order summary |
| Order Tracking | 4-step progress tracker polling every 10 seconds |
| Favourites | Save and manage preferred dishes |
| Responsive Design | Fully mobile-friendly on all screen sizes |

### Admin Features
| Feature | Description |
|---|---|
| Revenue Dashboard | Total revenue, orders today, active orders, total customers |
| Revenue Chart | 30-day bar chart of daily revenue from delivered orders |
| Order Management | Full order list with status filter tabs and inline status updates |
| Menu Management | Create, edit, and disable menu items with categories and images |
| User Management | View all registered customers |

---

## 6. Database Design

Eight interconnected tables:

- **User** — authentication, profile, role
- **Category** — menu groupings (Burgers, Pizza, etc.)
- **MenuItem** — dish details, pricing, availability
- **CartItem** — per-user server-side cart with upsert logic
- **Order** — placed orders with delivery details and total
- **OrderItem** — snapshot of items and prices at order time
- **OrderStatusHistory** — full audit trail of every status change
- **Favourite** — user-saved menu items

> **Note:** `OrderItem.unitPrice` stores the price at the time of ordering, ensuring that historical order totals are never affected by future price changes.

---

## 7. Deliverables

- [x] Full source code (client + server)
- [x] PostgreSQL schema with Prisma migrations
- [x] Database seed script (23 menu items, 6 categories, admin account)
- [x] REST API with 20+ endpoints
- [x] Professional UI with custom design system
- [x] Admin panel (separate route, role-protected)
- [x] Development environment configuration
- [x] Technical plan document
- [x] This proposal document

---

## 8. Project Structure

```
Food website/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
    └── prisma/      # Database schema & seed
```

---

## 9. Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (local or hosted)

### Setup
```bash
# 1. Configure the database
#    Edit server/.env → set DATABASE_URL

# 2. Run database migration
cd server
npx prisma migrate dev --name init

# 3. Seed the database
npm run seed

# 4. Start the backend
npm run dev

# 5. Start the frontend (new terminal)
cd ../client
npm run dev
```

**Frontend:** http://localhost:5173
**Backend API:** http://localhost:5000
**Admin panel:** http://localhost:5173/admin

**Default admin credentials:**
- Email: `admin@foodapp.com`
- Password: `Admin@1234`

---

## 10. Future Enhancements

The following features are recommended for a Phase 2 release:

| Enhancement | Description |
|---|---|
| Payment Integration | Stripe or PayPal checkout |
| Image Uploads | Admin can upload menu item photos via Cloudinary |
| Push Notifications | Real-time order updates via WebSockets or SSE |
| Discount / Promo Codes | Apply coupon codes at checkout |
| Customer Reviews | Star ratings and comments per menu item |
| Mobile App | React Native app sharing the same backend API |

---

*Developed by RameTech Consultancy — 2026*
