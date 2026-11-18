import { lazy, Suspense, useRef, useState } from 'react';
import { Rotate3d } from 'lucide-react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Eyebrow from './Eyebrow';

// three.js is only downloaded on the page that shows the ring
const RingCanvas = lazy(() => import('./ring/RingCanvas'));

// "Imagine..." as a scroll-driven sequence. The section is pinned; each line has its own stretch of
// scroll: it fades in (rising out of a soft blur), holds, then fades up and away as the next arrives.
// The finale fades in, keeps zooming in slightly, then fades away as the section lets go into the next one.
//
// ring: an engagement ring (3D, lit by an HDRI) stands beside the words. It arrives small with the first
// line, turns (Y and Z) and zooms in through the three lines until it faces the visitor exactly as the finale
// arrives, and leaves with the finale. Visitors can drag it to turn it themselves. Desktop: words centred in the left seven columns, ring in the right
// five. Tablet and phone: ring above the words, both centred.
// Reduced motion: the lines are simply listed (no ring).
const STAGE_IN = 0.3; // portion of a stage spent arriving
const STAGE_OUT = 0.75; // point in a stage where leaving starts

export default function ImagineSequence({ lines, finale, ring = false }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const stages = lines.length + 1;
  // progress starts as the section's top reaches the middle of the screen, so the first line has
  // already faded in by the time the section pins
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.5', 'end end'] });
  const s = useTransform(scrollYProgress, (p) => p * stages);
  const [stage, setStage] = useState(0);
  useMotionValueEvent(s, 'change', (v) => setStage(Math.min(stages - 1, Math.max(0, Math.floor(v + 0.2)))));

  if (reduce) {
    return (
      <section className="section-y bg-ivory text-center">
        <div className="wrap flex flex-col items-center gap-8">
          <Eyebrow>Imagine</Eyebrow>
          {lines.map((l) => (
            <p key={l} className="max-w-[24ch] type-h3 text-stone">
              {l}
            </p>
          ))}
          <h2 className="type-h1 text-evergreen">{finale}</h2>
        </div>
      </section>
    );
  }

  // the column the words (and their eyebrow and dots) are centred in
  const textCol = ring ? 'col-span-4 md:col-span-12 lg:col-span-7' : 'col-span-4 md:col-span-12';

  return (
    <section ref={ref} className="relative bg-ivory" style={{ height: `${stages * 100}vh` }} aria-label="Imagine your wedding at The Plantation">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-[14vh]">
          <div className="wrap grid-site">
            <div className={`${textCol} flex justify-center`}>
              <Eyebrow>Imagine</Eyebrow>
            </div>
          </div>
        </div>

        <div className="wrap grid-site h-full content-center items-center gap-y-6">
          {ring && <Ring s={s} last={lines.length} className="col-span-4 md:col-span-12 lg:order-2 lg:col-span-5" />}

          <div className={`${textCol} grid place-items-center text-center lg:order-1`}>
            {lines.map((l, i) => (
              <Line key={l} s={s} i={i}>
                <p className="max-w-[22ch] type-h2 text-balance text-evergreen">{l}</p>
              </Line>
            ))}
            <Finale s={s} i={lines.length}>
              <h2 className={`type-h1 text-evergreen ${ring ? 'xl:type-hero xl:text-[clamp(4rem,6.4vw,6.6rem)]' : 'md:type-hero'}`}>{finale}</h2>
            </Finale>
          </div>
        </div>

        {/* where you are in the sequence */}
        <div className="absolute inset-x-0 bottom-[12vh]">
          <div className="wrap grid-site">
            <ol aria-hidden="true" className={`${textCol} flex justify-center gap-3`}>
              {Array.from({ length: stages }, (_, i) => (
                <li
                  key={i}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-700 ease-site ${stage === i ? 'w-6 bg-forest' : 'w-1.5 bg-charcoal/20'}`}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ s, i, children }) {
  const input = [i, i + STAGE_IN, i + STAGE_OUT, i + 1];
  const opacity = useTransform(s, input, [0, 1, 1, 0]);
  const y = useTransform(s, input, [32, 0, 0, -32]);
  const filter = useTransform(s, input, ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);
  return (
    <motion.div className="[grid-area:1/1]" style={{ opacity, y, filter }}>
      {children}
    </motion.div>
  );
}

function Finale({ s, i, children }) {
  // fades in like the other lines, holds while it zooms, then fades away before the next section arrives
  const input = [i, i + STAGE_IN, i + STAGE_OUT, i + 1];
  const opacity = useTransform(s, input, [0, 1, 1, 0]);
  const y = useTransform(s, input, [32, 0, 0, -32]);
  const filter = useTransform(s, input, ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);
  // the slow zoom continues through the whole final stage, until the section lets go
  const scale = useTransform(s, [i, i + 1], [0.96, 1.08]);
  return (
    <motion.div className="[grid-area:1/1]" style={{ opacity, y, filter, scale }}>
      {children}
    </motion.div>
  );
}

// The ring's own timeline, on the same scroll as the words:
//   arrives with the first line (fade up out of a soft blur), turns until the finale arrives (front-facing),
//   leaves with the finale.
function Ring({ s, last, className }) {
  const end = last + STAGE_IN; // front-facing exactly as the finale has arrived
  const opacity = useTransform(s, [0, STAGE_IN + 0.05, last + STAGE_OUT, last + 1], [0, 1, 1, 0]);
  const y = useTransform(s, [0, STAGE_IN + 0.05, last + STAGE_OUT, last + 1], [40, 0, 0, -32]);
  const filter = useTransform(s, [0, STAGE_IN + 0.05, last + STAGE_OUT, last + 1], ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);
  const pose = useTransform(s, [0, end], [0, 1], { clamp: true });
  const [touched, setTouched] = useState(false);
  return (
    <motion.div className={`relative h-[32vh] md:h-[38vh] lg:h-[62vh] ${className}`} style={{ opacity, y, filter }}>
      <Suspense fallback={null}>
        <RingCanvas pose={pose} onInteract={() => setTouched(true)} />
      </Suspense>
      {/* a quiet hint that the ring can be turned; gone after the first drag */}
      <p
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 type-label text-stone transition-opacity duration-700 ease-site ${touched ? 'opacity-0' : 'opacity-100'}`}
      >
        <Rotate3d className="size-3.5" strokeWidth={1.5} />
        Drag to turn
      </p>
    </motion.div>
  );
}
