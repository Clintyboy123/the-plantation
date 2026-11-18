import { motion, useScroll } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from '../context/SmoothScroll';
import useFloatingChrome from '../utils/useFloatingChrome';
import { easyEase } from '../utils/motion';

// Back to the top, bottom-right: the mirror of the music player on the left (same size, same porcelain and
// Forest button), so the two corners read as a pair. A fine ring around it fills as you read down the page.
// Appears once the hero has scrolled away; steps aside over the footer, which has its own "Back to the top".
export default function ScrollTop({ ready }) {
  const scroll = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const { pastHero, atFooter } = useFloatingChrome();
  const show = ready && pastHero && !atFooter;

  return (
    <div data-scroll-top className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[var(--margin)] z-40">
      <motion.button
        type="button"
        onClick={() => scroll.scrollTo(0, 1.4)}
        aria-label="Back to the top"
        tabIndex={show ? 0 : -1}
        aria-hidden={!show || undefined}
        className="group relative flex size-11 items-center justify-center rounded-full bg-ivory/95 text-ivory shadow-[0_14px_36px_-20px_rgb(32_45_37/0.55)] backdrop-blur-md"
        initial={false}
        animate={show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(8px)' }}
        transition={{ duration: 0.7, ease: easyEase }}
        style={{ pointerEvents: show ? 'auto' : 'none' }}
      >
        {/* reading progress: a champagne track that fills in Forest */}
        <svg aria-hidden="true" viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
          <circle cx="22" cy="22" r="21.25" fill="none" stroke="#d8c7aa" strokeWidth="1.5" />
          <motion.circle
            cx="22"
            cy="22"
            r="21.25"
            fill="none"
            stroke="#354638"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
        <span className="flex size-9 items-center justify-center rounded-full bg-forest transition-colors duration-500 ease-site group-hover:bg-evergreen">
          <ArrowUp className="size-3.5 transition-transform duration-500 ease-site group-hover:-translate-y-0.5" strokeWidth={1.6} aria-hidden="true" />
        </span>
      </motion.button>
    </div>
  );
}
