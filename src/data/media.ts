import type { ImageAsset } from '@/types/media';

export const istanbulImages = {
  ferryView: {
    src: 'https://images.unsplash.com/photo-1741198166163-99230d4b5b50?auto=format&fit=crop&q=80&w=1600',
    alt: 'Galata Tower and Istanbul waterfront seen from a ferry on the Bosphorus',
    photographer: 'Ilker Ozmen',
    photographerUrl: 'https://unsplash.com/@iozmen',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/view-of-istanbul-from-a-boat-S4h9xubtlrA',
  },
  skylineWater: {
    src: 'https://images.unsplash.com/photo-1741201373811-bb3ba82a2c8a?auto=format&fit=crop&q=80&w=1600',
    alt: 'Istanbul skyline across blue water under a soft daytime sky',
    photographer: 'Musa Ortaç',
    photographerUrl: 'https://unsplash.com/@musaortac',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/istanbul-turkey-city-skyline-over-blue-water-HTYVcVNyGvU',
  },
  balatStreet: {
    src: 'https://images.unsplash.com/photo-1752434213275-0f4d4b5c2b9b?auto=format&fit=crop&q=80&w=1600',
    alt: 'Colorful Balat buildings lining a quiet cobblestone street in Istanbul',
    photographer: 'Mehmet Uzut',
    photographerUrl: 'https://unsplash.com/@mehmetuzut',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/colorful-buildings-line-a-cobblestone-street-in-istanbul-x2LHkofyOoY',
  },
  marketStreet: {
    src: 'https://images.unsplash.com/photo-1666601082513-ba83b4f90c32?auto=format&fit=crop&q=80&w=1600',
    alt: 'Copperware and tea glasses displayed outside a shop on an Istanbul market street',
    photographer: 'Filiz Elaerts',
    photographerUrl: 'https://unsplash.com/@filizelaerts',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/a-shop-with-many-items-lPAEtvomtAk',
  },
  ferryDock: {
    src: 'https://images.unsplash.com/photo-1771622218533-7f2c8ee8d89e?auto=format&fit=crop&q=80&w=1600',
    alt: 'Passengers boarding a ferry at an Istanbul dock in black and white',
    photographer: 'ONUR KURT',
    photographerUrl: 'https://unsplash.com/@bykurt',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/people-boarding-a-ferry-at-a-dock-VG0T2IpZSDc',
  },
  rainyCafe: {
    src: 'https://images.unsplash.com/photo-1734715221889-734a3f32edfd?auto=format&fit=crop&q=80&w=1600',
    alt: 'Warm cafe and restaurant lights glowing on a rainy Istanbul street at night',
    photographer: 'Tolga Ahmetler',
    photographerUrl: 'https://unsplash.com/@t_ahmetler',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/a-building-with-a-bunch-of-lights-hanging-from-its-roof-8KtuK1AoWww',
  },
} satisfies Record<string, ImageAsset>;

export const imageRotation = Object.values(istanbulImages);
