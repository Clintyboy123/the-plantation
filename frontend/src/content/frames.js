// Frame tone per experience: the colour of the fine rule around every framed photo.
// Weddings and the gallery are gold; each other experience takes the colour that carries its mood.
export const tones = {
  wedding: 'gold',
  gallery: 'gold',
  corporate: 'forest',
  accommodation: 'sage',
  boma: 'champagne',
  church: 'charcoal',
  cuisine: 'evergreen',
  story: 'champagne',
  general: 'champagne',
};

// Tone to use when that experience's photo sits on a dark section.
export const darkTones = {
  wedding: 'gold',
  gallery: 'gold',
  corporate: 'champagne',
  accommodation: 'sage',
  boma: 'champagne',
  church: 'ivory',
  cuisine: 'champagne',
  story: 'champagne',
  general: 'champagne',
};

// Navigation routes -> experience, so menu previews wear their page's frame.
export const routeTone = {
  '/weddings': 'gold',
  '/corporate': 'forest',
  '/accommodation': 'sage',
  '/the-boma': 'champagne',
  '/39-on-church': 'charcoal',
  '/cuisine': 'evergreen',
  '/gallery': 'gold',
  '/our-story': 'champagne',
  '/contact': 'champagne',
};
