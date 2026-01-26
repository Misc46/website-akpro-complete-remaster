This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## OPTIMIZATIONS

The current data loading process follows an **N+1 Fetch Pattern**, where a master CSV is fetched first, followed by sequential fetches for each item's details. This leads to significant latency. Below are strategies to optimize performance:

### 1. Parallel Data Fetching
Instead of fetching secondary CSVs one by one in a loop, use `Promise.all()` to trigger all network requests simultaneously.
*   **Implementation:** Map the master rows to a list of promises and await them once.

### 2. Next.js Data Fetching (ISR/SSG)
Since the data in Google Sheets changes infrequently, use **Incremental Static Regeneration (ISR)**.
*   **Strategy:** Fetch data during build time or in the background on the server.
*   **Benefit:** Reduces client-side load time to near zero as data is served from a cache/CDN.

### 3. Client-Side Caching (SWR or React Query)
Utilize libraries like `swr` or `@tanstack/react-query` to manage data fetching state.
*   **Benefit:** Provides out-of-the-box caching, background revalidation (Stale-While-Revalidate), and deduplication of requests.

### 4. Optimize CSV Parsing
Currently, the application uses a custom `parseCsv` utility.
*   **Improvement:** Use `PapaParse`, which is highly optimized for performance and can handle large CSV files without blocking the main thread.

### 5. Backend Consolidation
If possible, consolidate multiple Google Sheet tabs into a single "Publish" sheet.
*   **Benefit:** Reduces the number of HTTP requests from $N+1$ to exactly $1$.

### 6. Perceived Performance
Implement **Skeleton Screens** or **Progressive Image Loading**.
*   **Benefit:** Users see the structure of the page immediately, reducing the frustration of waiting for a blank screen or a spinner.

### 7. Local Database (SQLite)
Transition from remote CSV fetching to a local SQLite database.
*   **Strategy:** Use a build-time script or a GitHub Action to fetch Google Sheets data once and populate a `.sqlite` file in the project. The Next.js application then queries this file using an ORM like **Prisma** or **Drizzle**.
*   **Benefit:** 
    *   **Near-Instant Reads:** SQLite reads are orders of magnitude faster than network-bound CSV fetches.
    *   **Relational Power:** Easily handle complex relationships between Diktat, Asistensi, and Courses.
    *   **Offline Support:** No reliance on Google Sheets availability during runtime.
    *   **Simplified Logic:** Replace complex CSV parsers and array filters with declarative SQL queries (`WHERE major = 'elektro'`).

### 8. Cloud Database (Production Grade API)
For 24/7 availability and ultra-low latency, move away from CSV files to a managed cloud database.
*   **Options:**
    *   **Turso (LibSQL):** An edge-hosted version of SQLite. Perfect for this project because it's extremely fast and fits the "minimal configuration" vibe.
    *   **Supabase (Postgres):** A powerful relational database that also provides a built-in REST API and real-time features.
    *   **MongoDB Atlas (NoSQL):** Great if your data structure becomes more nested and document-like over time.
    *   **Upstash (Redis):** If you only need a super-fast cache layer on top of Google Sheets.
*   **Strategy:** Create a simple synchronization script that triggers via a Webhook (e.g., when you edit the Google Sheet) to update your Cloud DB.
*   **Benefit:** Zero-loading time for users, better security, and true 24/7 uptime without relying on Google Sheets' public CSV export availability.

## RECOMMENDED FOR SCALE & COST (FREE TIER)

Since you have hundreds of active users and want to keep it "Free," the best path is:

### 1. **The "Static Hybrid" Approach (Next.js ISR + SQLite)**
*   **Cost:** $0
*   **Performance:** ~10ms (Instant)
*   **How:** Use Next.js **Incremental Static Regeneration**. Every time someone visits the page, they get a cached version. The cache updates in the background (e.g., every 60 seconds). You don't even need a database; you can just fetch the CSVs on the server side once per minute instead of once per user. Vercel handles the heavy lifting.

### 2. **Turso (Managed SQLite)**
*   **Cost:** $0 (Free tier is massive)
*   **Scale:** Their free tier allows **1 billion row reads** and **25 million row writes** per month.
*   **Why:** You can have hundreds of active users performing complex searches, and you will never hit the limit for a project of this size. It's the most "bulletproof" free database right now.

### 3. **Supabase (Self-Hosting potential)**
*   **Cost:** $0 (Free tier includes 500MB, plenty for text data)
*   **Scale:** Very high. Thousands of active users can query it simultaneously via their PostgREST API.

### **Final Verdict:**
If you want the absolute best speed for $0 with hundreds of users, **Option 1 (ISR)** is your best friend. It makes your site's speed independent of your database speed.
