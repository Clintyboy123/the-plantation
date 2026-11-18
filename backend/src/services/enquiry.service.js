const { Enquiry } = require('../models');
const mail = require('./mail.service');
const env = require('../config/env');
const options = require('../config/enquiryOptions');

// Which form fields belong in "details" for each enquiry type.
const DETAIL_FIELDS = {
  wedding: ['partnerName', 'package', 'viewing', 'dateFlexible'],
  corporate: ['company', 'eventType', 'venue', 'accommodation'],
  accommodation: ['suite'],
  boma: ['eventType'],
  church: ['stay', 'company'],
  general: ['topic'],
};

const recipientFor = (type) => {
  if (type === 'boma' && env.mail.toBoma) return env.mail.toBoma;
  if (type === 'church' && env.mail.toChurch) return env.mail.toChurch;
  return env.mail.to;
};

const asText = (e) => {
  const lines = [
    `New ${options.labels[e.type]} enquiry from the website`,
    '',
    `Name:    ${e.name}`,
    `Email:   ${e.email}`,
    `Phone:   ${e.phone}`,
  ];
  if (e.startDate) lines.push(`Date:    ${e.startDate}${e.endDate ? ` to ${e.endDate}` : ''}`);
  if (e.guests) lines.push(`Guests:  ${e.guests}`);
  for (const [key, value] of Object.entries(e.details || {})) {
    lines.push(`${key}: ${value === true ? 'Yes' : value === false ? 'No' : value}`);
  }
  if (e.message) lines.push('', 'Message:', e.message);
  lines.push('', `Sent from: ${e.sourcePage || 'website'}  (enquiry #${e.id})`);
  return lines.join('\n');
};

exports.create = async (values) => {
  const { type } = values;
  const details = {};
  for (const key of DETAIL_FIELDS[type]) {
    if (values[key] !== undefined && values[key] !== '') details[key] = values[key];
  }

  // Save first: the enquiry is safe even if email fails.
  const enquiry = await Enquiry.create({
    type,
    name: values.name,
    email: values.email,
    phone: values.phone,
    startDate: values.startDate || null,
    endDate: values.endDate || null,
    guests: values.guests ?? null,
    details: Object.keys(details).length ? details : null,
    message: values.message || null,
    sourcePage: values.sourcePage || null,
  });

  const to = recipientFor(type);
  if (to) {
    try {
      // Visitor input only ever goes in the body; the subject is built from our own fixed labels.
      const sent = await mail.send({
        to,
        subject: `Website enquiry: ${options.labels[type]} (#${enquiry.id})`,
        text: asText(enquiry.get({ plain: true })),
        replyTo: enquiry.email,
      });
      if (sent) await enquiry.update({ emailedAt: new Date() });
    } catch (error) {
      console.error('[mail] enquiry saved but email failed:', error.message);
    }
  }

  return enquiry;
};

exports.list = ({ limit = 50 } = {}) => Enquiry.findAll({ order: [['createdAt', 'DESC']], limit });
