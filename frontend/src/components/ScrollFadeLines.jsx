import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { easyEaseFn } from '../utils/motion';

// A heading that reads itself in as you scroll: each line fades up out of a soft blur, one after the
// other, tied to the scroll position (so it plays at the visitor's pace, and reverses on the way back up).
// Every line is fully in by the time the heading reaches the upper third of the screen.
//   <ScrollFadeLines as="h2" className="..." lines={['First line', <em key="e">second</em>]} />
export default function ScrollFadeLines({ as = 'h2', lines, className = '' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.4'] });
  const { scrollY } = useScroll();
  // a heading near the end of a page may never reach the upper third: at the bottom of the page it completes
  const progress = useTransform([scrollYProgress, scrollY], ([p, y]) =>
    y >= document.documentElement.scrollHeight - window.innerHeight - 4 ? 1 : p,
  );
  const Tag = as;

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <Line key={i} progress={progress} i={i} n={lines.length}>
          {l}
        </Line>
      ))}
    </Tag>
  );
}

function Line({ progress, i, n, children }) {
  // lines overlap: each starts a little after the previous one and takes 40% of the run
  const span = 0.4;
  const start = (i / Math.max(1, n - 1)) * (1 - span);
  const k = useTransform(progress, (p) => easyEaseFn(Math.min(1, Math.max(0, (p - start) / span))));
  const opacity = useTransform(k, [0, 1], [0, 1]);
  const y = useTransform(k, [0, 1], [22, 0]);
  const filter = useTransform(k, (v) => `blur(${(1 - v) * 8}px)`);
  return (
    <motion.span className="block" style={{ opacity, y, filter }}>
      {children}
    </motion.span>
  );
}
