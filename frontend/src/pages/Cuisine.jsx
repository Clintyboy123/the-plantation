import { motion, useReducedMotion } from 'motion/react';
import Seo from '../components/Seo';
import Frame, { FrameTone } from '../components/Frame';
import Photo from '../components/Photo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import SplitHeading from '../components/SplitHeading';
import { cinema, ease } from '../utils/motion';

// Cuisine. Dish names are The Plantation's own (from their photo library); facts from the
// Weddings, Corporate and Boma pages. No menu prices or set menus are published, so none are shown.
const courses = [
  {
    roman: 'I',
    name: 'Canapés',
    note: 'Passed on the porch while the photographs are taken.',
    dishes: [
      ['dish-bunny', 'Mini bunny chows'],
      ['dish-boerewors', 'Boerewors bites'],
      ['dish-burger', 'Street-food sliders'],
      ['dish-nachos', 'Nacho cups'],
      ['dish-potatoes', 'Baby onion potatoes'],
    ],
  },
  {
    roman: 'II',
    name: 'Starters',
    note: 'The first course of a three- or four-course wedding meal.',
    dishes: [
      ['dish-salmon', 'Smoked salmon'],
      ['dish-calamari', 'Calamari'],
      ['dish-marrow', 'Marrow bone'],
      ['dish-salad', 'Biltong salad'],
    ],
  },
  {
    roman: 'III',
    name: 'Mains',
    note: 'From a lamb chop duet to a Karoo or Xhosa feast.',
    dishes: [
      ['dish-lamb', 'Lamb chop duet'],
      ['dish-karoo', 'Karoo feast'],
      ['dish-xhosa', 'Xhosa feast'],
      ['dish-oxtail', 'Oxtail'],
      ['dish-roulade', 'Chicken roulade'],
    ],
  },
  {
    roman: 'IV',
    name: 'Dessert',
    note: 'And something sweet to take onto the dance floor.',
    dishes: [
      ['dish-brownie', 'Chocolate brownie cheesecake'],
      ['dish-jars', 'Dessert jars'],
    ],
  },
];

export default function Cuisine() {
  return (
    <FrameTone tone="evergreen">
    <div className="bg-ivory">
      <Seo
        title="Cuisine"
        description="Award-winning in-house catering at The Plantation, Gqeberha: canapés, plated wedding menus, corporate catering, South African potjiekos and spitbraai at The Boma, and a full bar."
      />
      <Cover />
      <Kitchen />
      {courses.map((c, i) => (
        <Course key={c.name} course={c} index={i} />
      ))}
      <Fire />
      <Bar />
      <Close />
    </div>
    </FrameTone>
  );
}

/* Magazine cover: headline across the top, one plate held tall on the right ---- */
function Cover() {
  const reduce = useReducedMotion();
  return (
    <section className="on-dark relative overflow-hidden bg-evergreen text-ivory">
      <div className="wrap grid-site min-h-[100svh] items-end gap-y-12 pt-36 pb-14 lg:pb-20">
        <div className="col-span-4 flex flex-col items-center text-center md:col-span-12 md:items-start md:text-left lg:col-span-7">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
            <Eyebrow time="18:30" className="text-champagne">Cuisine</Eyebrow>
          </motion.div>
          <SplitHeading as="h1" onMount delay={0.8} className="mt-6 type-hero" lines={['Made here.', <em key="p">Plated with care.</em>]} />
          <motion.p
            className="mt-8 max-w-[30rem] type-body-l text-ivory/85"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease }}
          >
            Award-winning chefs, an in-house kitchen and menus built around each celebration, from canapés on the porch to a feast at the long table.
          </motion.p>
        </div>
        <motion.div
          className="col-span-4 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-9 lg:row-span-1"
          initial={reduce ? false : { opacity: 0, y: 48, scale: 1.04, filter: 'blur(18px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: cinema, delay: 0.9 }}
        >
          <Photo name="dish-karoo" priority sizes="(min-width: 1024px) 33vw, 60vw" className="aspect-[2/3] max-h-[78svh] w-full" frame="champagne" />
          <p className="mt-4 flex justify-between type-caption text-mist">
            <span className="font-display text-base italic text-ivory">Karoo feast</span>
            <span className="type-label text-champagne">Main</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Kitchen() {
  const points = [
    ['Tailored', 'In-house catering built around your guests, your theme and your budget.'],
    ['Three or four courses', 'Plated wedding menus, or buffets and sharing tables.'],
    ['Award-winning', 'Named a top catering provider by Wedding & Function Magazine, 2021 to 2023.'],
  ];
  return (
    <section className="section-y bg-ivory">
      <div className="wrap grid-site gap-y-16">
        <div className="col-span-4 md:col-span-12 lg:col-span-6">
          <Reveal className="text-center type-lede text-evergreen md:text-left">
            <p>
              Our team of award-winning chefs serves a <em>mouth-watering menu</em> while the waitrons and bar staff attend to every guest’s need.
            </p>
          </Reveal>
        </div>
        <Reveal group className="col-span-4 md:col-span-12 lg:col-span-5 lg:col-start-8">
          {points.map(([t, d]) => (
            <Reveal.Item key={t} className="border-t border-charcoal/15 py-6 text-center md:text-left">
              <h2 className="type-h4 text-forest">{t}</h2>
              <p className="mt-2 type-body text-stone">{d}</p>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* Each course: its name held on the left, the plates set out as a spread ------ */
function Course({ course, index }) {
  const [lead, ...rest] = course.dishes;
  const flip = index % 2 === 1;
  return (
    <section className={`section-y ${index % 2 ? 'bg-ivory-deep' : 'bg-ivory'}`}>
      <div className="wrap grid-site gap-y-12">
        <div className={`col-span-4 md:col-span-12 lg:col-span-3 ${flip ? 'lg:order-2 lg:col-start-10' : ''}`}>
          <div className="flex flex-col items-center text-center lg:sticky lg:top-32 lg:items-start lg:text-left">
            <p className="font-display text-2xl italic text-champagne">{course.roman}</p>
            <h2 className="mt-2 type-h1 text-evergreen">{course.name}</h2>
            <p className="mt-6 max-w-[18rem] type-body text-stone">{course.note}</p>
          </div>
        </div>
        <div className={`col-span-4 md:col-span-12 lg:col-span-8 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-5'}`}>
          <figure>
            <Photo name={lead[0]} sizes="(min-width: 1024px) 66vw, 100vw" className="aspect-[3/2]" reveal={flip ? 'left' : 'right'} hover />
            <figcaption className="mt-4 text-center font-display text-xl md:text-left">{lead[1]}</figcaption>
          </figure>
          {rest.length > 0 && (
            <div className={`mt-12 grid gap-[var(--gutter)] ${rest.length === 1 ? 'grid-cols-1 md:w-1/2' : rest.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              {rest.map(([photo, name], i) => (
                <motion.figure
                  key={photo}
                  className={i % 2 ? 'md:mt-12' : ''}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: i * 0.08 } }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Photo name={photo} sizes="(min-width: 768px) 16vw, 50vw" className="aspect-[4/5]" hover />
                  <figcaption className="mt-3 text-center type-caption text-charcoal md:text-left">{name}</figcaption>
                </motion.figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* The Boma's fire-side food ------------------------------------------------------- */
function Fire() {
  return (
    <section className="on-dark relative overflow-hidden bg-evergreen text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[60svh]">
          <Photo name="boma-potjies" sizes="(min-width: 1024px) 50vw, 100vw" className="!absolute inset-0" parallax={6} frame={false} />
        </div>
        <div className="flex items-center px-[var(--margin)] py-[var(--section)]">
          <Intro
            time="20:30"
            eyebrow="At The Boma"
            title={['Potjiekos, spitbraai', <em key="h">and heritage tastings.</em>]}
            body="Next door, the food is South African and shared: buffets, potjies simmering over the coals, spitbraais and heritage tasting experiences."
            actions={<Button variant="link" to="/the-boma" className="text-champagne">Discover The Boma</Button>}
          />
        </div>
      </div>
    </section>
  );
}

function Bar() {
  return (
    <section className="section-y bg-ivory">
      <div className="wrap grid-site items-center gap-y-12">
        <div className="col-span-4 md:col-span-5 lg:col-span-4">
          <Intro
            eyebrow="The bar"
            title={['Welcome drinks', <em key="t">to the last toast.</em>]}
            body="Full bar service, welcome drinks and champagne, from a drinks station on the lawn to cocktails on the porch."
          />
        </div>
        <div className="col-span-4 grid grid-cols-5 gap-[var(--gutter)] md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <Photo name="cocktails" sizes="(min-width: 768px) 35vw, 60vw" className="col-span-3 aspect-[4/5]" reveal="bottom" parallax={4} />
          <Photo name="drinks-buffet" sizes="(min-width: 768px) 25vw, 40vw" className="col-span-2 mt-24 aspect-[3/4]" reveal="bottom" parallax={8} />
        </div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="on-dark section-y bg-forest text-ivory">
      <div className="wrap">
        <Intro
          align="center"
          eyebrow="Menus"
          title={['Every menu is', <em key="w">written for you.</em>]}
          body="Tell us about your occasion and we will send menu options to suit your guests, your season and your budget."
          actions={
            <>
              <Button variant="light" to="/enquire?type=wedding">Wedding menus</Button>
              <Button variant="link" to="/enquire?type=corporate" className="text-champagne">Corporate catering</Button>
            </>
          }
        />
      </div>
    </section>
  );
}
