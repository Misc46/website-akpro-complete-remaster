# Pull Request: DB-less Architecture & Admin Enhancements 🚀

## Overview
This PR introduces a major architectural shift to a "DB-less" approach for public-facing pages, significantly improving performance while maintaining ease of management through a Turso-backed Admin Dashboard.

## Key Changes

### 1. DB-less Architecture & Synchronization
- Reconfigured the public site to source data from high-performance local CSV and JSON files (`public/data/` and `app/data/`).
- Added a "Commit to Public" synchronization mechanism in the Admin Dashboard to sync live DB state to static files.
- Created `db:dump` script for local and automated synchronization.

### 2. FAQ Management Engine (New!)
- Implemented a full CRUD manager for FAQs in the Admin Dashboard.
- Created Turso database migration and seeding scripts for FAQ data.
- Automated FAQ synchronization to `app/data/faqs.json` during the dump process.

### 3. Admin OS Enhancements
- Added **FAQ Editor** tab to the dashboard.
- Replaced placeholder elements with official **AKPRO Branding** (Logo and Icons).
- Improved feedback messages for database synchronization tasks.

### 4. Performance Optimizations
- **Image Carousel**: Implemented neighbor-conditional lazy loading. Only the current, next, and previous images are rendered/loaded at any time, significantly reducing initial payload and memory usage.
- **Icon System**: Configured standard `manifest.json`, favicons, and apple-touch-icons for consistent brand identity across all platforms.

### 5. Branding & Assets
- Configured site-wide icons in `app/layout.tsx`.
- Updated `public/icons/site.webmanifest` with correct paths and metadata.

## Checklist
- [x] All `console.log` statements removed from production paths.
- [x] Types are strict (no `any` used in new features).
- [x] Error handling implemented for all new API routes.
- [x] Responsive on mobile.
- [x] Tested locally with `npm run dev`.

