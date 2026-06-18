export type ImageSource = 'Unsplash' | 'City Advisor Istanbul';

export type ImageAsset = {
  src: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  source: ImageSource;
  sourceUrl: string;
};
