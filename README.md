# Website AKPRO IME FTUI Remaster

Official academic and professional web portal for **Akademik dan Keprofesian (AKPRO) Ikatan Mahasiswa Elektro (IME) FTUI 2026**.

The platform is designed to provide electrical, computer, and biomedical engineering students at Universitas Indonesia with centralized, lightning-fast access to study materials, past exams, tutoring/mentorship sessions, academic utilities, and institutional resources.

---

## 🚀 Architecture & Core Features

- **⚡ Blazing Fast Static Delivery**: Hybrid build architecture compiling relational database entries into edge-cached static artifacts with zero client-side database latency.
- **📚 Diktat & Exam Archive (`/diktat`)**: Search, filter, and access past examination papers, curated question banks, and course summaries across academic years, semesters (Ganjil/Genap), exam periods (UTS/UAS), and study programs (Elektro, Komputer, Biomedik).
- **🗓️ Asistensi & Mentorship Hub (`/asistensi`)**: Schedule explorer with list and interactive calendar views for tutorial sessions, Zoom meeting links, speaker details, and recorded session archives.
- **🧰 Academic Toolbox & Direct Links**: Curated academic portals, syllabus archives, UI/FTUI utilities, and resource directories.
- **❓ FAQ Engine**: Interactive search and answers for frequently asked academic & administrative questions.
- **🔐 Dedicated Admin OS (`/admin`)**:
  - Secure JWT & bcrypt authenticated admin panel.
  - Complete CRUD management for Diktat records, Asistensi sessions, FAQs, and Toolbox items.
  - One-click live site synchronization and Cloudflare Pages deployment webhook integration.

---

## 🛠️ Tech Stack

### Frontend & Framework
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core**: React 19, TypeScript 5
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Parsing**: PapaParse

### Backend & Database
- **Database**: [Turso Database](https://turso.tech/) (Managed distributed LibSQL / SQLite)
- **ORM & Client**: [Drizzle ORM](https://orm.drizzle.team/) & `@libsql/client`
- **Auth & Security**: `jose` (JWT) & `bcryptjs`
- **Edge Storage**: Cloudflare KV bindings for live edge overrides

### Deployment & Hosting
- **Platform**: [Cloudflare Pages](https://pages.cloudflare.com/) (`@cloudflare/next-on-pages` / Wrangler)

---

## 📂 Project Structure

```
├── app/
│   ├── admin/                # Admin OS dashboard, managers, and login
│   ├── api/admin/            # Secure Edge & serverless API routes (auth, CRUD, sync)
│   ├── asistensi/            # Asistensi schedule & calendar page
│   ├── components/           # UI components (Hero, Navbar, Layout, FilterSelector, etc.)
│   ├── data/                 # Bundled build-time JSON caches (diktats, asistensi, faqs)
│   ├── diktat/               # Diktat archive & study resources page
│   ├── lib/                  # Shared utilities, data fetchers, and theme context
│   ├── globals.css           # Global Tailwind CSS styles and theme variables
│   ├── layout.tsx            # Root layout and metadata
│   └── page.tsx              # Home portal page
├── public/                   # Static assets, branding logos, and CSV dumps
├── scripts/                  # Turso database dump scripts and migration utilities
├── wrangler.toml             # Cloudflare Pages & KV configuration
└── package.json
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: 20+ installed
- **Package Manager**: `npm`, `pnpm`, or `bun`

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Database (Turso)
TURSO_DATABASE_URL="libsql://your-turso-db.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# Authentication
JWT_SECRET="your-secure-random-secret-key"
ADMIN_PASSWORD_HASH="bcrypt-hashed-admin-password"

# Live Deployment Hook (Optional - for admin one-click build trigger)
CLOUDFLARE_DEPLOY_HOOK="https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/..."
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed / Dump Database to Local Cache
Before building or running locally, sync latest data from Turso to generate local JSON caches:
```bash
npm run db:dump
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Build & Deployment

### Production Build
```bash
npm run build
```
*Note: `npm run build` will automatically run `npm run db:dump` before building the Next.js static output.*

### Deploying to Cloudflare Pages
```bash
npm run pages:deploy
```
Or connect your GitHub repository directly to **Cloudflare Pages** using the build settings:
- **Build command**: `npm run build`
- **Output directory**: `.vercel/output/static`

---

## 📄 License

Maintained with 💙 by **Bidang Akademik dan Keprofesian (AKPRO) IME FTUI 2026**.
