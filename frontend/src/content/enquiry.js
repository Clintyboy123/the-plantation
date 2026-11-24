// Enquiry paths. The option lists must match backend/src/config/enquiryOptions.js (the API rejects
// anything else). Each path asks only what that audience's team needs to reply properly.

export const options = {
  // Wedding packages come from the venue's specials (managed in /admin), see hooks/useSpecials.js.
  corporateEvents: ['Conference', 'Executive strategy session', 'Product launch', 'Awards ceremony or banquet', 'Breakfast or lunch', 'Cocktail party', 'Year-end function', 'Other'],
  corporateVenues: ['The Plantation', '39 on Church conference centre', 'The Boma', 'Advise me'],
  suites: ['King Suite', 'Family Suite', 'Honeymoon Suite', 'Any suite'],
  bomaEvents: ['Wedding', 'Corporate function', 'Celebration', "Kids' party", 'Cottage stay'],
  churchStays: ['Queen suite', 'Twin suite', 'King suite', 'Family suite', 'Self-catering garden cottage', 'Conference room (up to 60)', 'Boardroom (up to 10)'],
  generalTopics: ['A question', 'Arrange a venue viewing', 'Suppliers & media', 'Feedback', 'Other'],
};

export const paths = {
  wedding: {
    label: 'A wedding',
    short: 'Weddings',
    title: 'Tell us about your day',
    intro: 'Share a few details and our wedding planners will come back to you with availability, a tailored quote and an invitation to view the estate.',
    responder: 'The Plantation wedding team',
    photo: 'couple-forest',
  },
  corporate: {
    label: 'A corporate event',
    short: 'Corporate',
    title: 'Plan your event with us',
    intro: 'Tell us what you are hosting. We will return a proposal built around your agenda, numbers and catering.',
    responder: 'The Plantation events team',
    photo: 'corp-dinner',
  },
  accommodation: {
    label: 'A stay at The Plantation',
    short: 'Stay',
    title: 'Ask about a stay',
    intro: 'For instant availability, book online. For group stays, wedding guests or questions, send us a note.',
    responder: 'The Plantation reservations',
    photo: 'honeymoon-2',
  },
  boma: {
    label: 'An event at The Boma',
    short: 'The Boma',
    title: 'Gather at The Boma',
    intro: 'Weddings, celebrations, corporate functions and kids’ parties for up to 140 guests, beneath the fairy-lit trees.',
    responder: 'The Boma team',
    photo: 'boma-courtyard',
  },
  church: {
    label: '39 on Church',
    short: '39 on Church',
    title: 'Stay or meet at 39 on Church',
    intro: 'Ask about rooms, longer stays, the conference room or the boardroom. For instant availability, book online.',
    responder: 'The 39 on Church team',
    photo: 'church-pool',
  },
  general: {
    label: 'Something else',
    short: 'General',
    title: 'How can we help?',
    intro: 'Questions, viewings, suppliers and press. We read every message.',
    responder: 'The Plantation office',
    photo: 'estate-garden',
  },
};

export const pathOrder = ['wedding', 'corporate', 'accommodation', 'boma', 'church', 'general'];
