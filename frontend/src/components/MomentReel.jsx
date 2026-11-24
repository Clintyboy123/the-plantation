import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Photo, { allPhotos } from './Photo';
import Frame from './Frame';
import ReelGL from './reel/ReelGL';
import { useSmoothScroll } from '../context/SmoothScroll';
import { ease } from '../utils/motion';
import { BASE } from '../utils/asset';

// "The Plantation experience" as a cinematic reel (after siena.film).
// Pinned section; each moment of the wedding day is one large gold-framed card.
//   WebGL layer (ReelGL): photo, frame and corners, warped over a drum and bowed by scroll speed,
//                         the photo drifting inside the card (parallax) and dimming off-centre.
//   HTML layer:           the card's typography, crisp and accessible, locked to the card's position;
//                         fully shown when the card is centred (where the warp is zero) and fading as it leaves.
//   The reel settles on the nearest card when scrolling stops; a counter pill and a numeral rail navigate.
// Touch devices and reduced motion get a calm stacked version; no WebGL falls back to flat CSS cards.
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function MomentReel({ moments, cta = '#enquire', ctaLabel = 'Plan your day' }) {
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const decide = () => setPinned(window.matchMedia('(min-width: 64rem) and (pointer: fine)').matches && !reduce);
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, [reduce]);
  return pinned ? <Reel moments={moments} cta={cta} ctaLabel={ctaLabel} /> : <Stack moments={moments} cta={cta} ctaLabel={ctaLabel} />;
}

/* ---------------------------------------------------------------------------- */
function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return vp;
}

// Card geometry, shared by the WebGL and HTML layers so they always coincide.
// The drum radius, shared by the shader and the text layer (keep in step with ReelGL's vertex shader).
export const drumRadius = (vh) => vh * 1.6;
// Where a point at page-y "y" lands on screen after the drum projection.
const onDrum = (y, vh) => {
  const R = drumRadius(vh);
  const cy = vh / 2;
  const th = Math.max(-1.45, Math.min(1.45, (y - cy) / R));
  return cy + R * Math.sin(th);
};

function geometry(vp) {
  const w = Math.min(Math.round(vp.w * 0.82), 1320);
  const h = Math.round(Math.min(vp.h * 0.76, w * 0.56));
  const gap = Math.round(vp.h * 0.04);
  return { w, h, step: h + gap, top: Math.round((vp.h - h) / 2) };
}

function Reel({ moments, cta, ctaLabel }) {
  const n = moments.length;
  const section = useRef(null);
  const canvas = useRef(null);
  const gl = useRef(null);
  const scroll = useSmoothScroll();
  const vp = useViewport();
  const g = geometry(vp);
  const [active, setActive] = useState(0);
  const [glOK, setGlOK] = useState(true);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const pos = useTransform(scrollYProgress, (p) => p * (n - 1));
  useMotionValueEvent(pos, 'change', (v) => setActive(Math.min(n - 1, Math.max(0, Math.round(v)))));

  // While the reel is on screen, the site header steps aside (the pill is the navigation here).
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p > 0.001 && p < 0.999) document.documentElement.dataset.reel = '1';
    else delete document.documentElement.dataset.reel;
  });
  useEffect(() => () => delete document.documentElement.dataset.reel, []);

  // WebGL renderer
  useEffect(() => {
    let r;
    try {
      r = new ReelGL(canvas.current);
    } catch {
      setGlOK(false);
      return undefined;
    }
    gl.current = r;
    r.load(
      moments.map((m) => {
        const p = allPhotos[m.photo];
        const wMax = p.widths[p.widths.length - 1];
        const focus = (p.focus || '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
        return { src: `${BASE}photos/${m.photo}-${wMax}.webp`, aspect: p.width / p.height, focus };
      })
    );
    let raf;
    let last = pos.get();
    let vel = 0;
    const frame = () => {
      const p = pos.get();
      const geo = geometry({ w: window.innerWidth, h: window.innerHeight });
      // smoothed speed in px per frame -> bow amplitude (the middle trails its edges)
      vel += ((p - last) * geo.step - vel) * 0.18;
      last = p;
      let bow = Math.max(-70, Math.min(70, vel * 1.6)); // + = the middle trails below its edges as the reel moves up
      if (import.meta.env.DEV && typeof window.__reelBow === 'number') bow = window.__reelBow; // QA: hold a bow still for inspection
      r.render({
        drum: drumRadius(window.innerHeight),
        bow,
        cards: moments.map((_, i) => {
          const off = i - p;
          return { cx: window.innerWidth / 2, cy: window.innerHeight / 2 + off * geo.step, w: geo.w, h: geo.h, off, dim: Math.min(0.6, Math.abs(off) * 0.55) };
        }),
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      r.destroy();
      gl.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    gl.current?.resize(vp.w, vp.h);
  }, [vp.w, vp.h, glOK]);

  // Settle on the nearest card when the scroll comes to rest inside the reel.
  useEffect(() => {
    let timer;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const el = section.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const span = el.offsetHeight - window.innerHeight;
        const y = window.scrollY;
        if (y <= top + 2 || y >= top + span - 2) return;
        const nearest = Math.round(((y - top) / span) * (n - 1));
        const target = top + (nearest / (n - 1)) * span;
        if (Math.abs(target - y) > 3) scroll.scrollTo(target, 0.8);
      }, 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (i) => {
    const el = section.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scroll.scrollTo(top + (i / (n - 1)) * span, 1.1);
  };

  const cardLeft = (vp.w - g.w) / 2;

  return (
    <div ref={section} style={{ height: `${n * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />

        {/* Counter pill: centred in the space above the card, right edge on the card's right edge */}
        <div className="absolute z-20" style={{ right: cardLeft, top: g.top / 2, transform: 'translateY(-50%)' }}>
          <div className="flex items-center gap-3 rounded-full bg-ivory py-1.5 pr-5 pl-1.5 shadow-[0_10px_30px_-18px_rgb(32_45_37/0.5)] ring-1 ring-champagne">
            <span className="relative block size-9 overflow-hidden rounded-full">
              {moments.map((m, i) => (
                <span key={m.photo} className={`absolute inset-0 transition-opacity duration-500 ${active === i ? 'opacity-100' : 'opacity-0'}`}>
                  <Photo name={m.photo} sizes="40px" className="size-full" alt="" frame={false} />
                </span>
              ))}
            </span>
            <span className="w-[12.5rem]">
              <motion.span key={active} className="block truncate font-display text-base leading-tight text-evergreen" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
                {moments[active].title}
              </motion.span>
              <span className="mt-0.5 block type-label text-stone">
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
            </span>
          </div>
        </div>

        {/* Numeral rail: centred in the margin left of the card */}
        <nav aria-label="Moments of the day" className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: cardLeft / 2 }}>
          <ol className="flex flex-col items-center gap-1">
            {moments.map((m, i) => (
              <li key={m.title}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={active === i ? 'step' : undefined}
                  aria-label={`${NUMERALS[i]}. ${m.title}`}
                  className="group flex size-11 items-center justify-center"
                >
                  <span className={`font-display text-lg italic transition-[color,transform] duration-500 ease-site ${active === i ? 'scale-125 text-forest' : 'text-stone/55 group-hover:text-forest'}`}>
                    {NUMERALS[i]}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {moments.map((m, i) => (
          <CardText key={m.title} m={m} i={i} n={n} pos={pos} g={g} vp={vp} cta={cta} ctaLabel={ctaLabel} isActive={active === i} glOK={glOK} />
        ))}
      </div>
    </div>
  );
}

// The typography of one card, on the card's grid. Shares the card's exact rectangle with the WebGL layer.
function CardText({ m, i, n, pos, g, vp, cta, ctaLabel, isActive, glOK }) {
  const off = useTransform(pos, (p) => i - p);
  // the card's centre, put through the same drum projection as the WebGL layer, so text and image coincide
  const y = useTransform(off, (o) => onDrum(vp.h / 2 + o * g.step, vp.h) - g.h / 2);
  const opacity = useTransform(off, (o) => Math.max(0, Math.min(1, (0.42 - Math.abs(o)) / 0.34)));
  const visibility = useTransform(off, (o) => (Math.abs(o) > (glOK ? 0.6 : 2.2) ? 'hidden' : 'visible'));
  const flatDim = useTransform(off, (o) => Math.min(0.6, Math.abs(o) * 0.55));

  return (
    <motion.article
      className="absolute left-1/2 top-0"
      style={{ y, x: '-50%', width: g.w, height: g.h, visibility }}
      aria-hidden={!isActive || undefined}
    >
      {!glOK && (
        // No WebGL: the same card drawn flat with the shared frame
        <Frame tone="gold" className="!absolute inset-0" innerClassName="bg-evergreen">
          <Photo name={m.photo} sizes="84vw" className="size-full" frame={false} />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgb(24_34_28/0.82)_0%,rgb(24_34_28/0.25)_38%,rgb(24_34_28/0.2)_62%,rgb(24_34_28/0.78)_100%)]" />
          <motion.div aria-hidden="true" className="absolute inset-0 bg-evergreen" style={{ opacity: flatDim }} />
        </Frame>
      )}

      {/* Inside the frame (4px rule + 5px gap), one padding on all four sides */}
      <motion.div
        className="on-dark absolute inset-[9px] grid grid-cols-12 gap-x-[var(--gutter)] p-[clamp(1.75rem,2.6vw,2.75rem)] text-ivory"
        style={{ opacity }}
      >
        {/* Left column: top = eyebrow; bottom = scene, title, credits */}
        <div className="col-span-7 flex flex-col justify-between">
          <p className="type-label text-champagne">The Plantation experience</p>
          <div>
            <p className="type-label text-mist">{m.scene}</p>
            <h3 className="mt-5 type-hero">{m.title}</h3>
            <dl className="mt-8 grid max-w-[30rem] grid-cols-[5.5rem_1fr] gap-x-4 border-t border-ivory/20 pt-4 type-caption leading-6">
              <dt className="type-label leading-6 text-mist">Place</dt>
              <dd>{m.place}</dd>
            </dl>
          </div>
        </div>

        {/* Right column: same top line and bottom line as the left; hairline full height */}
        <div className="col-span-4 col-start-9 flex flex-col justify-between border-l border-ivory/20 pl-[var(--gutter)]">
          <p className="type-label text-champagne">
            <span className="font-display text-[0.95rem] font-normal italic tracking-normal normal-case">{NUMERALS[i]}</span>
            <span className="mx-2 opacity-50">/</span>
            <span className="font-display text-[0.95rem] font-normal italic tracking-normal normal-case">{NUMERALS[n - 1]}</span>
          </p>
          <div>
            <p className="type-body text-ivory/90">{m.body}</p>
            <a
              href={cta}
              tabIndex={isActive ? 0 : -1}
              className="group mt-8 inline-flex min-h-11 items-center gap-3 rounded-full px-6 type-nav ring-1 ring-ivory/45 transition-colors duration-500 hover:bg-ivory hover:text-evergreen"
            >
              {ctaLabel}
              <ArrowRight className="size-4 transition-transform duration-500 ease-site group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

/* Phones, touch tablets, reduced motion: the same cards, stacked and calm ------------- */
function Stack({ moments, cta, ctaLabel }) {
  return (
    <ol className="wrap mt-4 space-y-16">
      {moments.map((m, i) => (
        <motion.li
          key={m.title}
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease } }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <Photo name={m.photo} sizes="100vw" className="aspect-[4/5] w-full max-w-[32rem]" frame="gold" />
          <p className="mt-8 flex items-center gap-3 type-label text-forest">
            <span className="font-display text-lg font-normal italic tracking-normal normal-case">{NUMERALS[i]}</span>
            {m.scene}
          </p>
          <h3 className="mt-4 type-h2 text-evergreen">{m.title}</h3>
          <p className="mt-6 max-w-[30rem] type-body-l text-stone">{m.body}</p>
          <p className="mt-4 type-caption text-stone">{m.place}</p>
        </motion.li>
      ))}
      <li className="flex justify-center">
        <a href={cta} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-forest px-8 type-nav text-ivory">
          {ctaLabel} <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </li>
    </ol>
  );
}
