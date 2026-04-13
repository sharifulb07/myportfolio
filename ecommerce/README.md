# MVP Store (Production-Ready eCommerce MVP)

Secure full-stack eCommerce MVP built with:

- **Next.js 15 (App Router + Route Handlers)**
- **React Server Components + TypeScript + TailwindCSS**
- **MongoDB + Mongoose**
- **JWT auth in secure HTTP-only cookies**
- **Cloudinary image upload pipeline**
- **Cash on Delivery (COD) only checkout**

---

## 1) Full project architecture

### Frontend

- `app/page.tsx` → Home page
- `app/products/page.tsx` → Product list with search/filter (SSR)
- `app/product/[slug]/page.tsx` → Product details + dynamic SEO metadata + JSON-LD
- `app/(shop)/cart/page.tsx` → Persistent customer cart
- `app/(shop)/checkout/page.tsx` → COD checkout
- `app/(shop)/orders/page.tsx` → Order history / tracking
- `app/login/page.tsx`, `app/register/page.tsx` → Auth pages
- `app/admin/page.tsx` → Admin dashboard and order management

### Backend

- Route handlers in `app/api/**` (Node.js runtime)
- REST-style endpoints for auth/products/cart/orders/admin

### Shared core

- `lib/mongodb.ts` → DB connection pooling
- `lib/auth.ts` → bcrypt + JWT sign/verify
- `lib/cloudinary.ts` → secure Cloudinary upload wrapper
- `lib/logger.ts`, `lib/audit.ts` → structured logging + DB log events
- `middleware.ts` + `middleware/rateLimiter.ts` + `middleware/authMiddleware.ts` → security middleware and role guards

---

## 2) MongoDB schema design

### Collections

- **Users** (`models/User.ts`)
  - `name`, `email (unique)`, `passwordHash`, `role`, `lastLoginAt`, timestamps
- **Products** (`models/Product.ts`)
  - `title`, `slug (unique)`, `description`, `category`, `price`, `discountPrice`, `stock`, `images[]`, `rating`, timestamps
- **Orders** (`models/Order.ts`)
  - `userId`, `products[]`, `totalPrice`, `shippingAddress`, `phone`, `paymentMethod=COD`, `orderStatus`, timestamps
- **Cart** (`models/Cart.ts`)
  - `user`, `items[]` (product ref, quantity, price snapshot), timestamps
- **Categories** (`models/Category.ts`)
  - `name`, `slug`, timestamps
- **Logs** (`models/Log.ts`)
  - `level`, `event`, `message`, `meta`, timestamps

---

## 3) API route implementations

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/csrf`

### Products

- `GET /api/products` (search/filter/pagination)
- `POST /api/products` (admin create)
- `GET /api/products/[id]`
- `PUT /api/products/[id]` (admin update)
- `DELETE /api/products/[id]` (admin delete)
- `GET /api/products/slug/[slug]`

### Cart

- `GET /api/cart`
- `POST /api/cart` (add/update item)
- `PATCH /api/cart/item/[productId]` (quantity update)
- `DELETE /api/cart/item/[productId]`

### Orders

- `GET /api/orders` (customer orders)
- `POST /api/orders` (checkout with COD)
- `GET /api/orders/[id]` (owner/admin)

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders`
- `POST /api/admin/upload` (Cloudinary image upload)
- `GET /api/admin/logs`

---

## 4) Authentication flow

1. Register/login validates payload with Zod
2. Password hashed with bcrypt
3. JWT issued and stored in **HTTP-only secure cookie** (`auth_token`)
4. Role (`ADMIN` / `CUSTOMER`) embedded in JWT claims
5. Protected routes use `requireAuth` / `requireRole`
6. CSRF token issued (`/api/auth/csrf`) and validated for state-changing requests

---

## 5) Secure Cloudinary upload

- Upload endpoint: `POST /api/admin/upload`
- Admin-only + CSRF-protected
- Validates:
  - MIME type must start with `image/`
  - Max size: `5MB`
  - Base64 payload structure
- Cloudinary transforms and optimizes image
- Stores `secure_url` in product document

---

## 6) Logging system

- Structured JSON logs via `pino` (`lib/logger.ts`)
- Persistent log events in MongoDB `Logs` collection (`lib/audit.ts`)
- Tracks:
  - API/security events
  - failed login attempts
  - order creation / status changes
  - error events

---

## 7) Admin dashboard structure

`/admin` page includes:

- KPI cards: users, products, orders, pending orders
- Product creation form
- Order status management (`PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`)

---

## 8) Production security checklist

- [x] Password hashing (`bcryptjs`)
- [x] JWT auth with secure cookie
- [x] HTTP-only auth cookie
- [x] CSRF protection (double-submit token)
- [x] Rate limiting middleware
- [x] Helmet-style security headers (CSP, X-Frame-Options, etc.)
- [x] Zod input validation
- [x] MongoDB query sanitization (`mongo-sanitize`)
- [x] XSS sanitization (`xss`)
- [x] API request validation
- [x] CORS protection in middleware
- [x] Environment variable isolation (`.env`, `.env.example`)

---

## 9) Example API requests

### Register

- `POST /api/auth/register`
- Body:
  - `name`, `email`, `password`

### Login

- `POST /api/auth/login`
- Body:
  - `email`, `password`

### Create product (Admin)

- `POST /api/products`
- Headers:
  - `Content-Type: application/json`
  - `X-CSRF-Token: <csrf_token>`
- Body:
  - `title`, `slug`, `description`, `category`, `price`, `discountPrice`, `stock`, `images[]`, `rating`

### Add to cart

- `POST /api/cart`
- Headers:
  - `X-CSRF-Token: <csrf_token>`
- Body:
  - `productId`, `quantity`

### COD checkout

- `POST /api/orders`
- Headers:
  - `X-CSRF-Token: <csrf_token>`
- Body:
  - `shippingAddress`, `phone`, `paymentMethod: "COD"`

---

## 10) Folder structure with explanations

- `app/` → App Router pages
  - `(shop)/` → customer pages (cart/checkout/orders)
  - `product/` → product detail page
  - `api/` → REST route handlers
- `lib/` → infrastructure helpers (DB, auth, cloud, logging, security)
- `middleware/` → auth guards + rate limiter utilities
- `models/` → Mongoose schemas
- `utils/` → validators, response format, sanitizers
- `types/` → custom module typings

---

## Bonus pages included

- ✅ Home Page
- ✅ Product List
- ✅ Product Detail
- ✅ Cart Page
- ✅ Checkout (COD)
- ✅ Login / Register
- ✅ Orders Page
- ✅ Admin Dashboard

---

## Local setup

1. Install dependencies

- `pnpm install`

2. Configure env
   - Copy `.env.example` to `.env`
   - Fill secrets
3. Start dev server

- `pnpm dev`

Windows PowerShell note:

- If execution policy blocks `pnpm.ps1`, run `pnpm.cmd` instead.

## Required env vars

- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `CORS_ORIGIN`
- `NODE_ENV`

---

## Deployment (Vercel)

1. Push repository
2. Import into Vercel
3. Set environment variables in project settings
4. Deploy

> Use a managed MongoDB cluster and Cloudinary production credentials in Vercel.
