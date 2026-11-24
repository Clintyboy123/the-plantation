'use strict';

// The four specials on theplantation.co.za when the site was built (2026-11-18), so the Weddings page
// is complete on the first day. From then on the venue manages them in /admin.
const NAMES = ['Fairy Tale Wedding Package', 'Hot Summer Special', 'Intimate Wedding Special', 'Sizzling Winter Special'];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const row = (sortOrder, kicker, name, photo, body, note = null) => ({
      kicker, name, photo, body, note,
      sort_order: sortOrder, is_published: true, available_until: null, created_at: now, updated_at: now,
    });

    await queryInterface.bulkInsert('specials', [
      row(1, 'All-in', NAMES[0], 'ballroom-greenery',
        'The very best of The Plantation in one value-packed bundle: award-winning wedding planning, venue and chapel hire, a three- or four-course wedding meal, welcome drinks, champagne, staff fees, the bride’s and groom’s dressing rooms and your first night in the Bridal Suite.'),
      row(2, 'Summer', NAMES[1], 'couple-golden',
        'For couples looking for the best on a budget: all the essential ingredients for a fantastic summer garden wedding, at an unbeatable price.'),
      row(3, '20 – 40', NAMES[2], 'forest-table',
        'A beautiful, stress-free celebration with the 20 to 40 people who matter most.'),
      row(4, 'Winter', NAMES[3], 'sparklers',
        'The warm glow of a winter sunset, hot soup around a crackling bonfire and a hearty meal by a roaring fireplace: the perfect winter wedding, and a really affordable one.',
        'Available May to August 2026 and 2027.'),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specials', { name: { [Sequelize.Op.in]: NAMES } });
  },
};
