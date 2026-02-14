import HomePageClient from './HomePageClient';
import { fetchResourceCategories, fetchFaqData } from './lib/dataFetcher';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function HomePage() {
  const resourceCategories = await fetchResourceCategories();
  const faqs = await fetchFaqData();

  return <HomePageClient resourceCategories={resourceCategories} faqs={faqs} />;
}