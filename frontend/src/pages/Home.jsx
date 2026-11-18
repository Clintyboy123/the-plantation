import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Seo from '../components/Seo';
import Photo from '../components/Photo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import SplitHeading from '../components/SplitHeading';
import ScrollFadeLines from '../components/ScrollFadeLines';
import Marquee from '../components/Marquee';
import Carousel from '../components/Carousel';
import FairyLights from '../components/FairyLights';
import PathList from '../components/PathList';
import FairyDust from '../components/FairyDust';
import { booking } from '../content/site';
import { clients, dishes } from '../content/home';
import { ease, duration } from '../utils/motion';

export default function Home() {
  return (
    <>
      <Seo description="A family-owned forest estate in Gqeberha for award-winning weddings, corporate events and conferences, boutique accommodation, The Boma and 39 on Church." />
      <Hero />
      <Opening />
      <DayIntro />
      <Morning />
      <Walmer />
      <Business />
      <Ceremony />
      <Supper />
      <Boma />
      <Finale />
    </>
  );
}

/* ------------------------------------------------------------------------ */
/* Hero: dusk on the estate. The photograph settles from a slow zoom, the     */
/* headline rises line by line once the opening curtain has lifted.           */
/* ------------------------------------------------------------------------ */
// The headline starts gathering as the opening intro (or the page curtain) clears and takes 2 s;
// the rest of the hero text fades in once it has settled.
const HERO_DUST = 0.6;
const AFTER_TITLE = HERO_DUST + 2;

function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="on-dark relative h-[100svh] min-h-[40rem] overflow-hidden bg-evergreen text-ivory">
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: reduce ? 1 : 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.2, ease }}
        >
          <Photo name="hero-dusk" priority sizes="100vw" className="size-full" frame={false} />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-evergreen/95 via-evergreen/45 to-evergreen/25" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgb(32_45_37/0.55),transparent_45%,transparent_60%,rgb(32_45_37/0.5))]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="wrap relative flex h-full flex-col justify-end pb-24 md:pb-24">
        <div className="grid-site items-end gap-y-10">
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-12 md:items-start md:text-left lg:col-span-8">
            {/* Order: the headline gathers out of fairy dust first (2 s); everything else fades in after it. */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: AFTER_TITLE, duration: 0.8, ease }}>
              <Eyebrow className="text-champagne">
                <span className="hidden sm:inline">Lovemore Park · </span>Gqeberha · Est. 2006
              </Eyebrow>
            </motion.div>
            <FairyDust as="h1" delay={HERO_DUST} sparks={34} className="mt-6 type-hero" lines={['Where life’s most', 'beautiful moments', <em key="u">unfold.</em>]} />
          </div>
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left lg:col-span-4 lg:col-start-9">
            <motion.p
              className="max-w-[24rem] type-body-l text-ivory/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: AFTER_TITLE + 0.15, duration: 0.8, ease }}
            >
              Discover a destination for extraordinary celebrations, exceptional hospitality and unforgettable experiences.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col items-center gap-x-8 gap-y-3 sm:flex-row md:items-center lg:flex-col lg:items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: AFTER_TITLE + 0.3, duration: 0.8, ease }}
            >
              <Button variant="light" href="#estate">Explore The Plantation</Button>
              <Button variant="link" href="#the-day" className="text-ivory">Discover our experiences</Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-14 hidden items-center justify-between border-t border-ivory/20 pt-6 type-caption text-ivory/70 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: AFTER_TITLE + 0.45, duration: 0.8, ease }}
        >
          <span className="flex items-center gap-4">
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-ivory/20">
              <span className="absolute inset-0 bg-ivory" style={{ animation: 'scroll-cue 2.4s var(--ease-cinema) infinite' }} />
            </span>
            Scroll to begin the day
          </span>
          <span className="font-display text-base italic">S 34° 00′ · E 25° 32′</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* The estate: who they are, told in one long editorial sentence.            */
/* ------------------------------------------------------------------------ */
function Opening() {
  const facts = [
    ['2006', 'Opened as Port Elizabeth’s first custom-built, all-in-one wedding venue'],
    ['3', 'Venues: The Plantation, The Boma and 39 on Church'],
    ['200', 'Guests, at the most, for a wedding or event'],
    ['16', 'Four-star rooms on and off the estate'],
  ];
  return (
    <section id="estate" className="section-y scroll-mt-0 bg-ivory">
      <div className="wrap">
        <div className="grid-site">
          <Reveal className="col-span-4 flex justify-center md:col-span-12">
            <Eyebrow>The estate</Eyebrow>
          </Reveal>
          {/* centred, and read in line by line as the visitor scrolls */}
          <ScrollFadeLines
            as="h2"
            className="col-span-4 mt-6 text-center type-h2 text-balance text-evergreen md:col-span-12 lg:col-span-10 lg:col-start-2"
            lines={[
              'Since 2006, one family has cared for',
              'this forest on Sardinia Bay Road, and for',
              <span key="l">the <em>weddings, gatherings and quiet stays</em></span>,
              'that happen beneath it.',
            ]}
          />
        </div>

        <div className="grid-site mt-20 gap-y-16 lg:mt-28">
          <div className="col-span-4 md:col-span-5 lg:col-span-4 lg:col-start-2">
            <Photo name="estate-aerial" sizes="(min-width: 768px) 35vw, 100vw" className="aspect-[4/5]" reveal="bottom" parallax={6} frame="champagne" />
            <p className="mt-4 text-center type-caption text-stone md:text-left">The estate from above, at the start of the Garden Route.</p>
          </div>
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-6 md:col-start-7 md:items-start md:text-left lg:col-span-5 lg:col-start-7 lg:pt-24">
            <Reveal className="max-w-[32rem] type-body-l text-stone">
              <p>
                What began as a family’s dream to move to the Eastern Cape has become one of South Africa’s most awarded wedding and event venues. It is still
                owner-managed, and still run with the same attention to detail.
              </p>
              <p className="mt-6">
                A forest chapel, a light-filled ballroom, four suites among the trees, The Boma next door and 39 on Church in Walmer: whichever you choose, the
                welcome is the same.
              </p>
            </Reveal>
            <Reveal group className="mt-14 grid w-full max-w-[32rem] grid-cols-2 gap-x-[var(--gutter)] gap-y-10">
              {facts.map(([n, label]) => (
                <Reveal.Item key={n} className="border-t border-champagne pt-5">
                  <p className="type-numeral text-forest">{n}</p>
                  <p className="mt-3 type-caption text-stone">{label}</p>
                </Reveal.Item>
              ))}
            </Reveal>
            <Reveal className="mt-12">
              <Button variant="link" to="/our-story" className="text-forest">Our story</Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* The idea, stated once: the rest of the page is a day on the estate.       */
/* ------------------------------------------------------------------------ */
function DayIntro() {
  return (
    <section id="the-day" className="bg-ivory pb-20 lg:pb-28">
      <div className="wrap">
        <div className="mx-auto h-24 w-px bg-champagne" aria-hidden="true" />
        <Intro
          className="mt-14"
          align="center"
          eyebrow="Our experiences"
          title={['From first light', <em key="f">to fairy light.</em>]}
          size="type-h1"
          bodyClass="max-w-[30rem]"
          body="Breakfast on a forest patio, a strategy session in the ballroom, vows in the chapel, supper by the fire. Here is a day at The Plantation."
        />
      </div>
    </section>
  );
}

/* 07:00 — Accommodation ---------------------------------------------------- */
function Morning() {
  return (
    <section className="bg-ivory pb-[var(--section)]">
      <div className="wrap">
        <div className="grid-site items-center gap-y-20">
          <div className="order-2 col-span-4 md:col-span-5 lg:order-1 lg:col-span-4">
            <Intro
              time="07:00"
              eyebrow="Accommodation"
              title={['Your space', <em key="u">to unwind.</em>]}
              body="Spacious four-star suites in a charming forest, fifteen minutes from central Gqeberha. Private patios, breakfast cooked or continental, and birdsong for an alarm."
              actions={
                <>
                  <Button to="/accommodation">The suites</Button>
                  <Button variant="link" href={booking.plantationSuites} className="text-forest">Book online</Button>
                </>
              }
            />
          </div>
          <div className="overlap-group relative order-1 col-span-4 md:col-span-7 md:col-start-6 lg:order-2 lg:col-span-7 lg:col-start-6">
            <Photo name="honeymoon-4" sizes="(min-width: 1024px) 55vw, 100vw" className="overlap-item aspect-[4/3]" reveal="left" parallax={5} frame="sage" />
            <div className="absolute -bottom-12 -left-4 w-[42%] md:-left-[18%] md:w-[40%]">
              <Photo name="breakfast-tray" sizes="20vw" className="overlap-item aspect-square rounded-[18px] bg-ivory ring-[6px] ring-ivory" reveal="bottom" frame="sage" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 08:00 — 39 on Church ----------------------------------------------------- */
function Walmer() {
  const frames = [
    { name: 'church-pool', offset: 'lg:mt-0', speed: 4 },
    { name: 'church-queen', offset: 'lg:mt-32', speed: 9 },
    { name: 'church-conference', offset: 'lg:mt-16', speed: 6 },
  ];
  return (
    <section className="section-y bg-ivory-deep">
      <div className="wrap">
        <div className="grid-site items-end gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-6">
            <Intro time="08:00" eyebrow="39 on Church, Walmer" title={['Ten minutes away,', <em key="w">in leafy Walmer.</em>]} />
          </div>
          <Reveal className="col-span-4 flex flex-col items-center text-center md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-9 lg:items-start lg:text-left">
            <p className="type-body-l text-stone">
              Our boutique guest house and conference centre: twelve four-star rooms, legendary breakfasts and a magnificent pool in a lush garden, with a
              conference room for up to sixty. Plantation wedding and event guests receive 15% off, with a shuttle to the estate.
            </p>
            <div className="mt-10">
              <Button variant="link" to="/39-on-church" className="text-forest">Discover 39 on Church</Button>
            </div>
          </Reveal>
        </div>
        <div className="mt-20 grid grid-cols-3 gap-[var(--gutter)] lg:mt-24">
          {frames.map((f, i) => (
            <div key={f.name} className={`${f.offset} ${i === 1 ? '' : ''}`}>
              <Photo name={f.name} sizes="33vw" className="aspect-[3/4]" reveal="bottom" parallax={f.speed} frame="charcoal" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 10:00 — Corporate -------------------------------------------------------- */
function Business() {
  const specs = [
    ['Up to 200', 'guests, with no minimum'],
    ['10 minutes', 'from Gqeberha’s airport'],
    ['In-house', 'catering, bar, décor, sound and staging'],
    ['Always on', 'high-speed Wi-Fi and a full backup generator'],
  ];
  return (
    <section className="section-y overflow-hidden bg-sage-light">
      <div className="wrap">
        <div className="grid-site gap-y-14">
          <div className="col-span-4 md:col-span-12 lg:col-span-6">
            <Intro
              time="10:00"
              eyebrow="Corporate & events"
              title={['Exceptional spaces.', <em key="m">Meaningful connections.</em>]}
              body="Private, exclusive and close to the city: conferences, launches, strategy sessions and banquets, catered by the kitchen that wins awards for weddings."
              actions={<Button to="/corporate">Corporate & events</Button>}
            />
          </div>
          <Reveal group className="col-span-4 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 self-end md:col-span-12 lg:col-span-5 lg:col-start-8">
            {specs.map(([big, small]) => (
              <Reveal.Item key={big} className="border-t border-forest/30 pt-5 text-center md:text-left">
                <p className="type-h3 text-forest">{big}</p>
                <p className="mt-2 type-caption text-stone">{small}</p>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </div>
      <div className="wrap mt-20 lg:mt-24">
        <Photo name="corp-ballroom" sizes="100vw" className="aspect-[4/3] md:aspect-[21/9]" reveal="right" parallax={6} frame="forest" />
      </div>
      <div className="mt-16 lg:mt-20">
        <p className="wrap mb-6 text-center type-label text-stone">Hosts to</p>
        <Marquee items={clients} className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] italic text-forest" />
      </div>
    </section>
  );
}

/* 15:30 — Weddings: the chapel opens up to fill the screen as you scroll ------ */
function Ceremony() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const clip = useTransform(scrollYProgress, [0, 0.55], ['inset(14% 26% 14% 26%)', 'inset(0% 0% 0% 0%)']);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.3, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.45, 0.75], [60, 0]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const shade = useTransform(scrollYProgress, [0.3, 0.65], [0, 0.6]);

  return (
    <section className="bg-ivory">
      <div ref={ref} className={reduce ? '' : 'h-[260vh]'}>
        <div className={`${reduce ? '' : 'sticky top-0'} h-[100svh] overflow-hidden`}>
          <motion.div className="on-dark absolute inset-0 text-ivory" style={{ clipPath: reduce ? 'none' : clip }}>
            <motion.div className="absolute inset-0" style={{ scale: reduce ? 1 : scale }}>
              <Photo name="chapel-aisle" sizes="100vw" className="size-full" frame={false} />
            </motion.div>
            <motion.div aria-hidden="true" className="absolute inset-0 bg-evergreen" style={{ opacity: reduce ? 0.6 : shade }} />
            <motion.div style={{ opacity: reduce ? 1 : textOpacity, y: reduce ? 0 : textY }} className="wrap relative flex h-full flex-col items-center justify-center text-center">
              <Eyebrow time="15:30" className="text-champagne">Weddings</Eyebrow>
              {/* one line from tablets up; phones wrap naturally */}
              <h2 className="mt-6 type-hero text-balance md:whitespace-nowrap">
                Vows, beneath <em>the trees.</em>
              </h2>
              <p className="mt-8 max-w-[30rem] type-body-l text-ivory/85">
                Light streams through the open sides of the forest chapel while birds sing through your vows.
              </p>
            </motion.div>
          </motion.div>
          {!reduce && (
            <motion.p style={{ opacity: labelOpacity }} className="absolute inset-x-0 top-[6%] text-center type-label text-stone">
              <span className="font-display text-[1.0625rem] italic normal-case tracking-normal">15:30</span> · The forest chapel
            </motion.p>
          )}
        </div>
      </div>

      <div className="wrap section-y">
        <div className="grid-site gap-y-20">
          <div className="overlap-group relative col-span-4 md:col-span-6 lg:col-span-5">
            <Photo name="couple-forest" sizes="(min-width: 768px) 40vw, 100vw" className="overlap-item aspect-[4/5]" reveal="bottom" parallax={5} frame="gold" />
            <div className="absolute -right-4 -bottom-14 w-[46%] md:-right-[22%]">
              <Photo name="bride-mirror" sizes="20vw" className="overlap-item aspect-[3/4] rounded-[18px] bg-ivory ring-[6px] ring-ivory" reveal="bottom" frame="gold" />
            </div>
          </div>
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-5 md:col-start-8 md:items-start md:text-left lg:col-span-5 lg:col-start-8 lg:pt-20">
            <Reveal as="blockquote" className="type-lede text-evergreen">
              <p>
                “All I had to do was rock up in a white dress, say I do and enjoy my <em>fairy-tale day</em> with my husband.”
              </p>
              <footer className="mt-6 type-label not-italic text-stone">Faye & Riekert du Preez</footer>
            </Reveal>
            <Reveal className="mt-14 w-full border-t border-champagne pt-8">
              <p className="type-body-l text-stone">
                A forest chapel, a ballroom wrapped in a fairy-lit porch, a French-inspired Bridal Boudoir and a honeymoon suite with breakfast in bed. For ten to
                two hundred guests, with in-house planners who take care of everything.
              </p>
              <p className="mt-6 type-caption text-forest">
                <span className="font-display text-base italic">Wedding Venue of the Year</span> · South Africa Prestige Awards 2025
              </p>
            </Reveal>
            <Reveal className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 md:justify-start">
              <Button to="/weddings">Weddings</Button>
              <Button variant="link" to="/enquire?type=wedding" className="text-forest">Check your date</Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 18:30 — Cuisine: a carousel of plates you browse at your own pace ---------- */
function Supper() {
  return (
    <section className="on-dark section-y bg-forest text-ivory">
      <div className="wrap">
        <div className="grid-site items-end gap-y-8">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <Intro time="18:30" eyebrow="Cuisine" title={['Award-winning chefs.', <em key="p">Plated with care.</em>]} />
          </div>
          <Reveal className="col-span-4 flex flex-col items-center text-center md:col-span-12 lg:col-span-4 lg:col-start-9 lg:items-start lg:text-left">
            <p className="type-body text-mist">From canapés on the porch to a Karoo feast at the table, every menu is made here and tailored to you.</p>
            <div className="mt-8">
              <Button variant="link" to="/cuisine" className="text-champagne">Our cuisine</Button>
            </div>
          </Reveal>
        </div>
      </div>
      <Carousel label="Dishes from The Plantation kitchen" className="mt-16 lg:mt-20">
        {dishes.map((d) => (
          <figure key={d.photo} className="w-[72vw] sm:w-[44vw] lg:w-[24vw]">
            <Photo name={d.photo} sizes="(min-width: 1024px) 24vw, 72vw" className="aspect-[4/5]" frame="champagne" />
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="font-display text-xl">{d.name}</span>
              <span className="type-label text-champagne">{d.course}</span>
            </figcaption>
          </figure>
        ))}
        <div className="flex aspect-[4/5] w-[60vw] items-center justify-center sm:w-[30vw] lg:w-[18vw]">
          <Link to="/cuisine" className="group flex flex-col items-center gap-4 text-center">
            <span className="flex size-28 items-center justify-center rounded-full ring-1 ring-champagne/60 transition-colors duration-500 group-hover:bg-champagne group-hover:text-evergreen">
              <span className="type-nav">Menus</span>
            </span>
            <span className="type-caption text-mist">See the full cuisine</span>
          </Link>
        </div>
      </Carousel>
    </section>
  );
}

/* 20:30 — The Boma ------------------------------------------------------------ */
function Boma() {
  return (
    <section className="on-dark relative overflow-hidden bg-evergreen text-ivory">
      <div className="relative min-h-[110svh]">
        <Photo name="boma-garden" sizes="100vw" className="absolute inset-0" parallax={8} frame={false} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-evergreen/85 via-evergreen/45 to-evergreen" />
        <FairyLights count={60} />
        <div className="wrap relative flex min-h-[110svh] flex-col items-center justify-center py-32 text-center">
          <Reveal>
            <Eyebrow time="20:30" className="text-champagne">The Boma, next door</Eyebrow>
          </Reveal>
          <SplitHeading as="h2" className="mt-8 type-hero" gap={0.16} lines={['Bonfires under', <em key="e">the fairy lights.</em>]} />
          <Reveal className="mt-10 max-w-[34rem] type-body-l text-ivory/85">
            A glass-enclosed restaurant, South African buffet food, a large outdoor lawn and crackling bonfires under a fairy-lit forest courtyard. Potjies and
            spitbraais for up to 140 guests.
          </Reveal>
          <Reveal className="mt-10">
            <Button variant="outline" to="/the-boma" className="text-ivory">Discover The Boma</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* After dark — where to begin ------------------------------------------------ */
function Finale() {
  return (
    <section className="on-dark relative overflow-hidden bg-evergreen pb-[var(--section)] text-ivory">
      <FairyLights count={30} className="opacity-50" />
      <div className="wrap relative">
        <div className="mx-auto mb-[var(--section)] h-24 w-px bg-champagne/50" aria-hidden="true" />
        <div className="grid-site mb-16 items-end gap-y-8">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <Intro eyebrow="Begin here" title={['What are you', <em key="p">planning?</em>]} size="type-h1" />
          </div>
          <Reveal className="col-span-4 text-center md:col-span-12 lg:col-span-4 lg:col-start-9 lg:text-left">
            <p className="type-body text-mist">
              Call us on <a className="text-ivory underline decoration-champagne underline-offset-4" href="tel:+27413661591">(041) 366 1591</a>, or choose a
              path below and the right team will reply.
            </p>
          </Reveal>
        </div>
        <PathList />
      </div>
    </section>
  );
}
