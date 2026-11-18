import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { LayoutGroup, motion } from 'motion/react';
import Seo from '../components/Seo';
import Frame, { FrameTone } from '../components/Frame';
import Eyebrow from '../components/Eyebrow';
import SplitHeading from '../components/SplitHeading';
import Mosaic from '../components/Mosaic';
import Button from '../components/ui/Button';
import { allPhotos } from '../components/Photo';
import { ease } from '../utils/motion';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'weddings', label: 'Weddings' },
  { key: 'corporate', label: 'Corporate' },
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'boma', label: 'The Boma' },
  { key: 'cuisine', label: 'Cuisine' },
  { key: 'church', label: '39 on Church' },
];

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const active = categories.some((c) => c.key === params.get('c')) ? params.get('c') : 'all';

  const items = useMemo(() => {
    const all = Object.entries(allPhotos).filter(([, p]) => p.category);
    const chosen = active === 'all' ? all : all.filter(([, p]) => p.category === active);
    // Interleave categories in "All" so no single subject runs on for a whole column.
    if (active !== 'all') return chosen.map(([k]) => k);
    const groups = categories.slice(1).map((c) => chosen.filter(([, p]) => p.category === c.key).map(([k]) => k));
    const out = [];
    for (let i = 0; groups.some((g) => i < g.length); i += 1) groups.forEach((g) => g[i] && out.push(g[i]));
    return out;
  }, [active]);

  const counts = useMemo(() => {
    const c = { all: 0 };
    Object.values(allPhotos).forEach((p) => {
      if (!p.category) return;
      c.all += 1;
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, []);

  return (
    <FrameTone tone="gold">
      <Seo title="Gallery" description="Photographs of weddings, corporate events, accommodation, cuisine, The Boma and 39 on Church at The Plantation, Gqeberha." />
      <section className="bg-ivory pt-36 pb-[var(--section)] lg:pt-44">
        <div className="wrap">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
              <Eyebrow>Gallery</Eyebrow>
            </motion.div>
            <SplitHeading as="h1" onMount delay={0.8} className="mt-6 type-hero text-evergreen" lines={['Moments,', <em key="k">kept.</em>]} />
          </div>

          <nav aria-label="Gallery categories" className="sticky top-[4.5rem] z-20 -mx-[var(--margin)] mt-16 bg-ivory/92 px-[var(--margin)] py-3 backdrop-blur-md">
            <LayoutGroup>
              <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] md:flex-wrap md:gap-2">
                {categories.map((c) => (
                  <li key={c.key} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setParams(c.key === 'all' ? {} : { c: c.key }, { replace: true, preventScrollReset: true })}
                      aria-pressed={active === c.key}
                      className={`relative isolate flex min-h-11 items-center gap-2 rounded-full px-5 type-nav transition-colors duration-500 ${
                        active === c.key ? 'text-ivory' : 'text-charcoal hover:text-forest'
                      }`}
                    >
                      {active === c.key && <motion.span layoutId="gallery-filter" className="absolute inset-0 -z-10 rounded-full bg-forest" transition={{ duration: 0.5, ease }} />}
                      {c.label}
                      <span className="font-display text-sm italic normal-case tracking-normal opacity-70">{counts[c.key] || 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </LayoutGroup>
          </nav>

          <Mosaic key={active} items={items} columns="columns-2 md:columns-3 xl:columns-4" className="mt-10" />

          <div className="mt-16 flex flex-col items-center gap-6 border-t border-charcoal/15 pt-12 text-center">
            <p className="type-lede text-evergreen">
              Picture it <em>with your people in it.</em>
            </p>
            <Button to="/enquire">Start an enquiry</Button>
          </div>
        </div>
      </section>
    </FrameTone>
  );
}
