// The choices each enquiry form offers. The frontend shows the same lists (frontend/src/content/enquiry.js);
// keep the two in step. Anything not on these lists is rejected by the API.
module.exports = {
  types: ['wedding', 'corporate', 'accommodation', 'boma', 'church', 'general'],
  labels: {
    wedding: 'Wedding',
    corporate: 'Corporate & events',
    accommodation: 'Accommodation at The Plantation',
    boma: 'The Boma',
    church: '39 on Church',
    general: 'General',
  },
  // Wedding packages are not listed here: they are the venue's specials, managed in /admin.
  corporateEvents: ['Conference', 'Executive strategy session', 'Product launch', 'Awards ceremony or banquet', 'Breakfast or lunch', 'Cocktail party', 'Year-end function', 'Other'],
  corporateVenues: ['The Plantation', '39 on Church conference centre', 'The Boma', 'Advise me'],
  suites: ['King Suite', 'Family Suite', 'Honeymoon Suite', 'Any suite'],
  bomaEvents: ['Wedding', 'Corporate function', 'Celebration', "Kids' party", 'Cottage stay'],
  churchStays: ['Queen suite', 'Twin suite', 'King suite', 'Family suite', 'Self-catering garden cottage', 'Conference room (up to 60)', 'Boardroom (up to 10)'],
  generalTopics: ['A question', 'Arrange a venue viewing', 'Suppliers & media', 'Feedback', 'Other'],
};
