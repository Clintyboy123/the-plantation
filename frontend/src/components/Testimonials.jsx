import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ease } from '../utils/motion';

// One voice at a time, large. Visitors move through them; nothing auto-advances under their eyes.
export default function Testimonials({ items, tone = 'light', className = '' }) {
  const [i, setI] = useState(0);
  const go = (step) => setI((n) => (n + step + items.length) % items.length);
  const t = items[i];
  const ring = tone === 'dark' ? 'ring-ivory/30 hover:bg-ivory hover:text-evergreen' : 'ring-charcoal/25 hover:bg-forest hover:text-ivory';
  return (
    <figure className={`flex flex-col items-center text-center ${className}`} aria-roledescription="carousel" aria-label="What our guests say">
      <div className="relative grid min-h-[16rem] w-full place-items-center md:min-h-[13rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            className="max-w-[56rem] type-lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            aria-live="polite"
          >
            <p>“{t.quote}”</p>
            <footer className="mt-8 type-label not-italic opacity-75">
              {t.name}
              {t.role && <span className="block mt-2 normal-case tracking-normal type-caption">{t.role}</span>}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      {items.length > 1 && (
        <div className="mt-10 flex items-center gap-6">
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className={`flex size-11 items-center justify-center rounded-full ring-1 transition-colors ${ring}`}>
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <p className="w-14 type-label tabular-nums opacity-70">
            {i + 1} / {items.length}
          </p>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className={`flex size-11 items-center justify-center rounded-full ring-1 transition-colors ${ring}`}>
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      )}
    </figure>
  );
}
