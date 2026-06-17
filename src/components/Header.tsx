import Link from 'next/link';
import { Container } from './Container';

const links = [['/', 'Home'], ['/about', 'About'], ['/guides', 'Guides'], ['/blog', 'Blog'], ['/search', 'Search'], ['/contact', 'Contact']];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/90 shadow-sm shadow-slate-950/5 backdrop-blur-xl">
      <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-xl font-black tracking-tight text-teal-900 transition hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300">City Advisor Istanbul</Link>
        <nav className="flex flex-wrap gap-1 text-sm font-bold text-gray-700" aria-label="Main navigation">
          {links.map(([href, label]) => <Link className="rounded-full px-3 py-2 transition hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300" key={href} href={href}>{label}</Link>)}
        </nav>
      </Container>
    </header>
  );
}
