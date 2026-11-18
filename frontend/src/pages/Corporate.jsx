import { motion, useReducedMotion } from 'motion/react';
import Seo from '../components/Seo';
import Frame, { FrameTone } from '../components/Frame';
import Photo from '../components/Photo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import SplitHeading from '../components/SplitHeading';
import Testimonials from '../components/Testimonials';
import EnquirySection from '../components/EnquirySection';
import { clients } from '../content/home';
import { ease, viewportOnce } from '../utils/motion';

const occasions = [
  'Product launches',
  'Breakfasts',
  'Lunches',
  'Cocktail parties',
  'Banquets',
  'Awards ceremonies',
  'Conferences',
  'Executive strategy sessions',
  'Exclusive business meetings',
];

const facilities = [
  ['Capacity', 'No minimum, a maximum of 200 guests'],
  ['Privacy', 'Private and exclusive: your event is the only one'],
  ['Spaces', 'One large event room with several outdoor breakaway areas'],
  ['Catering', 'In-house catering, tailored to your requirements'],
  ['Bar', 'Full bar service'],
  ['Accommodation', 'Four-star rooms on and off site, 16 in all, plus a network of partner hotels'],
  ['Parking', 'Secure parking'],
  ['Location', '10 minutes from the airport and 15 from central Gqeberha'],
  ['Connectivity', 'High-speed Wi-Fi'],
  ['Power', 'Full backup generator'],
  ['Décor', 'In-house décor service'],
  ['Production', 'Full sound and staging service'],
];

const venues = [
  {
    name: 'The Plantation',
    photo: 'corp-awards',
    rows: [
      ['Up to 200', 'guests'],
      ['Ballroom', 'one large event room, porch and outdoor breakaway areas'],
      ['Best for', 'conferences, launches, banquets and awards evenings'],
    ],
    to: null,
  },
  {
    name: '39 on Church',
    photo: 'church-conference',
    rows: [
      ['Up to 60', 'delegates, with a boardroom for 10'],
      ['Conference centre', 'fully equipped, with on-site accommodation'],
      ['Best for', 'training, workshops, presentations and board meetings'],
    ],
    to: '/39-on-church',
  },
  {
    name: 'The Boma',
    photo: 'boma-drumming',
    rows: [
      ['Up to 140', 'guests'],
      ['Indoor & outdoor', 'enclosed spaces, courtyard and lawns'],
      ['Best for', 'team-building, client gatherings and heritage tasting experiences'],
    ],
    to: '/the-boma',
  },
];

const testimonials = [
  {
    quote: 'Thank you for your involvement, assistance and professionalism throughout our stay in PE for the SAMSA Workshop. You showed us a warm welcome and opened your doors to your facilities, insight and referrals, especially with such tight deadlines.',
    name: 'Ms Kopano Dimpe',
    role: 'SAMSA Workshop',
  },
  {
    quote: 'A huge thank you to you and your team at The Plantation! Once again, we had an awesome time and a flawless event. The food was amazing!',
    name: 'Lucinda Lindsay',
    role: 'Nelson Mandela University',
  },
  {
    quote: 'Thank you for your generous support at our fundraiser. Thanks to your kindness we were able to raise a substantial amount, part of which will be donated to Cheshire Home’s Miracle Kids.',
    name: 'The Chairman and Committee',
    role: 'Union of Jewish Women, Port Elizabeth',
  },
];

const awards = [
  ['2018', 'BWA Regional Business Achiever of the Year, Entrepreneur category: Top 3 Finalist'],
  ['2017', 'Rosetta Award for service excellence, Restaurant Association of South Africa'],
  ['2017', 'Lilizela Tourism Awards: Finalist'],
  ['2017', 'Luxury Travel Magazine’s Global Awards: Winner'],
  ['2015', 'PMR Diamond Arrow Award: Winner'],
  ['2011', 'Top 40 Under 40 Business Achievers, Nelson Mandela Bay Business Chamber'],
];

export default function Corporate() {
  return (
    <FrameTone tone="forest">
      <Seo
        title="Corporate events & conferences"
        description="A private conference and function venue for up to 200 guests, 10 minutes from Gqeberha airport, with in-house catering, sound, staging, Wi-Fi and backup power."
      />
      <Hero />
      <Occasions />
      <Facilities />
      <Venues />
      <Gallery />
      <Proof />
      <EnquirySection
        type="corporate"
        title={['Plan your event', <em key="w">with us.</em>]}
        intro="Tell us what you are hosting. We will return a proposal built around your agenda, numbers and catering."
      />
    </FrameTone>
  );
}

/* Split-screen opening: a forest-green brief on the left, the room on the right -- */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="on-dark grid min-h-[100svh] bg-forest text-ivory lg:grid-cols-12">
      <div className="relative order-1 h-[58svh] overflow-hidden lg:order-2 lg:col-span-6 lg:h-auto">
        <motion.div className="absolute inset-0" initial={{ scale: reduce ? 1 : 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease }}>
          <Photo name="corp-dinner" priority sizes="(min-width: 1024px) 50vw, 100vw" className="size-full" frame={false} />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-evergreen/60 via-transparent to-transparent lg:from-evergreen/30" />
      </div>
      <div className="order-2 flex flex-col justify-end px-[var(--margin)] pt-16 pb-14 lg:order-1 lg:col-span-6 lg:pt-40 lg:pb-20">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
            <Eyebrow className="text-champagne">Corporate & events</Eyebrow>
          </motion.div>
          <SplitHeading as="h1" onMount delay={0.8} className="mt-6 type-h1" lines={['Exceptional', 'spaces.', <em key="m">Meaningful</em>, <em key="c">connections.</em>]} />
          <motion.p
            className="mt-8 max-w-[30rem] type-body-l text-ivory/85"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8, ease }}
          >
            Superb function facilities, a tranquil setting and the airport ten minutes away. We are known for our service, our food and for building a package
            around each company’s needs.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            <Button variant="light" href="#enquire">Request a proposal</Button>
            <Button variant="link" href="#facilities" className="text-ivory">Facilities</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* What people host here, set as one flowing line of type ---------------------- */
function Occasions() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap">
        <Reveal className="flex justify-center md:justify-start">
          <Eyebrow>The ideal venue for</Eyebrow>
        </Reveal>
        <motion.p
          className="mt-10 text-center font-display text-[clamp(2rem,4.2vw,4rem)] font-light leading-[1.18] text-evergreen md:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {occasions.map((o, i) => (
            <motion.span
              key={o}
              className="inline"
              variants={{ hidden: { opacity: 0.12 }, visible: { opacity: 1, transition: { duration: 0.8, ease } } }}
            >
              <span className={i % 2 ? 'italic' : ''}>{o}</span>
              {i < occasions.length - 1 && (
                <span aria-hidden="true" className="mx-[0.35em] inline-block size-[0.14em] -translate-y-[0.22em] rounded-full bg-champagne align-middle" />
              )}
              {i < occasions.length - 1 && <span className="sr-only">, </span>}
            </motion.span>
          ))}
          <span className="text-champagne">.</span>
        </motion.p>
      </div>
    </section>
  );
}

/* The spec sheet ------------------------------------------------------------------ */
function Facilities() {
  return (
    <section id="facilities" className="scroll-mt-20 section-y bg-sage-light">
      <div className="wrap grid-site gap-y-16">
        <div className="col-span-4 md:col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Intro
              eyebrow="Facilities"
              title={['Everything handled,', <em key="i">in-house.</em>]}
              body="One team plans, caters, lights and runs your day, so there is one number to call and nothing falls between suppliers."
            />
          </div>
        </div>
        <dl className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
          {facilities.map(([term, detail], i) => (
            <motion.div
              key={term}
              className="grid grid-cols-1 gap-2 border-t border-forest/25 py-6 text-center md:grid-cols-[3rem_11rem_1fr] md:gap-6 md:text-left"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
              viewport={viewportOnce}
            >
              <span aria-hidden="true" className="hidden font-display text-lg italic text-forest/70 md:block">{String(i + 1).padStart(2, '0')}</span>
              <dt className="type-label pt-1 text-forest">{term}</dt>
              <dd className="type-body-l text-charcoal">{detail}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* Three venues compared, one table -------------------------------------------- */
function Venues() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap">
        <Intro
          align="center"
          eyebrow="Three venues, one team"
          title={['Choose the room', <em key="f">that fits the brief.</em>]}
          body="The Plantation group runs three venues within ten minutes of each other, so one booking can include a conference, a dinner and a night’s rest."
        />
        <div className="mt-20 grid gap-x-[var(--gutter)] gap-y-20 md:grid-cols-3">
          {venues.map((v, i) => (
            <motion.article
              key={v.name}
              className="flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: i * 0.12 } }}
              viewport={viewportOnce}
            >
              <Photo name={v.photo} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5]" parallax={4} />
              <h3 className="mt-8 text-center type-h3 text-evergreen md:text-left">{v.name}</h3>
              <dl className="mt-6 flex-1 border-t border-charcoal/15">
                {v.rows.map(([k, d]) => (
                  <div key={k} className="border-b border-charcoal/15 py-4 text-center md:text-left">
                    <dt className="font-display text-xl text-forest">{k}</dt>
                    <dd className="mt-1 type-body text-stone">{d}</dd>
                  </div>
                ))}
              </dl>
              {v.to && (
                <div className="mt-6 flex justify-center md:justify-start">
                  <Button variant="link" to={v.to} className="text-forest">
                    Visit {v.name}
                  </Button>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Two rooms, two moods -------------------------------------------------------------- */
function Gallery() {
  return (
    <section className="bg-ivory pb-[var(--section)]">
      <div className="wrap grid-site gap-y-[var(--gutter)]">
        <div className="col-span-4 md:col-span-8">
          <Photo name="corp-barn-banquet" sizes="(min-width: 768px) 66vw, 100vw" className="aspect-[3/2]" reveal="left" />
          <p className="mt-4 text-center type-caption text-stone md:text-left">A banquet lunch in The Plantation barn.</p>
        </div>
        <div className="col-span-4 md:col-span-4 md:mt-40">
          <Photo name="corp-african" sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5]" reveal="bottom" />
          <p className="mt-4 text-center type-caption text-stone md:text-left">An African-themed gala, styled by our décor team.</p>
        </div>
      </div>
    </section>
  );
}

/* Proof: clients, testimonials, recognition --------------------------------------- */
function Proof() {
  return (
    <section className="on-dark section-y bg-forest text-ivory">
      <div className="wrap">
        <Reveal className="flex justify-center">
          <Eyebrow className="text-champagne">From our clients</Eyebrow>
        </Reveal>
        <Testimonials items={testimonials} tone="dark" className="mt-12" />

        <div className="mt-[var(--section)] grid-site gap-y-16">
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-center type-label text-champagne md:text-left">We have hosted</h2>
            <ul className="mt-8 columns-1 gap-[var(--gutter)] text-center sm:columns-2 md:text-left">
              {clients.map((c) => (
                <li key={c} className="break-inside-avoid border-t border-ivory/15 py-3 font-display text-xl">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <h2 className="text-center type-label text-champagne md:text-left">Recognition</h2>
            <ol className="mt-8">
              {awards.map(([y, t]) => (
                <li key={t} className="grid gap-1 border-t border-ivory/15 py-4 text-center md:grid-cols-[4.5rem_1fr] md:gap-4 md:text-left">
                  <span className="font-display text-lg italic text-champagne">{y}</span>
                  <span className="type-body text-mist">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
