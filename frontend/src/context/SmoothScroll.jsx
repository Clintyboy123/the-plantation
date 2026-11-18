import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';
import { easyEaseFn } from '../utils/motion';

// Inertial scrolling for mouse and trackpad (touch keeps the phone's own scrolling).
// Switched off entirely for visitors who ask their device for reduced motion.
const ScrollContext = createContext({ stop() {}, start() {}, toTop() { window.scrollTo(0, 0); }, scrollTo(y) { window.scrollTo({ top: y, behavior: 'smooth' }); } });

export function SmoothScroll({ children }) {
  const reduce = useReducedMotion();
  const lenis = useRef(null);

  useEffect(() => {
    if (reduce) return undefined;
    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true });
    lenis.current = instance;
    let frame;
    const raf = (time) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis.current = null;
    };
  }, [reduce]);

  const api = {
    stop: () => lenis.current?.stop(),
    start: () => lenis.current?.start(),
    toTop: () => (lenis.current ? lenis.current.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)),
    // Eased scroll to a page position (Easy Ease), used by the wedding reel to settle on a card.
    scrollTo: (y, duration = 0.9) =>
      lenis.current ? lenis.current.scrollTo(y, { duration, easing: easyEaseFn }) : window.scrollTo({ top: y, behavior: 'smooth' }),
  };

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(ScrollContext);
