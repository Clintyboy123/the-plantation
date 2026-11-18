import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LogoIntro from '../components/LogoIntro';
import MusicPlayer from '../components/MusicPlayer';
import SocialRail from '../components/SocialRail';
import ScrollTop from '../components/ScrollTop';
import { useSmoothScroll } from '../context/SmoothScroll';
import { easyEase } from '../utils/motion';

// Shared frame for every page.
// Full page load: the logo write-on intro (LogoIntro) plays on white, then fades to the site. As it starts
// to fade, the page content is mounted afresh so the hero's own entrance (fairy dust) plays in view.
// Page changes after that: a camera lens blur. The old page racks out of focus and blooms softly toward
// ivory; the new page arrives out of focus and pulls back sharp. No movement or zoom, so nothing shakes as it
// settles. Easy Ease throughout. Outside the intro, the logo is never animated.
const LENS = { out: 0.45, hold: 0.04, in: 0.75 };
const SHARP = 'blur(0px) brightness(1)';
const SOFT = 'blur(22px) brightness(1.06)';
export default function MainLayout({ children }) {
  const location = useLocation();
  const scroll = useSmoothScroll();
  const [revealed, setRevealed] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const firstPage = useRef(true);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (introDone) scroll.start();
    else scroll.stop();
  }, [introDone]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    // a page change freezes any leftover scroll momentum, so the old page holds still while it goes soft
    if (!firstPage.current && introDone) scroll.stop();
    firstPage.current = false;
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    {!introDone && (
        <LogoIntro
          onReveal={() => setRevealed(true)}
          onDone={() => {
            setIntroDone(true);
            window.dispatchEvent(new Event('plantation:intro-done')); // the music player starts here
          }}
        />
      )}
    <div id="page-root" className="flex min-h-dvh flex-col" inert={!introDone || undefined}>
      <a
        href="#main"
        className="sr-only z-[60] bg-ivory px-4 py-2 text-evergreen focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <span id="top" />
      <Header />
      {/* Lives outside the page transitions, so the music carries on across every page */}
      <MusicPlayer />
      <SocialRail show={introDone} />
      <ScrollTop ready={introDone} />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          scroll.toTop();
          scroll.start();
        }}
      >
        <motion.div
          key={location.pathname}
          className="flex flex-1 flex-col"
          initial={firstPage.current || reduce ? false : { filter: SOFT, opacity: 0.6 }}
          animate={{
            filter: SHARP,
            opacity: 1,
            transition: { duration: LENS.in, ease: easyEase, delay: LENS.hold },
            // no lingering filter: it would trap fixed-position children (lightbox, sticky stages)
            transitionEnd: { filter: 'none' },
          }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.3, ease: easyEase } }
              : { filter: SOFT, opacity: 0.6, transition: { duration: LENS.out, ease: easyEase } }
          }
        >
          {/* Remounted once when the intro starts to clear, so the hero's entrance plays in view */}
          <main id="main" key={revealed ? 'live' : 'behind-intro'} className="flex-1">
            {children}
          </main>
          <Footer />

        </motion.div>
      </AnimatePresence>
    </div>
    </>
  );
}
