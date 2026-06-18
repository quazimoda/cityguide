import { Hero } from '@/components/Hero';
import { Container } from '@/components/Container';
import { SectionHeader } from '@/components/SectionHeader';
import { GuideCard } from '@/components/GuideCard';
import { BlogCard } from '@/components/BlogCard';
import { RecommendationCard } from '@/components/RecommendationCard';
import { SubscribeForm } from '@/components/SubscribeForm';
import { EditorialFeatureCard, ImageCard } from '@/components/EditorialCards';
import { HorizontalCardScroller } from '@/components/HorizontalCardScroller';
import { guides } from '@/data/guides';
import { blogPosts } from '@/data/blog';
import { recommendations } from '@/data/recommendations';
import { istanbulImages } from '@/data/media';
import { JsonLd, websiteJsonLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Istanbul Travel Guides, Local Tips, and City Planning',
  description:
    'Plan Istanbul with editorial guides for ferries, neighborhoods, food walks, student life, classic sights, and practical first visits.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Istanbul Travel Guides, Local Tips, and City Planning',
    description:
      'Editorial Istanbul guides for realistic routes, neighborhoods, ferries, food, culture, and student-friendly city life.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Istanbul Travel Guides, Local Tips, and City Planning',
    description:
      'Plan Istanbul with editorial local guides for sights, ferries, food, neighborhoods, and student life.',
  },
};

const destinations = [
  { title: 'Historic Peninsula', description: 'Classic monuments, mosque etiquette, cisterns, parks, and slow old-city routes.', href: '/guides/best-places-to-visit/sultanahmet-classics', image: istanbulImages.suleymaniyeClassic, meta: 'Old city' },
  { title: 'Beyoğlu & Karaköy', description: 'Side streets, ferry piers, Galata views, cafés, and walkable cultural layers.', href: '/guides/hidden-gems/quiet-viewpoints', image: istanbulImages.galataTowerStreet, meta: 'European side' },
  { title: 'Asian Side', description: 'Kadıköy food walks, market streets, Moda pauses, and ferry-first day plans.', href: '/guides/cafes-and-restaurants/kadikoy-local-eats', image: istanbulImages.ferryKadikoyDeck, meta: 'Kadıköy' },
  { title: 'Bosphorus', description: 'Waterfront culture, palace days, viewpoints, and scenic public transport logic.', href: '/guides/best-places-to-visit/bosphorus-museums-palaces', image: istanbulImages.bosphorusSkyline, meta: 'Waterfront' },
];

const experiences = [
  { title: 'First-Time Istanbul', description: 'Start with realistic routes that avoid checklist fatigue.', href: '/guides/weekend-routes/48-hours-first-time', image: istanbulImages.weekendSunset, eyebrow: 'Start here' },
  { title: 'Ferry Experiences', description: 'Use the Bosphorus as transport, reset, and skyline viewpoint.', href: '/guides/transportation-tips/istanbulkart-ferry-basics', image: istanbulImages.ferryTeaDeck, eyebrow: 'Move well' },
  { title: 'Cafés & Food', description: 'Neighborhood mornings, casual dining, student budgets, and local-feeling streets.', href: '/guides/cafes-and-restaurants/cozy-cafes-slow-mornings', image: istanbulImages.rainyCafeLights, eyebrow: 'Taste' },
  { title: 'Student-Friendly Istanbul', description: 'Affordable routines, study spaces, transport habits, and everyday city confidence.', href: '/guides/student-friendly-istanbul/affordable-student-besiktas', image: istanbulImages.cafeTable, eyebrow: 'Live' },
];

export default function Home() {
  const featuredGuides = guides.slice(0, 3);
  const featuredBlogPosts = blogPosts.slice(0, 3);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <Hero
        title="Istanbul, planned with local rhythm"
        subtitle="Editorial city guides for ferries, neighborhoods, culture, student life, food walks, and realistic first visits — polished, practical, and never rushed."
        video={{ src: '/videos/istanbul-flight-hero.mp4', poster: '/images/istanbul-flight-hero-poster.jpg' }}
        ctas={[{ label: 'Start with guides', href: '/guides' }, { label: 'Search the city', href: '/search' }]}
      />

      <section className="bg-orange-50 py-14 md:py-20">
        <Container>
          <SectionHeader eyebrow="Start here" title="Choose your Istanbul pace" description="Browse the city by destination, experience, or practical need — with compact routes that keep the homepage editorial rather than commercial." />
          <div className="grid gap-5 lg:grid-cols-2">
            <EditorialFeatureCard title="A first weekend that still leaves room for tea" description="Pair classic sights with ferry views and neighborhood pauses instead of packing every hour." href="/guides/weekend-routes/48-hours-first-time" image={istanbulImages.weekendSunset} eyebrow="Featured route" />
            <EditorialFeatureCard title="Waterfront culture along the Bosphorus" description="Museums, palaces, shoreline walks, and ferries shaped into a calmer culture day." href="/guides/best-places-to-visit/bosphorus-museums-palaces" image={istanbulImages.karakoyFerrySunset} eyebrow="Culture day" />
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <SectionHeader eyebrow="Destinations" title="Explore Istanbul by area" description="Image-led neighborhood paths inspired by modern destination guides, linked only to existing City Advisor content." />
        <HorizontalCardScroller>{destinations.map((item) => <div className="w-[82vw] shrink-0 snap-start sm:w-auto" key={item.title}><ImageCard {...item} /></div>)}</HorizontalCardScroller>
      </Container>

      <section className="bg-slate-950 py-14 text-white md:py-20">
        <Container>
          <SectionHeader eyebrow="Experiences" title="Find the city by mood" description="Ferries, food, culture, student life, and budget-smart planning presented as immersive entry points." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{experiences.map((item) => <ImageCard key={item.title} {...item} />)}</div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <SectionHeader eyebrow="Guides" title="Featured planning guides" description="Helpful planning articles for confident Istanbul days, upgraded with richer cards and stronger hover states." />
        <div className="grid gap-6 md:grid-cols-3">{featuredGuides.map((g) => <GuideCard key={g.slug} guide={g} />)}</div>
      </Container>

      <section className="bg-white py-14 md:py-20">
        <Container>
          <SectionHeader eyebrow="Stories" title="Latest city notes" description="Fresh practical ideas for discovering Istanbul through an editorial travel-guide lens." />
          <div className="grid gap-6 md:grid-cols-3">{featuredBlogPosts.map((p) => <BlogCard key={p.slug} post={p} />)}</div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <div className="rounded-[2rem] bg-gradient-to-br from-orange-100 via-white to-teal-100 p-6 shadow-sm ring-1 ring-orange-100 md:p-10">
          <SectionHeader eyebrow="Planning" title="Compact local recommendations" description="Secondary, useful ideas that support the guides without turning the homepage into a booking portal." />
          <div className="grid gap-5 md:grid-cols-4">{recommendations.slice(0, 4).map((r) => <RecommendationCard key={r.slug} recommendation={r} />)}</div>
        </div>
      </Container>

      <Container>
        <SubscribeForm />
      </Container>
    </>
  );
}
