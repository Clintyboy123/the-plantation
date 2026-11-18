import { useState } from 'react';
import { motion } from 'motion/react';
import Seo from '../components/Seo';
import Frame, { FrameTone } from '../components/Frame';
import PageHero from '../components/PageHero';
import Photo from '../components/Photo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import FairyLights from '../components/FairyLights';
import EnquirySection from '../components/EnquirySection';
import { boma } from '../content/site';
import { ease, viewportOnce } from '../utils/motion';

// The Boma: content from theplantation.co.za/about and peboma.co.za (2026-11-18).
const occasions = [
  {
    title: 'Weddings',
    photo: 'boma-ceremony',
    body: 'Celebrate beneath the trees, then move into a fairy-lit reception setting made for relaxed socialising. Wedding packages include planning support.',
  },
  {
    title: 'Corporate functions',
    photo: 'boma-drumming',
    body: 'Conferences, team-building sessions and client gatherings in a venue that feels far from the office.',
  },
  {
    title: 'Celebrations',
    photo: 'boma-bonfire',
    body: 'Milestone birthdays, reunions and baby showers: warm, memorable gatherings made easy. Function packages can include music and décor.',
  },
  {
    title: 'Kids’ parties',
    photo: 'boma-drinks',
    body: 'Wide lawns, jungle-gym play and a wet-weather backup make family parties feel joyful instead of stressful.',
  },
];

export default function Boma() {
  return (
    <FrameTone tone="champagne">
    <div className="on-dark bg-evergreen text-ivory">
      <Seo
        title="The Boma"
        description="The Boma, next door to The Plantation in Lovemore Park: a fairy-lit forest courtyard, bonfires, potjiekos and spitbraai for weddings, celebrations and functions of up to 140 guests."
      />
      <div className="relative">
        <PageHero
          photo="boma-courtyard"
          eyebrow="The Boma · Country restaurant & function venue"
          time="20:30"
          lines={['Gather.', 'Connect.', <em key="e">Experience.</em>]}
          align="center"
          overlay="from-evergreen via-evergreen/50 to-evergreen/70"
          body="Next door to The Plantation, beneath a fairy-lit forest canopy."
        />
        <FairyLights count={50} className="z-[1]" />
      </div>
      <Story />
      <Occasions />
      <Table />
      <Cottage />
      <Visit />
      <EnquirySection
        type="boma"
        tone="dark"
        bg="on-dark bg-night text-ivory"
        title={['Plan something', <em key="u">unforgettable.</em>]}
        intro="Ask for a quote, check a date or arrange a viewing. Your message goes to The Boma team."
        contact={{ phone: boma.phone, phoneHref: boma.phoneHref, email: boma.email }}
      />
    </div>
    </FrameTone>
  );
}

/* A collage at three depths, with the story beside it -------------------------- */
function Story() {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="wrap grid-site items-center gap-y-20">
        <div className="overlap-group relative col-span-4 h-[34rem] md:col-span-6 md:h-[44rem] lg:col-span-6">
          <Photo name="boma-garden" sizes="40vw" className="overlap-item !absolute left-0 top-0 aspect-[4/5] w-[66%]" reveal="bottom" parallax={4} />
          <Photo name="boma-seating" sizes="25vw" className="overlap-item !absolute bottom-0 right-0 aspect-[3/4] w-[48%] rounded-[18px] bg-evergreen ring-[6px] ring-evergreen" reveal="bottom" parallax={10} />
        </div>
        <div className="col-span-4 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <Intro
            eyebrow="Since 2010"
            title={['Atmosphere,', <em key="n">naturally.</em>]}
            body="The Plantation took over The Boma, next door, in 2010: a more informal venue with a glass-enclosed restaurant, South African buffet food, a large outdoor lawn and crackling bonfires under a fairy-lit forest courtyard."
          />
          <Reveal group className="mt-12 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-8">
            {[
              ['140', 'Guests, for celebrations and buffet-style functions'],
              ['10 min', 'From Walmer, on Sardinia Bay Road'],
            ].map(([n, l]) => (
              <Reveal.Item key={n} className="border-t border-champagne/50 pt-5 text-center md:text-left">
                <p className="type-numeral text-champagne">{n}</p>
                <p className="mt-3 type-caption text-mist">{l}</p>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Four occasions as vertical panels: the one you point at opens up --------------- */
function Occasions() {
  const [open, setOpen] = useState(0);
  return (
    <section className="pb-[var(--section)]">
      <div className="wrap">
        <Intro align="center" eyebrow="Event types" title={['Choose the kind', <em key="c">of celebration.</em>]} />
        <div className="mt-16 flex flex-col gap-[var(--gutter)] lg:h-[38rem] lg:flex-row">
          {occasions.map((o, i) => {
            const isOpen = open === i;
            return (
              <motion.button
                key={o.title}
                type="button"
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                aria-expanded={isOpen}
                className="frame group relative min-h-[24rem] text-left lg:min-h-0"
                data-tone="champagne"
                data-size="md"
                animate={{ flexGrow: isOpen ? 3.2 : 1 }}
                transition={{ duration: 0.9, ease }}
                style={{ flexBasis: 0 }}
              >
                <span className="frame-inner block">
                <Photo name={o.photo} sizes="(min-width: 1024px) 50vw, 100vw" className="!absolute inset-0" alt="" frame={false} />
                <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-night/10 transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-80'}`} />
                {/* Collapsed (desktop): the title stands vertically so it never crowds the narrow panel. */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-8 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-2xl [writing-mode:vertical-rl] transition-opacity duration-500 lg:block ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {o.title}
                </span>
                <div
                  className={`absolute inset-x-0 bottom-0 flex flex-col items-center p-6 text-center transition-opacity duration-500 md:p-8 lg:w-[min(100%,34rem)] lg:items-start lg:text-left ${
                    isOpen ? 'lg:opacity-100' : 'lg:pointer-events-none lg:opacity-0'
                  }`}
                >
                  <span className="font-display text-lg italic text-champagne">0{i + 1}</span>
                  <h3 className="mt-2 type-h3 whitespace-nowrap">{o.title}</h3>
                  <p
                    className={`mt-4 max-w-[26rem] type-body text-ivory/85 transition-[opacity,translate] duration-700 ease-site ${
                      isOpen ? 'lg:translate-y-0 lg:opacity-100 lg:delay-200' : 'lg:translate-y-3 lg:opacity-0'
                    }`}
                  >
                    {o.body}
                  </p>
                </div>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* South African food --------------------------------------------------------------- */
function Table() {
  return (
    <section className="relative overflow-hidden bg-forest section-y">
      <div className="wrap grid-site items-center gap-y-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-5">
          <Intro
            eyebrow="South African dining"
            title={['Potjies, spitbraais', <em key="f">and a fire to gather round.</em>]}
            body="Buffet cuisine, spitbraai, potjiekos and heritage tasting experiences: food meant for sharing, served the way South Africans celebrate."
            actions={<Button variant="link" to="/cuisine" className="text-champagne">Our cuisine</Button>}
          />
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-[var(--gutter)] md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          <Photo name="boma-potjies" sizes="25vw" className="aspect-[3/4]" reveal="bottom" />
          <Photo name="boma-banquet" sizes="25vw" className="mt-16 aspect-[3/4]" reveal="bottom" />
        </div>
      </div>
    </section>
  );
}

function Cottage() {
  return (
    <section className="section-y">
      <div className="wrap grid-site items-center gap-y-12">
        <div className="col-span-4 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          <Photo name="boma-cottage" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3]" reveal="right" parallax={4} />
        </div>
        <div className="col-span-4 md:col-span-6 md:col-start-1 md:row-start-1 lg:col-span-4">
          <Intro
            eyebrow="Stay at The Boma"
            title={['A cottage', <em key="s">for three or four.</em>]}
            body="Extend your time at The Boma with a cottage stay on the grounds. Enquire for available dates and booking details."
            actions={<Button variant="outline" href="#enquire" className="text-ivory">Enquire about the cottage</Button>}
          />
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="relative border-t border-ivory/10 py-[calc(var(--section)*0.75)]">
      <div className="wrap grid-site items-center gap-y-12">
        <Reveal as="blockquote" className="col-span-4 text-center md:col-span-12 md:text-left lg:col-span-7">
          <p className="type-h3">
            “We enjoyed ourselves and everything went smoothly. <em>You were a real pleasure to deal with.</em>”
          </p>
          <footer className="mt-6 type-label text-champagne">Yolande Boezio</footer>
        </Reveal>
        <Reveal className="col-span-4 flex flex-col items-center text-center md:col-span-12 md:items-start md:text-left lg:col-span-4 lg:col-start-9">
          <Eyebrow className="text-champagne">Visit</Eyebrow>
          <address className="mt-6 not-italic type-body text-mist">
            {boma.address.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <p className="mt-4 type-caption text-mist">Please contact us first to arrange a venue viewing.</p>
          <div className="mt-8">
            <Button variant="link" href={boma.url} className="text-champagne">peboma.co.za</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
