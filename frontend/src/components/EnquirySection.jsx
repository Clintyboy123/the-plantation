import EnquiryForm from './EnquiryForm';
import Intro from './Intro';
import Reveal from './Reveal';
import FairyLights from './FairyLights';
import LocationMap from './LocationMap';
import { paths } from '../content/enquiry';
import { church, site } from '../content/site';

// The closing chapter of each experience page: who will answer, how to reach them directly,
// where to find them (map), and the form for that audience. tone="dark" for night pages (The Boma, Cuisine), else light.
export default function EnquirySection({ type, tone = 'light', eyebrow = 'Enquire', title, intro, contact, bg }) {
  const path = paths[type];
  const dark = tone === 'dark';
  const reach = contact || { phone: site.phone, phoneHref: site.phoneHref, email: site.email };
  // 39 on Church is in Walmer; every other enquiry (The Boma included, next door) is on the estate
  const place =
    type === 'church'
      ? { label: church.name, address: church.address, mapUrl: church.mapUrl, mapEmbed: church.mapEmbed }
      : { label: type === 'boma' ? 'The Boma' : site.name || 'The Plantation', address: site.address, mapUrl: site.mapUrl, mapEmbed: site.mapEmbed };
  return (
    <section
      id="enquire"
      className={`relative scroll-mt-20 overflow-hidden section-y ${bg || (dark ? 'on-dark bg-evergreen text-ivory' : 'bg-ivory-deep text-charcoal')}`}
    >
      {dark && <FairyLights count={26} className="opacity-50" />}
      <div className="wrap relative">
        <div className="grid-site gap-y-16 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          {/* desktop: intro and map stacked on the left, the form beside them; phones: intro, form, then map */}
          <div className="col-span-4 md:col-span-12 lg:col-span-4 lg:row-start-1">
            <Intro eyebrow={eyebrow} title={title || path.title} body={intro || path.intro} className={dark ? '' : 'text-evergreen'} />
            <Reveal className={`mt-12 flex flex-col items-center gap-2 border-t pt-8 text-center md:items-start md:text-left ${dark ? 'border-ivory/15' : 'border-charcoal/15'}`}>
              <p className={`type-label ${dark ? 'text-champagne' : 'text-stone'}`}>Prefer to talk?</p>
              <a href={reach.phoneHref} className="mt-2 font-display text-2xl hover:underline">
                {reach.phone}
              </a>
              <a href={`mailto:${reach.email}`} className={`type-body ${dark ? 'text-mist hover:text-ivory' : 'text-stone hover:text-forest'}`}>
                {reach.email}
              </a>
            </Reveal>
          </div>
          <Reveal className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <EnquiryForm type={type} tone={tone} />
          </Reveal>
          <Reveal className="col-span-4 md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-start">
            <LocationMap place={place} dark={dark} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
