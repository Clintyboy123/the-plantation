// Site-wide facts. Every value here was checked against theplantation.co.za, 39onchurch.co.za and
// peboma.co.za on 2026-11-18. Change contact details here only; the whole site reads from this file.

export const site = {
  name: 'The Plantation',
  url: 'https://www.theplantation.co.za',
  founded: 2006,
  address: ['424A Sardinia Bay Road', 'Lovemore Park', 'Gqeberha (Port Elizabeth)'],
  addressLine: '424A Sardinia Bay Road, Lovemore Park, Gqeberha',
  postal: ['P O Box 40132', 'Walmer', '6065'],
  phone: '(041) 366 1591',
  phoneHref: 'tel:+27413661591',
  fax: '(041) 366 1592',
  email: 'bookings@theplantation.co.za',
  hours: [
    ['Monday – Friday', '09h00 – 16h00'],
    ['Saturday', '09h00 – 12h00'],
  ],
  gps: 'S 34° 00′ 40.00″, E 25° 32′ 21.77″',
  mapUrl: 'https://www.google.com/maps/place/The+Plantation/@-34.010914,25.538749,15z',
  mapEmbed: 'https://www.google.com/maps?q=-34.010914,25.538749&z=14&output=embed',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/theplantationpe/' },
    { label: 'Facebook', href: 'https://www.facebook.com/theplantationpe/' },
    { label: 'Pinterest', href: 'https://za.pinterest.com/theplantationpe/' },
    { label: 'X', name: 'X (Twitter)', href: 'https://twitter.com/ThePlantationPE' },
  ],
};

// Existing NightsBridge booking engines, preserved exactly as the current sites use them.
export const booking = {
  plantationSuites: 'https://www.nightsbridge.co.za/bridge/book?bbid=21113',
  church: 'https://www.nightsbridge.co.za/bridge/book?bbid=18531',
};

export const church = {
  name: '39 on Church',
  url: 'https://www.39onchurch.co.za/',
  address: ['39 Church Road', 'Walmer', 'Gqeberha (Port Elizabeth)'],
  phone: '084 619 2695',
  phoneHref: 'tel:+27846192695',
  email: 'info@39onchurch.co.za',
  facebook: 'https://www.facebook.com/39onChurchPE/',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=39+Church+Road%2C+Walmer%2C+Gqeberha',
  mapEmbed: 'https://www.google.com/maps?q=39+Church+Road,+Walmer,+Gqeberha&z=15&output=embed',
  tripadvisor: 'https://www.tripadvisor.co.za/Hotel_Review-g312559-d1643601-Reviews-39_on_Church-Port_Elizabeth_Eastern_Cape.html',
};

export const boma = {
  name: 'The Boma',
  url: 'https://www.peboma.co.za/',
  address: ['424 Sardinia Bay Road', 'Lovemore Park', 'Gqeberha (Port Elizabeth)'],
  phone: '079 566 0258',
  phoneHref: 'tel:+27795660258',
  email: 'theboma@rmproperties.co.za',
};

// Primary navigation. "time" is the hour each experience belongs to in the day on the estate.
export const nav = [
  { to: '/weddings', label: 'Weddings', time: '15:30', photo: 'chapel-aisle' },
  { to: '/corporate', label: 'Corporate & Events', short: 'Corporate', time: '10:00', photo: 'corp-ballroom' },
  { to: '/accommodation', label: 'Accommodation', short: 'Stay', time: '07:00', photo: 'honeymoon-1' },
  { to: '/the-boma', label: 'The Boma', time: '20:30', photo: 'boma-courtyard' },
  { to: '/39-on-church', label: '39 on Church', time: '08:00', photo: 'church-pool' },
  { to: '/cuisine', label: 'Cuisine', time: '18:30', photo: 'dish-lamb' },
];

export const navSecondary = [
  { to: '/gallery', label: 'Gallery', photo: 'sparklers' },
  { to: '/our-story', label: 'Our Story', photo: 'estate-aerial' },
  { to: '/contact', label: 'Contact', photo: 'estate-garden' },
];
