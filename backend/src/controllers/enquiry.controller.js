const { matchedData } = require('express-validator');
const enquiries = require('../services/enquiry.service');

const thanks = {
  wedding: 'Thank you. Our wedding team will be in touch shortly.',
  corporate: 'Thank you. Our events team will send you a tailored proposal shortly.',
  accommodation: 'Thank you. We will confirm availability and rates with you shortly.',
  boma: 'Thank you. The Boma team will be in touch shortly.',
  church: 'Thank you. The 39 on Church team will be in touch shortly.',
  general: 'Thank you. We will get back to you shortly.',
};

exports.create = async (req, res) => {
  const values = matchedData(req, { locations: ['body'] });
  const enquiry = await enquiries.create(values);
  res.status(201).json({ success: true, message: thanks[enquiry.type], data: { id: enquiry.id } });
};
