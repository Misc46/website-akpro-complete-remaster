# Website AKPRO IME FTUI Remaster

Academic and professional web portal for Departemen Akademik dan Keprofesian (AKPRO) Ikatan Mahasiswa Elektro (IME) FTUI.

This platform provides centralized access to academic archives, past examination papers, tutoring and mentorship schedules, reference toolboxes, and departmental administrative systems.

---

## Architecture & Features

- **Static Pre-Rendering & Edge Delivery**: Employs a build-time pre-rendering strategy that queries the Turso database and bundles data into localized JSON artifacts, eliminating runtime database latency for end users while supporting Cloudflare KV bindings for dynamic overrides.
- **Diktat & Examination Repository (`/diktat`)**: Search, filter, and access study materials and past exam problems categorized by academic year, semester (Ganjil/Genap), exam phase (UTS/UAS), and major (Teknik Elektro, Teknik Komputer, Teknik Biomedik).
- **Asistensi & Mentorship Management (`/asistensi`)**: Schedule directory with dual list and interactive calendar interfaces, displaying session dates, meeting links, tutor profiles, and video recordings.
- **Academic Toolbox (`/`)**: Aggregated directory of institutional links, faculty portals, course syllabi, and engineering utilities.
- **FAQ Knowledge Base (`/`)**: Queryable repository of academic and administrative guidelines.
- **Administrative Portal (`/admin`)**:
  - JWT-based authentication using HTTP-only cookies and bcrypt password hashing.
  - CRUD operations for Diktat records, Asistensi sessions, FAQs, and Toolbox items.
  - Administrative webhook integration to trigger on-demand static rebuilds and cache invalidation.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19, TypeScript 5
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Parsing**: PapaParse

### Backend & Storage
- **Database**: Turso (Distributed LibSQL / SQLite)
- **ORM / Client**: Drizzle ORM & `@libsql/client`
- **Authentication**: `jose` (JWT) & `bcryptjs`
- **Edge Storage**: Cloudflare KV Namespace bindings

### Deployment & Runtime
- **Platform**: Cloudflare Pages (`@cloudflare/next-on-pages` / OpenNext)

---

## Directory Structure

```
├── app/
│   ├── admin/                # Admin portal pages and management interfaces
│   ├── api/admin/            # Edge and serverless route handlers (auth, CRUD, sync)
│   ├── asistensi/            # Asistensi schedule and calendar views
│   ├── components/           # UI components and layout structures
│   ├── data/                 # Pre-compiled JSON datasets for static bundling
│   ├── diktat/               # Diktat repository and filtering interface
│   ├── lib/                  # Shared utilities, fetchers, and context providers
│   ├── globals.css           # Global Tailwind CSS configurations
│   ├── layout.tsx            # Root layout wrapper
│   └── page.tsx              # Index route
├── public/                   # Static assets, branding vectors, and CSV backups
├── scripts/                  # Turso data dump scripts and schema migrations
├── wrangler.toml             # Cloudflare Pages and KV namespace configuration
└── package.json
```

---

## Development Setup

### Prerequisites
- Node.js version 20 or higher
- Package manager (`npm`, `pnpm`, or `bun`)

### Configuration
Create a `.env` file in the project root:

```env
# Database Configuration
TURSO_DATABASE_URL="libsql://<database-name>.turso.io"
TURSO_AUTH_TOKEN="<turso-auth-token>"

# Authentication
JWT_SECRET="<jwt-secret-key>"
ADMIN_PASSWORD_HASH="<bcrypt-hash>"

# Deployment Webhook (Optional)
CLOUDFLARE_DEPLOY_HOOK="https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<hook-id>"
```

### Installation
```bash
npm install
```

### Database Synchronization
Generate the local pre-rendered JSON data files from Turso:
```bash
npm run db:dump
```

### Local Execution
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

---

## Build & Deployment

### Production Build
```bash
npm run build
```
The build pipeline executes `npm run db:dump` to fetch fresh database state before running `next build`.

### Cloudflare Pages Deployment
```bash
npm run pages:deploy
```
For Git-integrated Cloudflare Pages deployments, use the following project parameters:
- **Build command**: `npm run build`
- **Build output directory**: `.vercel/output/static`

---

## License & Maintenance

Maintained by Departemen Akademik dan Keprofesian (AKPRO) IME FTUI.
