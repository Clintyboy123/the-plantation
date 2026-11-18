import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import Seo from '../components/Seo';
import Eyebrow from '../components/Eyebrow';
import Intro from '../components/Intro';
import Reveal from '../components/Reveal';
import SplitHeading from '../components/SplitHeading';
import Accordion from '../components/Accordion';
import EnquiryForm from '../components/EnquiryForm';
import Button from '../components/ui/Button';
import { boma, church, site } from '../content/site';
import { ease } from '../utils/motion';

const directions = [
  {
    title: 'From the airport',
    kicker: '≈ 15 min',
    steps: [
      'As you exit the airport, go left at the circle onto Allister Miller Drive.',
      'After 1 km, turn left into Heugh Road and follow it for 6.2 km.',
      'Turn left into Genadendal Road (Prestons Liquor Store is on the corner).',
      'After 2.6 km, turn right at the T-junction into Victoria Drive.',
      'Take the first right into Sardinia Bay Road.',
      'Follow Sardinia Bay Road for 1.6 km. The Plantation is on the right.',
    ],
  },
  {
    title: 'From the N2',
    kicker: 'M12',
    steps: [
      'Exit the N2 at the M12, William Moffett. Turn south towards Walmer and Old Cape Road.',
      'Follow the William Moffett Expressway for 5.9 km.',
      'Turn right into Buffelsfontein Road (there is a Builders Warehouse at the intersection).',
      'After 1.1 km, turn left into Genadendal Road (Prestons Liquor Store is on the corner).',
      'After 2.6 km, turn right at the T-junction into Victoria Drive.',
      'Take the first right into Sardinia Bay Road, and follow it for 1.6 km. The Plantation is on the right.',
    ],
  },
];

export default function Contact() {
  const [mapOn, setMapOn] = useState(false);
  return (
    <>
      <Seo title="Contact" description="Contact The Plantation: 424A Sardinia Bay Road, Lovemore Park, Gqeberha. (041) 366 1591, bookings@theplantation.co.za. Directions from the airport and the N2." />
      <section className="bg-ivory pt-36 pb-[var(--section)] lg:pt-44">
        <div className="wrap grid-site gap-y-16">
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-12 md:items-start md:text-left lg:col-span-7">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
              <Eyebrow>Contact</Eyebrow>
            </motion.div>
            <SplitHeading as="h1" onMount delay={0.8} className="mt-6 type-hero text-evergreen" lines={['Find your way', <em key="f">to the forest.</em>]} />
          </div>
          <motion.div
            className="col-span-4 flex flex-col items-center gap-10 text-center md:col-span-12 md:flex-row md:items-start md:text-left lg:col-span-4 lg:col-start-9 lg:flex-col lg:self-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, ease }}
          >
            <div>
              <p className="type-label text-stone">Call</p>
              <a href={site.phoneHref} className="mt-2 block font-display text-3xl text-evergreen hover:text-forest">{site.phone}</a>
            </div>
            <div>
              <p className="type-label text-stone">Email</p>
              <a href={`mailto:${site.email}`} className="mt-2 block font-display text-2xl text-evergreen hover:text-forest">{site.email}</a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-ivory-deep section-y">
        <div className="wrap grid-site gap-y-16">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <Reveal className="flex flex-col items-center text-center md:items-start md:text-left">
              <Eyebrow>Visit</Eyebrow>
              <address className="mt-6 not-italic type-h4 text-evergreen">
                {site.address.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </address>
              <p className="mt-4 type-caption text-stone">GPS {site.gps}</p>
              <dl className="mt-10 w-full max-w-[22rem] border-t border-charcoal/15">
                <dt className="pt-5 type-label text-stone">Office hours</dt>
                {site.hours.map(([d, h]) => (
                  <dd key={d} className="flex justify-between gap-4 border-b border-charcoal/10 py-3 type-body">
                    <span>{d}</span>
                    <span className="text-stone">{h}</span>
                  </dd>
                ))}
              </dl>
              <div className="mt-8 type-caption text-stone">
                Postal: {site.postal.join(', ')} · Fax {site.fax}
              </div>
              <div className="mt-8">
                <Button variant="link" href={site.mapUrl} className="text-forest">Open in Google Maps</Button>
              </div>
            </Reveal>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-sage-light md:aspect-[16/9]">
              {mapOn ? (
                <iframe title="Map to The Plantation" src={site.mapEmbed} className="size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-5 p-8 text-center">
                  <MapPin className="size-6 text-forest" strokeWidth={1.25} aria-hidden="true" />
                  <p className="max-w-[24rem] type-body text-stone">The map loads from Google only when you ask for it, to keep this page fast and private.</p>
                  <Button variant="outline" onClick={() => setMapOn(true)} className="text-evergreen">Show the map</Button>
                </div>
              )}
            </div>
            <div className="mt-12">
              <Accordion
                initial={null}
                items={directions.map((d) => ({
                  title: d.title,
                  kicker: d.kicker,
                  body: (
                    <ol className="space-y-3">
                      {d.steps.map((s, i) => (
                        <li key={s} className="grid grid-cols-[2rem_1fr] text-left type-body text-stone">
                          <span className="font-display italic text-forest">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="wrap grid-site gap-y-16">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <Intro eyebrow="Write to us" title={['How can', <em key="h">we help?</em>]} body="Questions, viewings, suppliers and press. For weddings, events and stays, the planning forms ask the right questions." />
            <Reveal className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
              <Button variant="link" to="/enquire?type=wedding" className="text-forest">Wedding</Button>
              <Button variant="link" to="/enquire?type=corporate" className="text-forest">Corporate</Button>
              <Button variant="link" to="/enquire?type=accommodation" className="text-forest">Stay</Button>
            </Reveal>
          </div>
          <Reveal className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
            <EnquiryForm type="general" submitLabel="Send message" />
          </Reveal>
        </div>
      </section>

      <section className="on-dark section-y bg-forest text-ivory">
        <div className="wrap grid-site gap-y-12">
          {[
            { name: church.name, lines: church.address, phone: church.phone, href: church.phoneHref, email: church.email, to: '/39-on-church' },
            { name: boma.name, lines: boma.address, phone: boma.phone, href: boma.phoneHref, email: boma.email, to: '/the-boma' },
          ].map((v, i) => (
            <Reveal key={v.name} className={`col-span-4 flex flex-col items-center text-center md:col-span-6 md:items-start md:text-left lg:col-span-5 ${i ? 'lg:col-start-7' : ''}`}>
              <Eyebrow className="text-champagne">Also part of The Plantation</Eyebrow>
              <h2 className="mt-6 type-h2">{v.name}</h2>
              <address className="mt-6 not-italic type-body text-mist">
                {v.lines.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </address>
              <p className="mt-4 type-body">
                <a href={v.href} className="block hover:text-champagne">{v.phone}</a>
                <a href={`mailto:${v.email}`} className="block hover:text-champagne">{v.email}</a>
              </p>
              <div className="mt-8">
                <Button variant="link" to={v.to} className="text-champagne">Visit {v.name}</Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
