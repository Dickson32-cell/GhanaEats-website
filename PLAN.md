# FoodApp — Technical Implementation Plan

**Project:** Full-Stack Food Ordering Web Application
**Stack:** React + Vite · Node.js + Express · PostgreSQL · Prisma · Tailwind CSS

---

## 1. Architecture Overview

```
┌─────────────────────────────────┐     ┌──────────────────────────────────┐
│         CLIENT (React)          │     │         SERVER (Express)          │
│  ┌──────────┐  ┌─────────────┐  │     │  ┌────────────────────────────┐  │
│  │ Customer │  │ Admin Panel │  │────▶│  │     REST API (/api/*)       │  │
│  │ Pages    │  │ /admin/*    │  │     │  │  auth · menu · cart        │  │
│  └──────────┘  └─────────────┘  │     │  │  orders · favs · admin     │  │
│  ┌──────────────────────────┐   │     │  └────────────┬───────────────┘  │
│  │ AuthContext + CartContext│   │     │               │                   │
│  └──────────────────────────┘   │     │  ┌────────────▼───────────────┐  │
│  ┌──────────────────────────┐   │     │  │   Prisma ORM (PostgreSQL)  │  │
│  │ Axios (JWT interceptor)  │   │     │  └────────────────────────────┘  │
│  └──────────────────────────┘   │     └──────────────────────────────────┘
└─────────────────────────────────┘
```

---

## 2. Project Structure

```
Food website/
├── client/
│   └── src/
│       ├── api/               authApi, menuApi, cartApi, orderApi,
│       │                      favoritesApi, adminApi, axiosInstance
│       ├── components/
│       │   ├── layout/        Navbar, Footer, AdminLayout
│       │   ├── ui/            Button, Input, Badge, Modal, Spinner
│       │   ├── menu/          MenuCard, CategoryFilter
│       │   └── cart/          CartDrawer, CartItem
│       ├── context/           AuthContext, CartContext
│       ├── pages/
│       │   ├── customer/      HomePage, MenuPage, CheckoutPage,
│       │   │                  OrdersPage, OrderTrackingPage, FavoritesPage
│       │   ├── auth/          LoginPage, SignupPage
│       │   └── admin/         AdminDashboardPage, AdminOrdersPage,
│       │                      AdminMenuPage, AdminUsersPage
│       └── routes/            AppRouter, ProtectedRoute, AdminRoute
│
└── server/
    ├── src/
    │   ├── config/            db.js (Prisma singleton)
    │   ├── middleware/        auth, admin, error
    │   ├── modules/           auth, menu, cart, orders, favorites, admin
    │   │   └── [module]/      *.routes.js · *.controller.js · *.service.js
    │   └── utils/             jwt.utils, hash.utils, apiResponse
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    └── server.js
```

---

## 3. Database Schema

### Enums
```
Role:        CUSTOMER | ADMIN
OrderStatus: PENDING | PREPARING | ON_THE_WAY | DELIVERED | CANCELLED
```

### Tables & Relationships

```
User ──< Order ──< OrderItem >── MenuItem >── Category
User ──< CartItem >── MenuItem
User ──< Favourite >── MenuItem
Order ──< OrderStatusHistory
```

| Table | Key Fields |
|---|---|
| User | id, email, password (bcrypt), name, phone, address, role |
| Category | id, name, slug, imageUrl |
| MenuItem | id, name, description, price (Decimal), imageUrl, isAvailable, categoryId |
| CartItem | id, userId, menuItemId, quantity — unique(userId, menuItemId) |
| Order | id, userId, status, totalAmount, deliveryAddress, notes |
| OrderItem | id, orderId, menuItemId, quantity, **unitPrice** (price snapshot) |
| OrderStatusHistory | id, orderId, status, changedAt, changedBy |
| Favourite | id, userId, menuItemId — unique(userId, menuItemId) |

> `OrderItem.unitPrice` is copied from `MenuItem.price` at order creation time and never updated — this preserves accurate order history even if prices change later.

---

## 4. API Endpoints

### Auth — `/api/auth`
| Method | Path | Auth | Action |
|---|---|---|---|
| POST | `/register` | — | Create account, return JWT |
| POST | `/login` | — | Validate credentials, return JWT |
| GET | `/me` | JWT | Return current user |
| PUT | `/me` | JWT | Update profile |

### Menu — `/api/menu`
| Method | Path | Auth | Action |
|---|---|---|---|
| GET | `/categories` | — | List all categories |
| GET | `/items` | — | List items (query: category, search, page, limit) |
| GET | `/items/:id` | — | Single item |

### Cart — `/api/cart`
| Method | Path | Auth | Action |
|---|---|---|---|
| GET | `/` | JWT | Get user's cart |
| POST | `/` | JWT | Add/increment item (upsert) |
| PUT | `/:menuItemId` | JWT | Set quantity |
| DELETE | `/:menuItemId` | JWT | Remove one item |
| DELETE | `/` | JWT | Clear entire cart |

### Orders — `/api/orders`
| Method | Path | Auth | Action |
|---|---|---|---|
| POST | `/` | JWT | Place order (atomic transaction) |
| GET | `/` | JWT | List user's orders |
| GET | `/:id` | JWT | Single order with items + history |
| GET | `/:id/track` | JWT | Status + history (used for polling) |

### Favourites — `/api/favorites`
| Method | Path | Auth | Action |
|---|---|---|---|
| GET | `/` | JWT | List favourites |
| POST | `/` | JWT | Add favourite |
| DELETE | `/:menuItemId` | JWT | Remove favourite |

### Admin — `/api/admin` *(JWT + ADMIN role required)*
| Method | Path | Action |
|---|---|---|
| GET | `/dashboard` | Stats: revenue, orders today, active, users |
| GET | `/revenue` | Daily revenue for last 30 days (chart data) |
| GET | `/orders` | All orders paginated (filter by status) |
| PUT | `/orders/:id/status` | Update order status + append history row |
| GET | `/menu` | All menu items (including disabled) |
| POST | `/menu` | Create menu item |
| PUT | `/menu/:id` | Update menu item |
| DELETE | `/menu/:id` | Soft-disable (sets isAvailable = false) |
| GET | `/users` | List all users |

---

## 5. Key Implementation Decisions

### 5.1 Order Placement — Prisma Transaction
Order creation runs inside `prisma.$transaction()` to guarantee atomicity:

1. Read all CartItems for the user (with MenuItem prices)
2. Calculate total amount
3. Create Order record
4. Create all OrderItem records (with unitPrice snapshot)
5. Create first OrderStatusHistory entry (PENDING)
6. Delete all CartItems for the user
7. Return the complete order

If any step fails, the entire transaction rolls back — no orphaned orders.

### 5.2 Cart — Server-Side with Client Mirror
- Cart is stored in the database, not localStorage
- `CartContext` is an in-memory mirror of the server cart
- On login: fetches cart from API to hydrate context
- Every mutation (add/update/remove) hits the API immediately
- Benefit: cart persists across devices and browser sessions

### 5.3 Order Tracking — Polling
- `OrderTrackingPage` polls `GET /api/orders/:id/track` every 10 seconds
- Uses `setInterval` cleared in a `useEffect` cleanup to prevent memory leaks
- Polling stops automatically when status reaches DELIVERED or CANCELLED
- Simple and reliable — no WebSocket infrastructure needed

### 5.4 Admin Access Control — Two Layers
- **Frontend (`AdminRoute`):** reads `user.role` from AuthContext, redirects non-admins to `/`
- **Backend (`admin.middleware.js`):** checks `req.user.role === 'ADMIN'` on every request, returns 403 if not
- The backend check is authoritative — the frontend check is UX only

### 5.5 Price Snapshot
- `OrderItem.unitPrice` is written at order creation from `MenuItem.price`
- Historical orders always show the price at time of purchase
- Admin revenue calculations use `OrderItem.unitPrice`, never `MenuItem.price`

### 5.6 Axios Interceptors
- **Request:** attaches `Authorization: Bearer <token>` from localStorage
- **Response:** on 401, clears token and redirects to `/login` globally

---

## 6. React Route Map

```
/                         HomePage              public
/menu                     MenuPage              public
/checkout                 CheckoutPage          ProtectedRoute
/orders                   OrdersPage            ProtectedRoute
/orders/:id/track         OrderTrackingPage     ProtectedRoute
/favorites                FavoritesPage         ProtectedRoute
/login                    LoginPage             public
/signup                   SignupPage            public
/admin                    AdminDashboardPage    AdminRoute
/admin/orders             AdminOrdersPage       AdminRoute
/admin/menu               AdminMenuPage         AdminRoute
/admin/users              AdminUsersPage        AdminRoute
```

---

## 7. Design System

| Token | Value | Usage |
|---|---|---|
| Brand primary | `#ff5a1f` | Buttons, prices, active states |
| Dark | `#0f0f14` | Backgrounds, dark buttons |
| Background | `#fffbf7` | Page background (warm off-white) |
| Font (display) | Playfair Display | Headings, logo, hero text |
| Font (body) | Plus Jakarta Sans | All body text, UI labels |
| Border radius | `rounded-2xl` / `rounded-3xl` | Cards, inputs, buttons |
| Card shadow | `0 2px 16px rgba(15,15,20,0.08)` | All card surfaces |

---

## 8. Implementation Phases

### Phase 1 — Scaffolding
- `npm create vite@latest client -- --template react`
- `mkdir server && npm init -y`
- Install all dependencies (client + server)
- Configure Tailwind CSS, Vite proxy, server scripts

### Phase 2 — Database
- Write `prisma/schema.prisma` (8 models, 2 enums)
- Run `npx prisma migrate dev --name init`
- Write and run `prisma/seed.js` (6 categories, 23 items, 1 admin)

### Phase 3 — Backend
- Build Express app with CORS, JSON middleware, error handler
- Build `jwt.utils.js`, `hash.utils.js`, `apiResponse.js`
- Build `auth.middleware.js` and `admin.middleware.js`
- Implement 6 modules: auth → menu → cart → orders → favorites → admin

### Phase 4 — Frontend Foundation
- Build `AuthContext` (login, logout, hydrate from localStorage)
- Build `axiosInstance` (JWT attach, 401 auto-logout)
- Build `CartContext` (server-synced)
- Build `AppRouter` with `ProtectedRoute` and `AdminRoute`

### Phase 5 — Customer UI
- Shared atoms: Button, Input, Badge, Modal, Spinner
- Navbar (scroll-aware, glass effect), Footer (multi-column)
- MenuCard, CategoryFilter, CartDrawer, CartItem
- LoginPage, SignupPage (split-screen)
- HomePage (hero, categories, featured, features section)
- MenuPage (search + filter + pagination)
- CheckoutPage, OrderTrackingPage (stepper + polling), OrdersPage, FavoritesPage

### Phase 6 — Admin UI
- AdminLayout with dark collapsible sidebar
- AdminDashboardPage (stat cards + Recharts bar chart)
- AdminOrdersPage (table + status filter + inline update)
- AdminMenuPage (table + create/edit modal with toggle)
- AdminUsersPage (user list with role badges)

### Phase 7 — Design Polish
- Custom Tailwind theme (brand colours, fonts, shadows, radii)
- Google Fonts: Playfair Display + Plus Jakarta Sans
- Reduced all oversized emoji/icon sizes
- Responsive breakpoints: mobile-first, `md:` tablet, `lg:` desktop
- `react-hot-toast` notifications throughout

---

*RameTech Consultancy — 2026*
