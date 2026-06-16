export type ExperienceOfferKey =
  | 'ferryPhoto'
  | 'firstTimeWalk'
  | 'budgetWalk'
  | 'neighborhoodWalk'
  | 'transitOrientation'
  | 'cafeNeighborhoodWalk';

export type ExperienceOffer = {
  key: ExperienceOfferKey;
  offerName: string;
  shortDescription: string;
  price: '€125';
  duration: '3 hours';
  buttonLabel: string;
  defaultMessage: string;
};

const shared = {
  price: '€125',
  duration: '3 hours',
  defaultMessage: 'I want to book this experience.',
} as const;

export const experienceOffers = {
  ferryPhoto: {
    key: 'ferryPhoto',
    offerName: 'Istanbul Ferry Photo & Reel Experience',
    shortDescription:
      'Capture cinematic ferry photos and reels on a 3-hour Bosphorus route with simple phone-friendly shooting guidance.',
    buttonLabel: 'Book the ferry photo experience',
    ...shared,
  },
  firstTimeWalk: {
    key: 'firstTimeWalk',
    offerName: 'Private First-Time Istanbul Walk',
    shortDescription:
      'A practical 3-hour city walk for first-time visitors, built around route logic, viewpoints, local movement, and the places that make the city easier to understand.',
    buttonLabel: 'Book this walk',
    ...shared,
  },
  budgetWalk: {
    key: 'budgetWalk',
    offerName: 'Budget-Friendly Istanbul Walk',
    shortDescription:
      'A 3-hour walk focused on free views, mosque courtyards, ferry moments, public spaces, and low-cost ways to experience Istanbul.',
    buttonLabel: 'Book this walk',
    ...shared,
  },
  neighborhoodWalk: {
    key: 'neighborhoodWalk',
    offerName: 'Istanbul Neighborhood Walk',
    shortDescription:
      'A 3-hour walk through one or two Istanbul neighborhoods, designed around atmosphere, photography, cafés, viewpoints, and practical orientation.',
    buttonLabel: 'Request this experience',
    ...shared,
  },
  transitOrientation: {
    key: 'transitOrientation',
    offerName: 'Istanbul Ferry & Transit Orientation',
    shortDescription:
      'A practical 3-hour orientation for using ferries, trams, metro links, and walkable routes without depending on taxis.',
    buttonLabel: 'Request this experience',
    ...shared,
  },
  cafeNeighborhoodWalk: {
    key: 'cafeNeighborhoodWalk',
    offerName: 'Istanbul Café & Neighborhood Walk',
    shortDescription:
      'A relaxed 3-hour walk for café lovers, students, and remote workers looking for useful neighborhoods, work-friendly stops, and local rhythm.',
    buttonLabel: 'Book this walk',
    ...shared,
  },
} satisfies Record<ExperienceOfferKey, ExperienceOffer>;

export function getExperienceOfferForContext(context: string): ExperienceOffer | null {
  const value = context.toLowerCase();

  if (value.includes('public-transport') || value.includes('transportation') || value.includes('istanbulkart')) {
    return experienceOffers.transitOrientation;
  }

  if (value.includes('ferry') || value.includes('photo') || value.includes('reel') || value.includes('bosphorus')) {
    return experienceOffers.ferryPhoto;
  }

  if (value.includes('first-time') || value.includes('48-hours') || value.includes('two-day') || value.includes('2-day')) {
    return experienceOffers.firstTimeWalk;
  }

  if (value.includes('budget') || value.includes('free') || value.includes('affordable') || value.includes('wallet')) {
    return experienceOffers.budgetWalk;
  }

  if (
    value.includes('where-to-stay') ||
    value.includes('hidden') ||
    value.includes('neighborhood') ||
    value.includes('balat') ||
    value.includes('kadikoy') ||
    value.includes('kadıköy') ||
    value.includes('galata') ||
    value.includes('karakoy') ||
    value.includes('karaköy')
  ) {
    return experienceOffers.neighborhoodWalk;
  }

  if (value.includes('cafe') || value.includes('café') || value.includes('student') || value.includes('remote-worker')) {
    return experienceOffers.cafeNeighborhoodWalk;
  }

  return null;
}
