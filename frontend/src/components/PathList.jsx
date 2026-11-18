import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Photo from './Photo';
import Frame from './Frame';
import { tones } from '../content/frames';
import { paths, pathOrder } from '../content/enquiry';
import { ease, fadeUp, stagger, viewportOnce } from '../utils/motion';

// "What are you planning?" Six honest routes into the right team. Each row is a link to the
// enquiry form already set to that audience. On desktop, the hovered path's photograph appears.
export default function PathList({ exclude }) {
  const [active, setActive] = useState(null);
  const keys = pathOrder.filter((k) => k !== exclude);
  return (
    <div className="grid-site items-center">
      <motion.ul
        className="col-span-4 border-t border-current/20 md:col-span-12 lg:col-span-7"
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        onMouseLeave={() => setActive(null)}
      >
        {keys.map((key, i) => (
          <motion.li key={key} variants={fadeUp} className="border-b border-current/20">
            <Link
              to={`/enquire?type=${key}`}
              onMouseEnter={() => setActive(key)}
              onFocus={() => setActive(key)}
              className="group flex min-h-11 items-center justify-center gap-6 py-5 md:justify-between md:py-6"
            >
              <span className="flex items-baseline gap-6">
                <span className="hidden font-display text-lg italic opacity-60 md:inline">0{i + 1}</span>
                <span className="font-display text-[clamp(1.75rem,3.2vw,3rem)] font-light leading-tight transition-transform duration-500 ease-site group-hover:translate-x-2">
                  {paths[key].label}
                </span>
              </span>
              <ArrowRight className="hidden size-5 shrink-0 -translate-x-3 opacity-0 transition-all duration-500 ease-site group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 md:block" strokeWidth={1.25} aria-hidden="true" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
      <Frame aria-hidden="true" tone={tones[active] || 'champagne'} className="hidden aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:block">
        {keys.map((key) => (
          <motion.div
            key={key}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: active === key ? 1 : 0, scale: active === key ? 1 : 1.04 }}
            transition={{ duration: 0.8, ease }}
          >
            <Photo name={paths[key].photo} sizes="30vw" className="size-full" alt="" frame={false} />
          </motion.div>
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-10 text-center"
          animate={{ opacity: active ? 0 : 1 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="font-display text-2xl italic leading-snug opacity-80">Choose a path, and your message goes straight to the team who will host you.</p>
        </motion.div>
      </Frame>
    </div>
  );
}
