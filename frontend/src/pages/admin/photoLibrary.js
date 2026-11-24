import photos from '../../content/photos.json';
import { BASE } from '../../utils/asset';

// The venue's photo library (frontend/public/photos), for choosing a special's picture.
export const categories = [
  ['weddings', 'Weddings'],
  ['cuisine', 'Cuisine'],
  ['accommodation', 'Suites'],
  ['boma', 'The Boma'],
  ['church', '39 on Church'],
  ['corporate', 'Corporate'],
  ['other', 'Other'],
];

export const library = Object.entries(photos).map(([name, p]) => ({ name, alt: p.alt, category: p.category || 'other' }));

export const thumb = (name) => {
  const photo = photos[name];
  return photo ? `${BASE}photos/${name}-${photo.widths[0]}.webp` : '';
};

export const altOf = (name) => photos[name]?.alt || '';
