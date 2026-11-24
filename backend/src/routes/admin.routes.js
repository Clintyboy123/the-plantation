// Everything under /api/admin needs a signed-in admin.
const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const controller = require('../controllers/special.controller');

router.use(requireAuth);

// Shared rules for adding and editing. "optional" on edit, so one field can be saved at a time.
// Clearing the note or the date: send null or "".
const specialRules = (editing) => {
  const field = (name) => (editing ? body(name).optional() : body(name));
  const text = (name, max, label) =>
    field(name)
      .isString().withMessage(`Enter ${label}`)
      .trim()
      .notEmpty().withMessage(`Enter ${label}`)
      .isLength({ max }).withMessage(`Keep ${label} to ${max} characters`);
  return [
    text('kicker', 40, 'a short label'),
    text('name', 120, 'a name'),
    text('body', 600, 'a description'),
    body('note').optional({ values: 'null' }).isString().trim().isLength({ max: 200 }).withMessage('Keep the note to 200 characters'),
    field('photo').isString().matches(/^[a-z0-9-]{1,80}$/).withMessage('Choose a photo'),
    body('isPublished').optional().isBoolean().withMessage('Choose whether it shows').toBoolean(),
    // A past date is allowed: the special simply counts as expired and stays hidden.
    body('availableUntil').optional({ values: 'falsy' }).isISO8601({ strict: true }).withMessage('Choose a valid date'),
  ];
};

const id = param('id').isInt({ min: 1 }).toInt();

router.get('/specials', controller.listAll);
router.post('/specials', validate(specialRules(false)), controller.create);
router.put(
  '/specials/order',
  validate([
    body('ids').isArray({ min: 1, max: 100 }).withMessage('Nothing to reorder'),
    body('ids.*').isInt({ min: 1 }).toInt(),
  ]),
  controller.reorder
);
router.put('/specials/:id', validate([id, ...specialRules(true)]), controller.update);
router.delete('/specials/:id', validate([id]), controller.remove);

module.exports = router;
