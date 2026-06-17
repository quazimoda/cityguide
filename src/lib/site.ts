export const siteConfig = {
  name: 'City Advisor Istanbul',
  slogan: 'Your Smart Guide to Living, Studying, and Exploring Istanbul',
  description: 'Local Istanbul guides for tourists, students, and expats.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://city-advisor-istanbul.vercel.app',
  social: {
    instagram: '#',
    facebook: '#',
    x: '#',
    youtube: '#',
    tiktok: '#',
  },
} as const;
