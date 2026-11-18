import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Seo from '../components/Seo';
import Frame, { FrameTone } from '../components/Frame';
import Photo from '../components/Photo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import SplitHeading from '../components/SplitHeading';
import { ease, viewportOnce } from '../utils/motion';

// Our Story: from theplantation.co.za/about (2026-11-18). Only the facts published there.
const chapters = [
  {
    year: '2006',
    title: 'A family’s dream',
    body: 'A family relocates to the Eastern Cape and opens Port Elizabeth’s first custom-built, all-in-one wedding venue on Sardinia Bay Road.',
    photo: 'chapel-exterior',
  },
  {
    year: '2010',
    title: 'The Boma joins',
    body: 'The Plantation acquires The Boma next door: an informal venue for potjies and spitbraais, forest weddings, milestone birthdays and corporate events.',
    photo: 'boma-courtyard',
  },
  {
    year: '2018',
    title: '39 on Church',
    body: 'A third venue: 39 on Church Guest House and Conference Centre in Walmer, for business and leisure travellers and for Plantation and Boma event guests.',
    photo: 'church-pool',
  },
  {
    year: 'Today',
    title: 'Still owner-managed',
    body: 'Repeatedly awarded as one of South Africa’s top wedding and event venues, and still run with the same passion and attention to detail.',
    photo: 'estate-night',
  },
];

const team = [
  { name: 'Sarah', role: 'General Manager & Co-owner', body: 'Sales, marketing and customer service are her forte. She makes sure we have delighted clients, and a team that loves delighting them.' },
  { name: 'Ralph', role: 'Operations Manager & Co-owner', body: 'Constantly on the go: looking after the facilities and making sure everybody has everything they need to wow our guests.' },
  { name: 'Pat & Judy', role: 'Co-owners', body: 'When he is not writing books, Pat keeps the finances in check. Judy looks after the glorious gardens.' },
  { name: 'Daphne', role: 'House Manager, 39 on Church', body: 'Her friendly smile welcomes guests and makes them feel at home. She cooks the best breakfasts in town.' },
  { name: 'Eunice', role: 'Housekeeping', body: 'Keeps everything neat, clean and tidy: the laundry, the guest rooms, the venue and the kitchen.' },
  { name: 'Matthews', role: 'Groundsman', body: 'Keeps the gardens and grounds pristine. He has, by our count, vacuumed more leaves than anyone in history.' },
];

export default function Story() {
  return (
    <FrameTone tone="champagne">
      <Seo
        title="Our story"
        description="The Plantation opened in 2006 as Port Elizabeth’s first custom-built, all-in-one wedding venue. A family-owned group of three venues: The Plantation, The Boma and 39 on Church."
      />
      <section className="bg-ivory pt-36 lg:pt-44">
        <div className="wrap grid-site gap-y-12">
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-12 md:items-start md:text-left lg:col-span-9">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
              <Eyebrow>Our story</Eyebrow>
            </motion.div>
            <SplitHeading as="h1" onMount delay={0.8} className="mt-6 type-hero text-evergreen" lines={['A family’s dream,', <em key="e">in the Eastern Cape.</em>]} />
          </div>
        </div>
        <motion.div
          className="wrap mt-16 lg:mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.1, ease }}
        >
          <Photo name="estate-aerial" priority sizes="100vw" className="aspect-[4/3] md:aspect-[21/9]" parallax={8} />
        </motion.div>
      </section>

      <Timeline />

      <section className="section-y bg-ivory-deep">
        <div className="wrap">
          <Intro eyebrow="Meet the team" title={['The people', <em key="b">behind the welcome.</em>]} />
          <Reveal group gap={0.07} className="mt-16 grid gap-x-[var(--gutter)] md:grid-cols-2 lg:grid-cols-3">
            {team.map((t) => (
              <Reveal.Item key={t.name} className="border-t border-charcoal/15 py-8 text-center md:text-left">
                <h3 className="type-h3 text-evergreen">{t.name}</h3>
                <p className="mt-2 type-label text-forest">{t.role}</p>
                <p className="mt-5 max-w-[24rem] type-body text-stone md:max-w-none">{t.body}</p>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="on-dark section-y bg-forest text-ivory">
        <div className="wrap flex flex-col items-center text-center">
          <Reveal as="blockquote" className="max-w-[54rem]">
            <p className="type-h2">
              “Whichever of our venues you select, The Plantation guarantees an experience that is <em>magical and memorably enjoyable.</em>”
            </p>
          </Reveal>
          <Reveal className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Button variant="light" to="/enquire">Plan a visit</Button>
            <Button variant="link" to="/weddings" className="text-champagne">Weddings</Button>
          </Reveal>
        </div>
      </section>
    </FrameTone>
  );
}

/* A vertical line that draws itself as the years pass ------------------------- */
function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section className="section-y bg-ivory">
      <div ref={ref} className="wrap relative">
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-charcoal/10 md:block">
          <motion.div className="absolute inset-0 origin-top bg-forest" style={{ scaleY: draw }} />
        </div>
        <ol className="space-y-24 md:space-y-32">
          {chapters.map((c, i) => (
            <li key={c.year} className="grid-site items-center gap-y-8">
              <div className={`col-span-4 md:col-span-5 ${i % 2 ? 'md:order-2 md:col-start-8' : ''}`}>
                <Photo name={c.photo} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/3]" reveal={i % 2 ? 'right' : 'left'} />
              </div>
              <motion.div
                className={`col-span-4 flex flex-col items-center text-center md:col-span-5 md:items-start md:text-left ${i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-8'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.9, ease } }}
                viewport={viewportOnce}
              >
                <p className="type-numeral text-champagne">{c.year}</p>
                <h2 className="mt-6 type-h3 text-evergreen">{c.title}</h2>
                <p className="mt-5 max-w-[26rem] type-body-l text-stone">{c.body}</p>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
