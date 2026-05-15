# 🍱 Foodie — Client

> **Discover & Order Delicious Meals**

The frontend web application for **Foodie**, a full-stack meal ordering platform. Customers can browse menus, place orders, and track delivery status. Providers manage their menus and orders. Admins oversee the entire platform.

🌐 **Live Demo:** [foodie-client-one.vercel.app](https://foodie-client-one.vercel.app)
🔗 **Backend Repo:** [foodie_backend](https://github.com/AbdurRahman11072/foodie_backend)

---

## 🧰 Tech Stack

| Category        | Technology              |
| --------------- | ----------------------- |
| Framework       | Next.js 16 (App Router) |
| Language        | TypeScript              |
| Styling         | Tailwind CSS v4         |
| UI Components   | shadcn/ui + Radix UI    |
| Animations      | Framer Motion           |
| Forms           | React Hook Form + Zod   |
| Auth            | better-auth             |
| Data Tables     | TanStack Table          |
| Charts          | Recharts                |
| Package Manager | pnpm                    |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- pnpm `>= 10`

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdurRahman11072/foodieClient_test.git
cd foodieClient_test

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

---

## 👥 User Roles

| Role         | Description                | Key Capabilities                                        |
| ------------ | -------------------------- | ------------------------------------------------------- |
| **Customer** | Users who order meals      | Browse menus, place orders, track status, leave reviews |
| **Provider** | Food vendors / restaurants | Manage menu items, view & update orders                 |
| **Admin**    | Platform moderators        | Manage all users, oversee orders, moderate content      |

> Users select their role during registration. Admin accounts are seeded in the database.

---

## 📄 Pages & Routes

### Public Routes

| Route            | Page                                    |
| ---------------- | --------------------------------------- |
| `/`              | Home — hero, categories, featured meals |
| `/meals`         | Browse Meals — list with filters        |
| `/meals/:id`     | Meal Details — info & add to cart       |
| `/providers/:id` | Provider Profile — menu & info          |
| `/login`         | Login                                   |
| `/register`      | Registration                            |

### Customer Routes (Private)

| Route         | Page                        |
| ------------- | --------------------------- |
| `/cart`       | Shopping Cart               |
| `/checkout`   | Checkout — delivery address |
| `/orders`     | Order History               |
| `/orders/:id` | Order Details & status      |
| `/profile`    | Edit Profile                |

### Provider Routes (Private)

| Route                 | Page                       |
| --------------------- | -------------------------- |
| `/provider/dashboard` | Dashboard — orders & stats |
| `/provider/menu`      | Menu Management            |
| `/provider/orders`    | Order Management           |

### Admin Routes (Private)

| Route               | Page                |
| ------------------- | ------------------- |
| `/admin`            | Platform Dashboard  |
| `/admin/users`      | User Management     |
| `/admin/orders`     | All Orders          |
| `/admin/categories` | Category Management |

---

## 📁 Project Structure

```
foodieClient_test/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages & layouts
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utilities, auth config, API helpers
│   └── types/           # TypeScript type definitions
├── components.json      # shadcn/ui config
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔗 Related

- **Backend API:** [foodie_backend](https://github.com/AbdurRahman11072/foodie_backend) — Express + Prisma + PostgreSQL
- **API Base URL (production):** [foodie-backend-ruby.vercel.app](https://foodie-backend-ruby.vercel.app)

---

## 📜 License

This project is private and not licensed for public redistribution.
