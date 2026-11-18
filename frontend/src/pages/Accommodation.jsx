import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Seo from '../components/Seo';
import Frame, { FrameTone } from '../components/Frame';
import Photo from '../components/Photo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import SplitHeading from '../components/SplitHeading';
import EnquirySection from '../components/EnquirySection';
import { booking } from '../content/site';
import { cinema, ease } from '../utils/motion';

const suites = [
  {
    key: 'king',
    name: 'King Suite',
    line: 'Space, a king bed and a patio of your own.',
    body: 'A king bed against a deep navy wall, a lounge corner by the window and a private patio under the trees, with a kitchenette for longer stays.',
    photos: ['king-1', 'king-2', 'king-3', 'king-4'],
    extras: ['King bed', 'Private patio', 'Kitchenette'],
  },
  {
    key: 'family',
    name: 'Family Suite',
    line: 'Room for everyone, under a high pitched ceiling.',
    body: 'Beds for the whole family beneath a vaulted ceiling, a kitchenette with everything you need, and doors that open onto the garden.',
    photos: ['family-1', 'family-2', 'family-3', 'family-4'],
    extras: ['Sleeps a family', 'Garden patio', 'Kitchenette'],
  },
  {
    key: 'honeymoon',
    name: 'Honeymoon Suite',
    line: 'Where married life begins, with breakfast in bed.',
    body: 'A sleigh bed, a chandelier and two armchairs by doors that open onto the forest. The most romantic, tranquil end to a wedding day.',
    photos: ['honeymoon-1', 'honeymoon-2', 'honeymoon-3', 'honeymoon-4'],
    extras: ['Chandelier', 'Forest outlook', 'Breakfast in bed'],
  },
];

const amenities = [
  'En-suite bathroom with bath, shower and amenities',
  'Private patio',
  'In-room dinette',
  'Kitchenette with microwave, mini fridge, cutlery, crockery and glassware (King and Family suites)',
  'Fine teas and filter coffee',
  'Breakfast, cooked or continental',
  'In-room high-speed Wi-Fi',
  'TV with satellite channels',
  'Serviced daily',
  'Secure on-site parking',
];

const nearby = [
  ['On the estate', 'Nature walks and outstanding bird watching'],
  ['After dark', 'Star gazing, far from the city lights'],
  ['Next door', 'Horse riding on the neighbouring property'],
  ['5 minutes', 'Sardinia Bay beach'],
  ['Nearby', 'The Sacramento hiking trail'],
  ['At the gate', 'A country road made for jogging and cycling'],
  ['15 minutes', 'The airport and central Gqeberha'],
  ['45 minutes', 'Addo Elephant National Park'],
];

export default function Accommodation() {
  return (
    <FrameTone tone="sage">
      <Seo
        title="Accommodation"
        description="Four-star forest suites at The Plantation, Gqeberha: the King, Family and Honeymoon suites, with private patios, breakfast and secure parking, 15 minutes from the airport."
      />
      <Hero />
      <Opening />
      <Suites />
      <InEverySuite />
      <Nearby />
      <AlsoStay />
      <EnquirySection type="accommodation" title={['Ask about', <em key="s">a stay.</em>]} />
    </FrameTone>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="on-dark relative h-[86svh] min-h-[34rem] overflow-hidden bg-evergreen">
      <motion.div className="absolute inset-0" initial={{ scale: reduce ? 1 : 1.15 }} animate={{ scale: 1 }} transition={{ duration: 3.2, ease }}>
        <Photo name="estate-forest-aerial" priority sizes="100vw" className="size-full" frame={false} />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-evergreen/55 via-transparent to-evergreen/30" />
      <motion.p
        className="wrap absolute inset-x-0 bottom-8 text-center type-caption text-ivory/80 md:text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        Four suites, tucked into the forest canopy.
      </motion.p>
    </section>
  );
}

function Opening() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap grid-site items-end gap-y-12">
        <div className="col-span-4 flex flex-col items-center text-center md:col-span-12 md:items-start md:text-left lg:col-span-6">
          <Reveal>
            <Eyebrow time="07:00">Accommodation at The Plantation</Eyebrow>
          </Reveal>
          <SplitHeading as="h1" className="mt-6 type-hero text-evergreen" lines={['Your space', <em key="u">to unwind.</em>]} />
        </div>
        <Reveal className="col-span-4 flex flex-col items-center text-center md:col-span-8 md:col-start-3 lg:col-span-5 lg:col-start-8 lg:items-start lg:text-left">
          <p className="type-body-l text-stone">
            Spacious four-star guest suites in a charming forest, only fifteen minutes from central Gqeberha. Perfect for wedding and function guests, for longer
            stays and for business travellers who would rather wake up to birdsong. If you love nature, peace and tranquillity, you will love it here.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
            <Button href={booking.plantationSuites}>Book online</Button>
            <Button variant="link" href="#suites" className="text-forest">The suites</Button>
          </div>
          <p className="mt-8 type-caption text-stone">An award-winning Best Value destination on AfriStay.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* Suite viewer: choose a suite, browse its rooms ------------------------------ */
function Suites() {
  const [active, setActive] = useState(0);
  const [photo, setPhoto] = useState(0);
  const suite = suites[active];
  const choose = (i) => {
    setActive(i);
    setPhoto(0);
  };
  return (
    <section id="suites" className="scroll-mt-20 bg-ivory pb-[var(--section)]">
      <div className="wrap">
        <div role="tablist" aria-label="Suites" className="flex justify-center gap-2 border-b border-charcoal/15 md:justify-start md:gap-10">
          {suites.map((s, i) => (
            <button
              key={s.key}
              role="tab"
              id={`tab-${s.key}`}
              aria-selected={active === i}
              aria-controls={`panel-${s.key}`}
              onClick={() => choose(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') choose((i + 1) % suites.length);
                if (e.key === 'ArrowLeft') choose((i - 1 + suites.length) % suites.length);
              }}
              tabIndex={active === i ? 0 : -1}
              className={`relative min-h-12 px-2 pb-4 font-display text-[clamp(1.25rem,2.2vw,2rem)] transition-colors duration-500 ${
                active === i ? 'text-evergreen' : 'text-stone hover:text-evergreen'
              }`}
            >
              {s.name}
              {active === i && <motion.span layoutId="suite-tab" className="absolute inset-x-0 -bottom-px h-px bg-forest" transition={{ duration: 0.6, ease }} />}
            </button>
          ))}
        </div>

        <div id={`panel-${suite.key}`} role="tabpanel" aria-labelledby={`tab-${suite.key}`} className="grid-site mt-12 gap-y-12 lg:mt-16">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            <Frame className="aspect-[3/2]" innerClassName="bg-ivory-deep">
              <AnimatePresence initial={false}>
                <motion.div
                  key={suite.photos[photo]}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1, ease: cinema } }}
                  exit={{ zIndex: -1, transition: { duration: 1 } }}
                >
                  <Photo name={suite.photos[photo]} sizes="(min-width: 1024px) 66vw, 100vw" className="size-full" frame={false} />
                </motion.div>
              </AnimatePresence>
            </Frame>
            <ul className="mt-[var(--gutter)] grid grid-cols-4 gap-[var(--gutter)]" aria-label={`${suite.name} photos`}>
              {suite.photos.map((p, i) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => setPhoto(i)}
                    aria-label={`Show photo ${i + 1} of ${suite.photos.length}`}
                    aria-pressed={photo === i}
                    className={`group block w-full transition-opacity duration-500 ${photo === i ? 'opacity-100' : 'opacity-55 hover:opacity-100'}`}
                  >
                    <Photo name={p} sizes="16vw" className="aspect-[3/2]" hover alt="" frameSize="sm" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={suite.key}
              className="col-span-4 flex flex-col items-center text-center md:col-span-8 md:col-start-3 lg:col-span-4 lg:items-start lg:pt-6 lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <p className="type-label text-stone">Suite {active + 1} of {suites.length}</p>
              <h2 className="mt-6 type-h2 text-evergreen">{suite.name}</h2>
              <p className="mt-6 font-display text-2xl italic leading-snug text-forest">{suite.line}</p>
              <p className="mt-6 type-body-l text-stone">{suite.body}</p>
              <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-start">
                {suite.extras.map((e) => (
                  <li key={e} className="flex items-center gap-2 type-label text-forest">
                    <span aria-hidden="true" className="size-1 rounded-full bg-champagne" />
                    {e}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
                <Button href={booking.plantationSuites}>Check availability</Button>
                <Button variant="link" href="#enquire" className="text-forest">Ask a question</Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function InEverySuite() {
  return (
    <section className="section-y bg-ivory-deep">
      <div className="wrap grid-site items-start gap-y-16">
        <div className="relative col-span-4 md:col-span-5 lg:col-span-4">
          <Photo name="breakfast-tray" sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5]" reveal="bottom" parallax={5} />
          <p className="mt-4 text-center type-caption text-stone md:text-left">Breakfast, cooked or continental.</p>
        </div>
        <div className="col-span-4 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-6">
          <Intro eyebrow="In every suite" title={['The details', <em key="t">are taken care of.</em>]} />
          <Reveal group as="ul" gap={0.05} className="mt-12 grid gap-x-[var(--gutter)] sm:grid-cols-2">
            {amenities.map((a) => (
              <Reveal.Item as="li" key={a} className="border-t border-charcoal/15 py-4 text-center type-body text-charcoal sm:text-left">
                {a}
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Things to do, laid out like a timetable of distances ------------------------- */
function Nearby() {
  return (
    <section className="on-dark relative overflow-hidden bg-forest text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[60svh] lg:min-h-full">
          <Photo name="church-sardinia" sizes="(min-width: 1024px) 50vw, 100vw" className="!absolute inset-0" parallax={6} frame={false} />
        </div>
        <div className="px-[var(--margin)] py-[var(--section)] lg:px-[calc(var(--margin)*1.5)]">
          <Intro eyebrow="Nature, peace and tranquillity" title={['Out of the door,', <em key="s">into the wild.</em>]} />
          <ol className="mt-14">
            {nearby.map(([when, what], i) => (
              <motion.li
                key={what}
                className="grid gap-1 border-t border-ivory/15 py-5 text-center md:grid-cols-[8rem_1fr] md:gap-6 md:text-left"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0, transition: { duration: 0.7, ease, delay: i * 0.04 } }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <span className="font-display text-lg italic text-champagne">{when}</span>
                <span className="type-body-l">{what}</span>
              </motion.li>
            ))}
          </ol>
          <p className="mt-10 text-center type-caption text-mist md:text-left">An ideal base for exploring Nelson Mandela Bay and the start of the Garden Route.</p>
        </div>
      </div>
    </section>
  );
}

function AlsoStay() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap grid-site items-center gap-y-12">
        <div className="col-span-4 md:col-span-6 lg:col-span-5">
          <Photo name="church-pool" sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3]" reveal="right" />
        </div>
        <div className="col-span-4 md:col-span-6 lg:col-span-5 lg:col-start-7">
          <Intro
            time="08:00"
            eyebrow="Also ours"
            title={['39 on Church,', <em key="w">in Walmer.</em>]}
            body="Twelve more four-star rooms, five kilometres away, with a pool, two lounges and an honesty bar. Plantation wedding and event guests receive 15% off, and a shuttle service is available."
            actions={<Button variant="link" to="/39-on-church" className="text-forest">Discover 39 on Church</Button>}
          />
        </div>
      </div>
    </section>
  );
}
