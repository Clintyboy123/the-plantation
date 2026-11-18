import { useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
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
import { booking, church } from '../content/site';
import { cinema, ease } from '../utils/motion';

// 39 on Church: content from 39onchurch.co.za (home, accommodation, conferencing), 2026-11-18.
const rooms = [
  {
    name: 'Queen suites',
    photo: 'church-queen-2',
    body: 'Ideal for one or two: comfy queen beds and en-suite bathrooms with a shower or bath. Four have patios and three look onto the garden.',
  },
  {
    name: 'Twin suites',
    photo: 'church-twin',
    body: 'Two suites with twin beds for friends or colleagues travelling together, each with an en-suite bathroom and tranquil garden views.',
  },
  {
    name: 'King suite',
    photo: 'church-king',
    body: 'A king-sized bed, loads of space and an en-suite shower, set slightly apart from the other rooms for privacy.',
  },
  {
    name: 'Family suite',
    photo: 'church-family',
    body: 'Bright and airy, with a queen bed and two single beds, and both a shower and a bath. A microwave, cutlery and crockery can be added on request.',
  },
  {
    name: 'Self-catering garden cottage',
    photo: 'church-cottage',
    body: 'For longer stays: a one-bedroom cottage with a queen bed, full kitchenette, shower and a separate lounge with a double sleeper couch. Self-catering or bed and breakfast.',
  },
];

const inRoom = ['High-speed fibre Wi-Fi', 'DSTV', 'Air conditioning', 'In-room toiletries', 'Mini fridge', 'Tea and coffee station', 'En-suite bathroom', 'Breakfast included'];

const testimonials = [
  { quote: 'If you’re looking for a home stay in PE with hotel-like facilities but a homely feel from the staff, this is the one for you. I wouldn’t go anywhere else if I was back in town.', name: 'Brad Taylor' },
  { quote: 'Excellent in every respect: friendly and accommodating hosts, lovely room and great food. The conference facility was very user friendly. Perfect location for a business trip.', name: 'Bryan Haller' },
  { quote: 'We were welcomed with smiles and we left feeling very special! The food was excellent, the service was amazing and nothing was ever a problem for the team.', name: 'Tessa Brunette' },
];

export default function Church() {
  return (
    <FrameTone tone="charcoal">
      <Seo
        title="39 on Church"
        description="39 on Church, Walmer: a four-star boutique guest house and conference centre with twelve rooms, a pool, legendary breakfasts and a conference room for 60, five minutes from Gqeberha airport."
      />
      <Hero />
      <Welcome />
      <Rooms />
      <Property />
      <Conferencing />
      <section className="section-y bg-ivory-deep text-evergreen">
        <div className="wrap">
          <Reveal className="flex justify-center">
            <Eyebrow>Guests say</Eyebrow>
          </Reveal>
          <Testimonials items={testimonials} className="mt-12" />
          <Reveal className="mt-12 flex justify-center">
            <Button variant="link" href={church.tripadvisor} className="text-forest">Reviews on Tripadvisor</Button>
          </Reveal>
        </div>
      </section>
      <EnquirySection
        type="church"
        title={['Stay or meet', <em key="c">at 39 on Church.</em>]}
        contact={{ phone: church.phone, phoneHref: church.phoneHref, email: church.email }}
        bg="bg-ivory text-charcoal"
      />
    </FrameTone>
  );
}

/* Light, architectural opening: the words first, then the building ------------- */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-ivory pt-36 lg:pt-44">
      <div className="wrap">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
            <Eyebrow time="08:00">39 on Church · Walmer · Part of The Plantation</Eyebrow>
          </motion.div>
          <SplitHeading as="h1" onMount delay={0.8} className="mt-6 type-hero text-evergreen" lines={['A welcoming stay,', <em key="t">thoughtfully experienced.</em>]} />
        </div>
      </div>
      <motion.div
        className="wrap mt-14 lg:mt-20"
        initial={reduce ? false : { opacity: 0, y: 48, scale: 1.04, filter: 'blur(18px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: cinema, delay: 1.2 }}
      >
        <Photo name="church-patio" priority sizes="100vw" className="aspect-[4/3] md:aspect-[21/9]" parallax={6} />
      </motion.div>
    </section>
  );
}

function Welcome() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap grid-site gap-y-12">
        <Reveal className="col-span-4 text-center type-lede text-evergreen md:col-span-12 md:text-left lg:col-span-7">
          <p>
            A hybrid hotel: all the facilities of a large establishment, with the <em>intimacy and personal touch</em> of a guest house.
          </p>
        </Reveal>
        <Reveal className="col-span-4 flex flex-col items-center text-center md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-9 lg:items-start lg:text-left">
          <p className="type-body-l text-stone">
            Warm, friendly service, twelve four-star rooms and premium conference facilities in the leafy suburb of Walmer, five minutes from the airport and close
            to all of Nelson Mandela Bay.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
            <Button href={booking.church}>Book now</Button>
            <Button variant="link" href="#enquire" className="text-forest">Enquire</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Room index: names set large; the room's photograph follows the pointer -------- */
function Rooms() {
  const [hovered, setHovered] = useState(null);
  const area = useRef(null);
  // The preview trails the pointer on an Easy Ease tween (no spring), like every other animation.
  const sx = useMotionValue(0);
  const sy = useMotionValue(0);
  const follow = { duration: 0.45, ease };
  const move = (e) => {
    const r = area.current.getBoundingClientRect();
    animate(sx, e.clientX - r.left, follow);
    animate(sy, e.clientY - r.top, follow);
  };
  return (
    <section className="section-y bg-ivory-deep">
      <div className="wrap">
        <div className="grid-site items-end gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <Intro eyebrow="Accommodation" title={['Twelve rooms,', <em key="o">and a cottage.</em>]} />
          </div>
          <Reveal className="col-span-4 text-center md:col-span-12 lg:col-span-4 lg:col-start-9 lg:text-left">
            <p className="type-body text-stone">Spacious rooms with everything you need for a productive, enjoyable trip. And the breakfasts are legendary.</p>
          </Reveal>
        </div>

        <div ref={area} onMouseMove={move} onMouseEnter={(e) => { const r = area.current.getBoundingClientRect(); sx.jump(e.clientX - r.left); sy.jump(e.clientY - r.top); }} onMouseLeave={() => setHovered(null)} className="relative mt-16">
          <ul className="border-t border-charcoal/15">
            {rooms.map((r, i) => (
              <li key={r.name} onMouseEnter={() => setHovered(i)} className="grid-site items-baseline gap-y-6 border-b border-charcoal/15 py-10 lg:py-12">
                <Photo name={r.photo} sizes="100vw" className="col-span-4 aspect-[4/3] md:col-span-12 lg:hidden" />
                <span className="hidden font-display text-lg italic text-forest lg:col-span-1 lg:block">0{i + 1}</span>
                <h3 className="col-span-4 text-center type-h2 text-evergreen md:col-span-12 md:text-left lg:col-span-6">{r.name}</h3>
                <p className="col-span-4 text-center type-body text-stone md:col-span-10 md:text-left lg:col-span-4 lg:col-start-9">{r.body}</p>
              </li>
            ))}
          </ul>
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[20rem] lg:block"
                style={{ x: sx, y: sy, translateX: '-50%', translateY: '-60%' }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
              >
                <Frame className="aspect-[4/5] rounded-[18px] bg-ivory-deep shadow-[0_30px_60px_-20px_rgb(32_45_37/0.45)]">
                  {rooms.map((r, i) => (
                    <div key={r.name} className={`absolute inset-0 transition-opacity duration-500 ${hovered === i ? 'opacity-100' : 'opacity-0'}`}>
                      <Photo name={r.photo} sizes="20rem" className="size-full" alt="" frame={false} />
                    </div>
                  ))}
                </Frame>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Reveal className="mt-16">
          <h3 className="text-center type-label text-stone md:text-left">In every room</h3>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 md:justify-start">
            {inRoom.map((a) => (
              <li key={a} className="flex items-center gap-3 type-body text-charcoal">
                <span aria-hidden="true" className="size-1 rounded-full bg-champagne" />
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* The property: one large frame, two stacked ------------------------------------ */
function Property() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap">
        <Intro
          eyebrow="The property"
          title={['A quiet cul-de-sac,', <em key="h">in the heart of the city.</em>]}
          body="A sunny dining room, two luxurious lounges, an honesty bar and the most magnificent pool in a lush green garden, with secure off-street parking."
          bodyClass="max-w-[36rem]"
        />
        <div className="grid-site mt-16 gap-y-[var(--gutter)] lg:mt-20">
          <figure className="col-span-4 md:col-span-8">
            <Photo name="church-pool" sizes="(min-width: 768px) 66vw, 100vw" className="aspect-[4/3] md:h-full md:aspect-auto md:min-h-[36rem]" reveal="left" />
          </figure>
          <div className="col-span-4 grid gap-[var(--gutter)] md:col-span-4">
            <figure>
              <Photo name="church-dining" sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3]" reveal="bottom" />
              <figcaption className="mt-3 text-center type-caption text-stone md:text-left">The breakfast room</figcaption>
            </figure>
            <figure>
              <Photo name="church-bar" sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3]" reveal="bottom" />
              <figcaption className="mt-3 text-center type-caption text-stone md:text-left">The honesty bar and lounge</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function Conferencing() {
  return (
    <section className="on-dark section-y bg-forest text-ivory">
      <div className="wrap grid-site items-center gap-y-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-5">
          <Intro
            eyebrow="Conferencing"
            title={['Focused space,', <em key="w">properly looked after.</em>]}
            body="A peaceful setting, high-speed Wi-Fi, top-notch facilities, good food and rooms upstairs: the ideal venue for a conference, meeting, presentation or training."
            actions={<Button variant="light" href="#enquire">Enquire about conferencing</Button>}
          />
          <Reveal group className="mt-14 grid grid-cols-2 gap-x-[var(--gutter)]">
            {[
              ['60', 'Delegates in the fully equipped conference room'],
              ['10', 'Around the boardroom table'],
            ].map(([n, l]) => (
              <Reveal.Item key={n} className="border-t border-champagne/50 pt-5 text-center md:text-left">
                <p className="type-numeral text-champagne">{n}</p>
                <p className="mt-3 type-caption text-mist">{l}</p>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
        <div className="overlap-group col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
          <Photo name="church-conference-2" sizes="(min-width: 768px) 50vw, 100vw" className="overlap-item aspect-[4/3]" reveal="right" frame="ivory" />
          <Photo name="church-boardroom" sizes="25vw" className="overlap-item -mt-20 ml-auto aspect-square w-[44%] rounded-[18px] bg-forest ring-[6px] ring-forest" reveal="bottom" frame="ivory" />
        </div>
      </div>
    </section>
  );
}
