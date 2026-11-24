import { useId, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert } from 'lucide-react';
import Button from './ui/Button';
import { Checkbox, Input, Select, Textarea } from './ui/Field';
import { options, paths } from '../content/enquiry';
import { boma, booking, church, site } from '../content/site';
import { sendEnquiry } from '../services/enquiries';
import { extraPackageChoices } from '../services/specials';
import useSpecials from '../hooks/useSpecials';
import { ease } from '../utils/motion';

// One enquiry form, six audiences. Each type asks only what its team needs; the API validates
// the same rules again and saves every enquiry before (optionally) emailing the right inbox.
const today = () => new Date().toISOString().slice(0, 10);
const blank = {
  name: '', email: '', phone: '', startDate: '', endDate: '', guests: '', message: '',
  partnerName: '', package: '', viewing: false, dateFlexible: false,
  company: '', eventType: '', venue: '', accommodation: false,
  suite: '', stay: '', topic: '', website: '',
};

// Which fields each type sends to the API.
const FIELDS = {
  wedding: ['partnerName', 'startDate', 'dateFlexible', 'guests', 'package', 'viewing', 'message'],
  corporate: ['company', 'eventType', 'venue', 'startDate', 'guests', 'accommodation', 'message'],
  accommodation: ['startDate', 'endDate', 'guests', 'suite', 'message'],
  boma: ['eventType', 'startDate', 'guests', 'message'],
  church: ['stay', 'company', 'startDate', 'endDate', 'guests', 'message'],
  general: ['topic', 'message'],
};

function validate(type, v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter your name';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Enter a valid email address';
  if (!v.phone.trim()) e.phone = 'Enter a phone number so we can call you back';
  else if (!/^[+()\d\s-]{7,25}$/.test(v.phone.trim())) e.phone = 'Enter a valid phone number';
  if (v.startDate && v.startDate < today()) e.startDate = 'Choose a date from today onwards';
  if (v.endDate && v.startDate && v.endDate <= v.startDate) e.endDate = 'Departure must be after arrival';
  const guests = Number(v.guests);
  if (['wedding', 'corporate', 'boma'].includes(type) && !v.guests) e.guests = 'Enter an estimated number of guests';
  if (v.guests && (!Number.isInteger(guests) || guests < 1)) e.guests = 'Enter a number of guests';
  if (type === 'wedding' && guests > 200) e.guests = 'The Plantation hosts weddings of up to 200 guests';
  if (type === 'corporate' && guests > 200) e.guests = 'Our venues host up to 200 guests';
  if (type === 'boma' && guests > 140) e.guests = 'The Boma hosts up to 140 guests';
  if (type === 'corporate' && !v.company.trim()) e.company = 'Enter your company or organisation';
  if (['corporate', 'boma'].includes(type) && !v.eventType) e.eventType = 'Choose the type of event';
  if (type === 'accommodation' && !v.startDate) e.startDate = 'Choose your arrival date';
  if (type === 'accommodation' && !v.endDate) e.endDate = 'Choose your departure date';
  if (type === 'church' && !v.stay) e.stay = 'Choose a room or conference space';
  if (type === 'general' && !v.message.trim()) e.message = 'Tell us how we can help';
  return e;
}

export default function EnquiryForm({ type, tone = 'light', submitLabel = 'Send enquiry' }) {
  const uid = useId();
  const { pathname } = useLocation();
  const formRef = useRef(null);
  const [values, setValues] = useState(blank);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');
  const path = paths[type];
  const reach = type === 'boma' ? boma : type === 'church' ? church : site;
  const id = (name) => `${uid}-${name}`;

  const set = (name) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const focusFirstError = (errs) => {
    const first = Object.keys(errs).find((k) => errs[k]);
    if (first) requestAnimationFrame(() => formRef.current?.querySelector(`[name="${id(first)}"]`)?.focus());
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    const found = validate(type, values);
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      setStatus('idle');
      focusFirstError(found);
      return;
    }
    const payload = { type, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), sourcePage: pathname, website: values.website };
    for (const key of FIELDS[type]) {
      const v = values[key];
      if (v !== '' && v !== false) payload[key] = key === 'guests' ? Number(v) : v;
    }
    setStatus('sending');
    try {
      const result = await sendEnquiry(payload);
      setMessage(result.message);
      setStatus('sent');
      setValues(blank);
      setErrors({});
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
      if (error.fields && Object.keys(error.fields).length) {
        setErrors(error.fields);
        focusFirstError(error.fields);
      }
    }
  };

  const dark = tone === 'dark';
  const common = { tone };
  const show = useMemo(() => new Set(FIELDS[type]), [type]);
  const specials = useSpecials(type === 'wedding');
  const packageChoices = useMemo(() => [...(specials || []).map((s) => s.name), ...extraPackageChoices], [specials]);
  const dateLabel = {
    wedding: 'Preferred wedding date',
    corporate: 'Event date',
    accommodation: 'Arrival',
    boma: 'Event date',
    church: 'Arrival or meeting date',
  }[type];

  return (
    <div className={dark ? 'on-dark' : ''}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            role="status"
            className="flex flex-col items-center py-10 text-center md:items-start md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
            exit={{ opacity: 0 }}
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-champagne shadow-[0_0_14px_4px_rgb(216_199_170/0.55)]" />
            <h3 className="mt-8 type-h2">
              Thank you. <em>We have your note.</em>
            </h3>
            <p className={`mt-8 max-w-[30rem] type-body-l ${dark ? 'text-mist' : 'text-stone'}`}>{message}</p>
            <p className={`mt-4 type-body ${dark ? 'text-mist' : 'text-stone'}`}>
              If it is urgent, call {path.responder.replace('The ', 'the ')} on{' '}
              <a href={reach.phoneHref} className="underline decoration-champagne underline-offset-4">
                {reach.phone}
              </a>
              .
            </p>
            <div className="mt-10">
              <Button variant="link" onClick={() => setStatus('idle')} className={dark ? 'text-champagne' : 'text-forest'}>
                Send another enquiry
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key={`form-${type}`}
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            aria-label={`${path.short} enquiry`}
          >
            {status === 'error' && message && (
              <div role="alert" className={`mb-10 flex items-start gap-3 border-l-2 py-1 pl-4 text-left ${dark ? 'border-champagne text-ivory' : 'border-danger text-charcoal'}`}>
                <CircleAlert className={`mt-0.5 size-5 shrink-0 ${dark ? 'text-champagne' : 'text-danger'}`} strokeWidth={1.5} aria-hidden="true" />
                <p className="type-body">{message}</p>
              </div>
            )}

            <div className="grid gap-x-[var(--gutter)] gap-y-9 md:grid-cols-2">
              <Input {...common} id={id('name')} label="Your name" required autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
              {show.has('partnerName') && (
                <Input {...common} id={id('partnerName')} label="Your partner’s name" autoComplete="off" value={values.partnerName} onChange={set('partnerName')} error={errors.partnerName} />
              )}
              {show.has('company') && (
                <Input
                  {...common}
                  id={id('company')}
                  label={type === 'church' ? 'Company (for conferences)' : 'Company or organisation'}
                  required={type === 'corporate'}
                  autoComplete="organization"
                  value={values.company}
                  onChange={set('company')}
                  error={errors.company}
                />
              )}
              <Input {...common} id={id('email')} label="Email" type="email" required autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
              <Input {...common} id={id('phone')} label="Phone" type="tel" inputMode="tel" required autoComplete="tel" value={values.phone} onChange={set('phone')} error={errors.phone} />

              {show.has('eventType') && (
                <Select
                  {...common}
                  id={id('eventType')}
                  label="Type of event"
                  required
                  options={type === 'boma' ? options.bomaEvents : options.corporateEvents}
                  value={values.eventType}
                  onChange={set('eventType')}
                  error={errors.eventType}
                />
              )}
              {show.has('venue') && (
                <Select {...common} id={id('venue')} label="Preferred venue" options={options.corporateVenues} value={values.venue} onChange={set('venue')} error={errors.venue} />
              )}
              {show.has('stay') && (
                <Select {...common} id={id('stay')} label="Room or space" required options={options.churchStays} value={values.stay} onChange={set('stay')} error={errors.stay} />
              )}
              {show.has('suite') && (
                <Select {...common} id={id('suite')} label="Suite" options={options.suites} value={values.suite} onChange={set('suite')} error={errors.suite} />
              )}
              {show.has('topic') && (
                <Select {...common} id={id('topic')} label="Topic" options={options.generalTopics} value={values.topic} onChange={set('topic')} error={errors.topic} />
              )}

              {show.has('startDate') && (
                <Input
                  {...common}
                  id={id('startDate')}
                  label={dateLabel}
                  type="date"
                  min={today()}
                  required={type === 'accommodation'}
                  value={values.startDate}
                  onChange={set('startDate')}
                  error={errors.startDate}
                />
              )}
              {show.has('endDate') && (
                <Input
                  {...common}
                  id={id('endDate')}
                  label="Departure"
                  type="date"
                  min={values.startDate || today()}
                  required={type === 'accommodation'}
                  value={values.endDate}
                  onChange={set('endDate')}
                  error={errors.endDate}
                />
              )}
              {show.has('guests') && (
                <Input
                  {...common}
                  id={id('guests')}
                  label={type === 'accommodation' || type === 'church' ? 'Guests' : 'Estimated guests'}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={type === "boma" ? 140 : 200}
                  required={['wedding', 'corporate', 'boma'].includes(type)}
                  hint={type === 'wedding' ? '10 to 200 guests' : type === 'boma' ? 'Up to 140 guests' : undefined}
                  value={values.guests}
                  onChange={set('guests')}
                  error={errors.guests}
                />
              )}
              {show.has('package') && (
                <Select {...common} id={id('package')} label="Package of interest" options={packageChoices} value={values.package} onChange={set('package')} error={errors.package} />
              )}

              {show.has('message') && (
                <Textarea
                  {...common}
                  id={id('message')}
                  className="md:col-span-2"
                  label={type === 'general' ? 'Your message' : 'Anything we should know?'}
                  required={type === 'general'}
                  placeholder={
                    type === 'wedding'
                      ? 'The feel you have in mind, a ceremony on site, accommodation for guests…'
                      : type === 'corporate'
                        ? 'Agenda, room set-up, AV, catering, timings…'
                        : ''
                  }
                  value={values.message}
                  onChange={set('message')}
                  error={errors.message}
                />
              )}

              {(show.has('dateFlexible') || show.has('viewing') || show.has('accommodation')) && (
                <div className="flex flex-col gap-1 md:col-span-2 md:flex-row md:gap-10">
                  {show.has('dateFlexible') && <Checkbox {...common} id={id('dateFlexible')} label="Our date is flexible" checked={values.dateFlexible} onChange={set('dateFlexible')} />}
                  {show.has('viewing') && <Checkbox {...common} id={id('viewing')} label="We would like to view the venue" checked={values.viewing} onChange={set('viewing')} />}
                  {show.has('accommodation') && (
                    <Checkbox {...common} id={id('accommodation')} label="We need accommodation for delegates" checked={values.accommodation} onChange={set('accommodation')} />
                  )}
                </div>
              )}

              {/* Honeypot: hidden from people, filled in by spam bots, rejected by the API. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={id('website')}>Leave this empty</label>
                <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <Button type="submit" variant={dark ? 'light' : 'solid'} loading={status === 'sending'}>
                {status === 'sending' ? 'Sending' : submitLabel}
              </Button>
              {(type === 'accommodation' || type === 'church') && (
                <Button variant="link" href={type === 'church' ? booking.church : booking.plantationSuites} className={dark ? 'text-champagne' : 'text-forest'}>
                  Or book online now
                </Button>
              )}
            </div>
            <p className={`mt-6 text-center type-caption md:text-left ${dark ? 'text-mist' : 'text-stone'}`}>
              We use your details only to reply to this enquiry. Sent to {path.responder}.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
