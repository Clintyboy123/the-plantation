import { useSearchParams } from 'react-router';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Seo from '../components/Seo';
import Photo from '../components/Photo';
import Eyebrow from '../components/Eyebrow';
import SplitHeading from '../components/SplitHeading';
import EnquiryForm from '../components/EnquiryForm';
import { paths, pathOrder } from '../content/enquiry';
import { boma, church, site } from '../content/site';
import { ease } from '../utils/motion';
import { tones } from '../content/frames';

const contactFor = {
  boma: { phone: boma.phone, href: boma.phoneHref, email: boma.email },
  church: { phone: church.phone, href: church.phoneHref, email: church.email },
};

// The enquiry hub: choose what you are planning, and the form changes to suit that team.
export default function Enquire() {
  const [params, setParams] = useSearchParams();
  const type = pathOrder.includes(params.get('type')) ? params.get('type') : 'wedding';
  const path = paths[type];
  const reach = contactFor[type] || { phone: site.phone, href: site.phoneHref, email: site.email };

  return (
    <>
      <Seo title="Enquire" description="Enquire about a wedding, corporate event, accommodation, The Boma or 39 on Church. Your enquiry goes straight to the team who will host you." />
      <section className="bg-ivory pt-36 pb-[var(--section)] lg:pt-44">
        <div className="wrap">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
              <Eyebrow>Enquire</Eyebrow>
            </motion.div>
            <SplitHeading as="h1" onMount delay={0.8} className="mt-6 type-hero text-evergreen" lines={['Let’s begin.']} />
          </div>

          <fieldset className="mt-14">
            <legend className="mx-auto type-label text-stone md:mx-0">I am planning</legend>
            <LayoutGroup>
              <div role="radiogroup" className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                {pathOrder.map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={type === key}
                    onClick={() => setParams({ type: key }, { replace: true, preventScrollReset: true })}
                    className={`relative isolate min-h-11 rounded-full px-6 type-nav ring-1 ring-inset transition-colors duration-500 ${
                      type === key ? 'text-ivory ring-forest' : 'text-charcoal ring-charcoal/20 hover:ring-forest'
                    }`}
                  >
                    {type === key && <motion.span layoutId="enquire-type" className="absolute inset-0 -z-10 rounded-full bg-forest" transition={{ duration: 0.5, ease }} />}
                    {paths[key].label}
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </fieldset>

          <div className="grid-site mt-16 gap-y-14 border-t border-charcoal/15 pt-16">
            <div className="col-span-4 md:col-span-12 lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="flex flex-col items-center text-center md:items-start md:text-left"
                >
                  <Photo name={path.photo} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/3] w-full" frame={tones[type]} />
                  <h2 className="mt-10 type-h2 text-evergreen">{path.title}</h2>
                  <p className="mt-6 type-body-l text-stone">{path.intro}</p>
                  <div className="mt-8 border-t border-charcoal/15 pt-6">
                    <p className="type-label text-stone">Or speak to {path.responder.replace('The ', 'the ')}</p>
                    <a href={reach.href} className="mt-3 block font-display text-2xl text-evergreen hover:text-forest">{reach.phone}</a>
                    <a href={`mailto:${reach.email}`} className="type-body text-stone hover:text-forest">{reach.email}</a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
              <EnquiryForm key={type} type={type} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
