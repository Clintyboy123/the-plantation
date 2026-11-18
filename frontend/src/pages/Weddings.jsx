import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Photo from '../components/Photo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import SplitHeading from '../components/SplitHeading';
import Accordion from '../components/Accordion';
import Mosaic from '../components/Mosaic';
import Testimonials from '../components/Testimonials';
import EnquirySection from '../components/EnquirySection';
import VideoFilm from '../components/VideoFilm';
import MomentReel from '../components/MomentReel';
import ImagineSequence from '../components/ImagineSequence';
import Frame, { FrameTone } from '../components/Frame';
import { awards, moments, packages, weddingFacts, weddingTestimonials } from '../content/weddings';
import { church } from '../content/site';
import { cinema, ease, viewportOnce } from '../utils/motion';

export default function Weddings() {
  // Every photograph on the wedding page hangs in a gold frame.
  return (
    <FrameTone tone="gold">
      <Seo
        title="Weddings"
        description="Award-winning forest weddings in Gqeberha: a forest chapel, fairy-lit ballroom, Bridal Boudoir and honeymoon suite, with in-house planning for 10 to 200 guests."
      />
      <PageHero
        photo="bride-forest"
        eyebrow="Weddings at The Plantation"
        lines={['An unforgettable', <em key="b">beginning.</em>]}
        body="Celebrate love surrounded by a magical, fairy-lit forest, with a team that has planned weddings here since 2006."
        actions={
          <>
            <Button variant="light" href="#enquire">Check your date</Button>
            <Button variant="link" href="#packages" className="text-ivory">Packages</Button>
          </>
        }
      />
      <Imagine />
      <TheDay />
      <Figures />
      <Interlude />
      <Packages />
      <Album />
      <Awards />
      <Voices />
      <GuestStays />
      <EnquirySection
        type="wedding"
        title={['Tell us about', <em key="d">your day.</em>]}
        intro="Share a few details and our wedding planners will come back to you with availability, a tailored quote and an invitation to walk the estate."
      />
    </FrameTone>
  );
}

/* "Imagine...": a pinned, scroll-driven sequence, one line at a time, ending on the promise -- */
function Imagine() {
  return (
    <ImagineSequence
      ring
      lines={[
        'Imagine your picture\u2011perfect wedding.',
        'Imagine the time of your life with family and friends, in the most elegant setting.',
        'Imagine celebrating love surrounded by a magical, fairy-lit forest.',
      ]}
      finale={
        <>
          Imagine your wedding
          <br />
          <em>at The Plantation.</em>
        </>
      }
    />
  );
}

/* The day in six moments: a cinematic reel, one framed card per moment (after siena.film) ---- */
function TheDay() {
  return (
    <section className="bg-ivory-deep pt-[var(--section)] pb-[calc(var(--section)*0.6)]">
      <div className="wrap">
        <Intro
          eyebrow="The Plantation experience"
          title={['Your day,', <em key="m">moment by moment.</em>]}
          body="From booking to the last dance, our planners help you enjoy every moment, crafting a celebration as unique as you are."
        />
      </div>
      <div className="mt-12 lg:mt-4">
        <MomentReel moments={moments} />
      </div>
    </section>
  );
}

/* Facts and figures ------------------------------------------------------------ */
function Figures() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap grid-site gap-y-16">
        <div className="col-span-4 flex flex-col items-center text-center md:col-span-12 md:items-start md:text-left lg:col-span-4">
          <Reveal>
            <Eyebrow>Facts & figures</Eyebrow>
          </Reveal>
          <Reveal className="mt-8">
            <p className="whitespace-nowrap font-display text-[clamp(4.5rem,8vw,8.5rem)] font-light leading-[0.85] text-forest">
              10<span className="text-champagne">–</span>200
            </p>
            <p className="mt-4 type-label text-stone">Guests, from intimate to grand</p>
          </Reveal>
        </div>
        <Reveal group as="ul" gap={0.06} className="col-span-4 grid gap-x-[var(--gutter)] md:col-span-12 md:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {weddingFacts.map((f) => (
            <Reveal.Item as="li" key={f} className="flex min-h-16 items-center justify-center gap-4 border-t border-charcoal/15 py-4 text-center type-body-l md:justify-start md:text-left">
              <span aria-hidden="true" className="hidden size-1.5 shrink-0 rounded-full bg-champagne md:block" />
              {f}
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* Night interlude --------------------------------------------------------------- */
function Interlude() {
  return (
    <section className="on-dark relative overflow-hidden bg-evergreen text-ivory">
      <Photo name="estate-night" sizes="100vw" className="!absolute inset-0" parallax={10} frame={false} />
      <div aria-hidden="true" className="absolute inset-0 bg-evergreen/55" />
      <div className="wrap relative flex min-h-[95svh] flex-col items-center justify-center py-32 text-center">
        <Reveal as="blockquote" className="max-w-[52rem]">
          <p className="type-h2">
            “Soft lights, chandeliers and <em>food fit for royalty.</em>”
          </p>
          <footer className="mt-10 type-label text-champagne">Marike & Ruan Muller</footer>
        </Reveal>
      </div>
    </section>
  );
}

/* Packages ------------------------------------------------------------------------ */
function Packages() {
  const [open, setOpen] = useState(0);
  const current = packages[open ?? 0];
  return (
    <section id="packages" className="scroll-mt-20 section-y bg-ivory">
      <div className="wrap">
        <Intro
          eyebrow="Specials & packages"
          title={['Whatever your style', <em key="b">and budget.</em>]}
          body="Choose a pre-built package with everything a perfect wedding needs, or let us build one around you. Each wedding is quoted personally, for your date and your numbers."
        />
        <div className="grid-site mt-16 items-start gap-y-12 lg:mt-20">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <Accordion
              onChange={setOpen}
              items={packages.map((p) => ({
                kicker: p.kicker,
                title: p.name,
                body: (
                  <div className="max-w-[36rem] text-center sm:text-left">
                    <p className="type-body-l text-stone">{p.body}</p>
                    {p.note && <p className="mt-4 type-caption text-forest">{p.note}</p>}
                    <div className="mt-6">
                      <Button variant="link" href="#enquire" className="text-forest">Ask about this package</Button>
                    </div>
                  </div>
                ),
              }))}
            />
            <p className="mt-10 text-center type-caption text-stone md:text-left">
              Availability changes daily with new bookings and cancellations. Tell us your date and we will confirm it, or suggest the closest alternatives.
            </p>
          </div>
          <Frame className="hidden aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:block">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.photo}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.9, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
              >
                <Photo name={current.photo} sizes="30vw" className="size-full" frame={false} />
              </motion.div>
            </AnimatePresence>
          </Frame>
        </div>
      </div>
    </section>
  );
}

/* A short album that opens into the lightbox ---------------------------------- */
function Album() {
  const items = ['chapel-confetti', 'couple-well', 'ballroom-greenery', 'bride-forest', 'sparklers', 'ballroom-cake', 'chapel-kiss', 'couple-golden', 'forest-table'];
  return (
    <section className="section-y bg-ivory-deep">
      <div className="wrap">
        <div className="grid-site mb-16 items-end gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <Intro eyebrow="The album" title={['Real weddings,', <em key="h">right here.</em>]} />
          </div>
          <Reveal className="col-span-4 flex justify-center md:col-span-12 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <VideoFilm />
          </Reveal>
        </div>
        <Mosaic items={items} />
        <Reveal className="mt-12 flex justify-center">
          <Button variant="outline" to="/gallery?c=weddings" className="text-evergreen">The full gallery</Button>
        </Reveal>
      </div>
    </section>
  );
}

/* Awards: set like a programme listing ------------------------------------------ */
function Awards() {
  return (
    <section className="on-dark section-y bg-forest text-ivory">
      <div className="wrap grid-site gap-y-16">
        <div className="col-span-4 md:col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Intro eyebrow="Recognition" title={['Named among', <em key="o">South Africa’s best.</em>]} />
          </div>
        </div>
        <motion.ol
          className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {awards.map((a) => (
            <motion.li
              key={a.title + a.year}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
              className="grid grid-cols-1 gap-1 border-t border-ivory/15 py-5 text-center md:grid-cols-[7.5rem_1fr] md:gap-6 md:text-left"
            >
              <span className="font-display text-lg italic text-champagne">{a.year}</span>
              <span>
                <span className="block type-h4">{a.title}</span>
                <span className="mt-1 block type-caption text-mist">{a.by}</span>
              </span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section className="section-y bg-ivory text-evergreen">
      <div className="wrap">
        <Reveal className="flex justify-center">
          <Eyebrow>#PlantationPerfect</Eyebrow>
        </Reveal>
        <Testimonials items={weddingTestimonials} className="mt-12" />
      </div>
    </section>
  );
}

/* Where guests stay ---------------------------------------------------------------- */
function GuestStays() {
  return (
    <section className="bg-ivory pb-[var(--section)]">
      <div className="wrap">
        <div className="grid-site items-center gap-y-12 border-t border-charcoal/15 pt-16">
          <div className="col-span-4 md:col-span-5 lg:col-span-3">
            <Photo name="honeymoon-2" sizes="25vw" className="aspect-square" reveal="left" />
          </div>
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left lg:col-span-6 lg:col-start-5">
            <Eyebrow>For your guests</Eyebrow>
            <p className="mt-6 type-h3 text-evergreen">
              Four suites on the estate, twelve rooms at 39 on Church, <em>and a shuttle between them.</em>
            </p>
            <p className="mt-6 max-w-[34rem] type-body text-stone">
              Plantation wedding and event guests receive a 15% discount at {church.name}, our guest house in Walmer, ten minutes away.
            </p>
          </div>
          <div className="col-span-4 flex flex-col items-center gap-3 md:col-span-12 md:flex-row md:justify-start lg:col-span-3 lg:flex-col lg:items-end">
            <Button variant="link" to="/accommodation" className="text-forest">The suites</Button>
            <Button variant="link" to="/39-on-church" className="text-forest">39 on Church</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
