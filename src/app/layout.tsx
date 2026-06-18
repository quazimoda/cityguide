import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: siteConfig.name,
    description: siteConfig.description
  },
  icons: {
    icon: '/icon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
