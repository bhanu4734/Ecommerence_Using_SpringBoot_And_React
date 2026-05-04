# Frontend Application

A premium, highly interactive frontend for the Nexus E-Commerce platform. Built with a focus on aesthetics, smooth animations, and a seamless user experience.

## 🚀 Tech Stack

- **Core:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API

## ✨ Key Features

- **Premium UI/UX:** Clean "Slate & Blue" aesthetic utilizing modern glassmorphism, soft shadows, and rounded interfaces.
- **Role-Based Routing:**
  - **User Portal:** Clean Top-Navbar navigation, product browsing, dynamic cart, and checkout flow.
  - **Admin Dashboard:** Collapsible side-navigation, statistical overviews, and data tables for managing inventory and orders.
- **Fluid Animations:** Page transitions, list staggering, hover micro-interactions, and animated modals powered by Framer Motion.
- **Responsive Design:** Fully mobile-optimized layout, including a slide-out hamburger menu for mobile users.
- **Centralized API Services:** All backend calls are abstracted into clean, reusable service classes.

## 📂 Project Structure

```text
src/
├── components/
│   ├── auth/         # ProtectedRoute logic
│   ├── layout/       # Navbar, Footer, UserLayout, AdminLayout
│   └── ui/           # Reusable generic components (Button, Card, Modal, etc.)
├── context/          # AuthContext for global user state
├── hooks/            # useCartContext for cart management
├── pages/
│   ├── admin/        # Admin-specific pages (Dashboard, Products, Users)
│   └── user/         # Customer-facing pages (Home, Shop, Cart)
├── services/         # Axios configuration and API wrappers
└── index.css         # Global Tailwind directives
```

## ⚙️ Setup & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:8081/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.
   Vite's proxy is configured to route `/api` requests to the backend at port `8081` to bypass CORS issues during local development.

## 🎨 Design System

The application strictly uses Tailwind CSS utility classes. Custom configurations (like primary colors, custom box-shadows for glass effects, and animation keyframes) are centrally defined in `tailwind.config.js`. 
