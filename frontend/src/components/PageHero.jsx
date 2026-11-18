import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Photo from './Photo';
import Eyebrow from './Eyebrow';
import SplitHeading from './SplitHeading';
import { ease } from '../utils/motion';

// Full-bleed photographic opening for an experience page. "align" places the words:
// "bottom-left" (editorial), "center" (ceremonial) or "bottom-center".
export default function PageHero({ photo, eyebrow, time, lines, body, actions, align = 'bottom-left', overlay = 'from-evergreen/85 via-evergreen/25 to-evergreen/35', height = 'h-[100svh] min-h-[38rem]' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '16%']);
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const centred = align !== 'bottom-left';

  return (
    <section ref={ref} className={`on-dark relative overflow-hidden bg-evergreen text-ivory ${height}`}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div className="absolute inset-0" initial={{ scale: reduce ? 1 : 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.8, ease }}>
          <Photo name={photo} priority sizes="100vw" className="size-full" frame={false} />
        </motion.div>
        <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />
        {align === 'bottom-left' && <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-evergreen/55 via-evergreen/10 to-transparent" />}
      </motion.div>
      <motion.div
        style={{ opacity: fade }}
        className={`wrap relative flex h-full flex-col pb-24 md:pb-24 ${align === 'center' ? 'items-center justify-center pt-24 text-center' : 'justify-end'} ${
          align === 'bottom-center' ? 'items-center text-center' : ''
        } ${align === 'bottom-left' ? 'items-center text-center md:items-start md:text-left' : ''}`}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>
          <Eyebrow time={time} className="text-champagne">{eyebrow}</Eyebrow>
        </motion.div>
        <SplitHeading as="h1" onMount delay={0.8} gap={0.13} className={`mt-6 type-hero ${centred ? '' : 'max-w-[14ch]'}`} lines={lines} />
        {(body || actions) && (
          <motion.div
            className={`mt-8 flex flex-col ${centred ? 'items-center' : 'items-center md:items-start'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease }}
          >
            {body && <p className="max-w-[32rem] type-body-l text-ivory/85">{body}</p>}
            {actions && <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">{actions}</div>}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
