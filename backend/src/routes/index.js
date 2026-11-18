// Everything here is served under /api. Add one line per feature:
//   router.use('/bookings', require('./booking.routes'));
const router = require('express').Router();

router.use('/health', require('./health.routes'));
router.use('/enquiries', require('./enquiry.routes'));

module.exports = router;
