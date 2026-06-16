import type { ExperienceOffer } from '@/data/offers';
import { ExperienceOrderPlacement } from './ExperienceOrderPlacement';

type Props = {
  offer?: ExperienceOffer | null;
  sourceLabel?: string;
  sourceArticleSlug?: string;
  sourcePageUrl?: string;
};

export function AdPlaceholder({ offer, sourceLabel, sourceArticleSlug, sourcePageUrl }: Props) {
  if (offer) {
    return (
      <aside>
        <ExperienceOrderPlacement
          offer={offer}
          sourceLabel={sourceLabel}
          sourceArticleSlug={sourceArticleSlug}
          sourcePageUrl={sourcePageUrl}
        />
      </aside>
    );
  }

  return (
    <aside className="rounded-3xl border border-dashed border-orange-300 bg-orange-50 p-6 text-center">
      <p className="font-black text-orange-800">Partner placement</p>
      <p className="mt-2 text-sm text-gray-600">Future space for local cafés, tours, hotels, events, or sponsored recommendations.</p>
    </aside>
  );
}
