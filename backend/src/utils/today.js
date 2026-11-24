// Today's date (YYYY-MM-DD) in South Africa, so a special set to end on 31 December shows all of that day.
const env = require('../config/env');

const format = new Intl.DateTimeFormat('en-CA', { timeZone: env.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });

module.exports = () => format.format(new Date());
