const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimit');
const controller = require('../controllers/enquiry.controller');
const o = require('../config/enquiryOptions');

const today = () => new Date().toISOString().slice(0, 10);
const when = (...types) => body('type').custom((v) => types.includes(v));

const futureDate = (field, label) =>
  body(field)
    .optional({ values: 'falsy' })
    .isISO8601({ strict: true })
    .withMessage(`Choose a valid ${label}`)
    .bail()
    .custom((v) => v >= today())
    .withMessage(`Choose a ${label} from today onwards`);

const requiredFor = (field, types, message) =>
  body(field).if(when(...types)).trim().notEmpty().withMessage(message);

const oneOf = (field, list, message) =>
  body(field).optional({ values: 'falsy' }).trim().isIn(list).withMessage(message);

router.post(
  '/',
  formLimiter,
  validate([
    body('type').isIn(o.types).withMessage('Choose what you are enquiring about'),
    body('name').trim().notEmpty().withMessage('Enter your name').isLength({ max: 120 }).withMessage('Name is too long'),
    body('email').trim().isEmail().withMessage('Enter a valid email address').isLength({ max: 254 }),
    body('phone')
      .trim()
      .notEmpty().withMessage('Enter a phone number so we can call you back')
      .matches(/^[+()\d\s-]{7,25}$/).withMessage('Enter a valid phone number'),

    futureDate('startDate', 'date'),
    futureDate('endDate', 'departure date')
      .bail()
      .custom((v, { req }) => !req.body.startDate || v > req.body.startDate)
      .withMessage('Departure must be after arrival'),
    requiredFor('startDate', ['accommodation'], 'Choose your arrival date'),
    requiredFor('endDate', ['accommodation'], 'Choose your departure date'),

    body('guests')
      .optional({ values: 'falsy' })
      .isInt({ min: 1, max: 2000 }).withMessage('Enter a number of guests')
      .bail()
      .custom((v, { req }) => !(req.body.type === 'wedding' && v > 200)).withMessage('The Plantation hosts weddings of up to 200 guests')
      .custom((v, { req }) => !(req.body.type === 'corporate' && v > 200)).withMessage('Our venues host up to 200 guests')
      .custom((v, { req }) => !(req.body.type === 'boma' && v > 140)).withMessage('The Boma hosts up to 140 guests')
      .toInt(),
    requiredFor('guests', ['wedding', 'corporate', 'boma'], 'Enter an estimated number of guests'),

    // Wedding
    body('partnerName').if(when('wedding')).optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
    oneOf('package', o.weddingPackages, 'Choose a package from the list'),
    body('viewing').optional().isBoolean().toBoolean(),
    body('dateFlexible').optional().isBoolean().toBoolean(),

    // Corporate / 39 on Church
    requiredFor('company', ['corporate'], 'Enter your company or organisation'),
    body('company').optional({ values: 'falsy' }).trim().isLength({ max: 160 }),
    oneOf('eventType', [...o.corporateEvents, ...o.bomaEvents], 'Choose an event type from the list'),
    requiredFor('eventType', ['corporate', 'boma'], 'Choose the type of event'),
    oneOf('venue', o.corporateVenues, 'Choose a venue from the list'),
    body('accommodation').optional().isBoolean().toBoolean(),

    // Accommodation
    oneOf('suite', o.suites, 'Choose a suite from the list'),
    oneOf('stay', o.churchStays, 'Choose an option from the list'),
    requiredFor('stay', ['church'], 'Choose a room or conference space'),

    // General
    oneOf('topic', o.generalTopics, 'Choose a topic from the list'),
    requiredFor('message', ['general'], 'Tell us how we can help'),
    body('message').optional({ values: 'falsy' }).trim().isLength({ max: 5000 }).withMessage('Message is too long (5000 characters max)'),

    body('sourcePage').optional().trim().isLength({ max: 120 }),
    body('website').isEmpty().withMessage('Invalid submission'), // honeypot: real visitors never fill it
  ]),
  controller.create
);

module.exports = router;
