import Link from 'next/link';

import { Container } from './Container';
import { SocialIcon } from './SocialIcon';
import { siteConfig } from '@/lib/site';

const navLinks = [
  { href: '/guides', label: 'City Guides' },
  { href: '/blog', label: 'Blog' },
  { href: '/search', label: 'Search' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { key: 'instagram', label: 'Instagram', href: siteConfig.social.instagram },
  { key: 'facebook', label: 'Facebook', href: siteConfig.social.facebook },
  { key: 'x', label: 'X', href: siteConfig.social.x },
  { key: 'youtube', label: 'YouTube', href: siteConfig.social.youtube },
  { key: 'tiktok', label: 'TikTok', href: siteConfig.social.tiktok },
  { key: 'linkedin', label: 'LinkedIn', href: siteConfig.social.linkedin },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 overflow-hidden bg-slate-950 text-white">
      <Container className="relative py-12">
        <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
          <div>
            <p className="text-2xl font-black tracking-tight">{siteConfig.name}</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{siteConfig.slogan}. Editorial, practical Istanbul guidance for visitors, students, and new residents.</p>
          </div>
          <nav aria-label="Footer navigation" className="grid gap-3 text-sm font-semibold text-slate-200">
            {navLinks.map((link) => <Link key={link.href} href={link.href} className="transition hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-300">{link.label}</Link>)}
          </nav>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-200">Follow</p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((link) => (
                <Link key={link.key} href={link.href} aria-label={link.label} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <SocialIcon name={link.key} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
      </Container>
    </footer>
  );
}
