// Everything here is served under /api. Add one line per feature:
//   router.use('/bookings', require('./booking.routes'));
const router = require('express').Router();

router.use('/health', require('./health.routes'));
router.use('/enquiries', require('./enquiry.routes'));
router.use('/specials', require('./special.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
