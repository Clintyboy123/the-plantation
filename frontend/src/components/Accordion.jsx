import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ease } from '../utils/motion';

// Disclosure list: one row open at a time, hairline separated. Each row is a real button with
// aria-expanded and a labelled region. onChange lets a page react (e.g. swap a photograph).
export default function Accordion({ items, initial = 0, onChange, tone = 'light' }) {
  const uid = useId();
  const [open, setOpen] = useState(initial);
  const toggle = (i) => {
    const next = open === i ? null : i;
    setOpen(next);
    onChange?.(next);
  };
  const line = tone === 'dark' ? 'border-ivory/20' : 'border-charcoal/15';
  return (
    <ul className={`border-t ${line}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.title} className={`border-b ${line}`}>
            <h3>
              <button
                type="button"
                id={`${uid}-h${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p${i}`}
                onClick={() => toggle(i)}
                className="group flex min-h-11 w-full items-baseline justify-between gap-6 py-6 text-left"
              >
                <span className="flex items-baseline gap-5">
                  {item.kicker && <span className="hidden w-12 shrink-0 type-label opacity-60 sm:block">{item.kicker}</span>}
                  <span className="type-h3 transition-transform duration-500 ease-site group-hover:translate-x-1">{item.title}</span>
                </span>
                <span aria-hidden="true" className="relative mt-2 block size-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                  <span className={`absolute left-0 top-1/2 h-px w-4 bg-current transition-transform duration-500 ease-site ${isOpen ? 'rotate-0' : 'rotate-90'}`} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-p${i}`}
                  role="region"
                  aria-labelledby={`${uid}-h${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1, transition: { duration: 0.6, ease } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.4, ease } }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 sm:pl-[4.25rem]">{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
