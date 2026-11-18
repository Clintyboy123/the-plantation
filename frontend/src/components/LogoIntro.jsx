import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { easyEase } from '../utils/motion';

// Page-load intro: the After Effects logo write-on (light version, rendered from
// "Plantation Logo Animation/The_Plantation_Logo_Write-On.aep") plays on a white screen. When the lockup is
// complete it holds for a breath, then fades away into the home page and the music starts.
//
//   0.0 - 5.3 s   the video plays: the script writes itself, the oval and P follow
//   5.3 - 5.9 s   it holds on the finished lockup
//   5.9 - 6.8 s   the intro fades to the page (Easy Ease); onReveal fires as it starts
//
// 'plantation:enter' fires as the fade starts, and the music player starts playing then. Browsers only allow
// sound after the visitor has clicked, tapped or pressed a key, so if they have not, the music starts on their
// first interaction instead. A click, Escape or "Skip" during the write-on goes straight in (and, being a
// click, lets the music start at once). Slow or failed video: straight to the page. Reduced motion: the still
// logo shows briefly instead.
const STOP_AT = 5.3; // seconds into the video: the lockup is complete and holding
const HOLD = 0.6; // seconds on the finished lockup before the fade
const FADE = 0.9;
const READY_WITHIN = 2500; // ms: if the video is not ready to play by then (slow connection), skip the intro
const SAFETY = 9000; // ms: whatever happens, never hold the visitor longer than this

export default function LogoIntro({ onReveal, onDone }) {
  const reduce = useReducedMotion();
  const video = useRef(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const left = useRef(false);

  // Called inside a click when the visitor skips, so the music may start right there.
  const leave = () => {
    if (left.current) return;
    left.current = true;
    window.dispatchEvent(new Event('plantation:enter'));
    setLeaving(true);
  };
  const leaveRef = useRef(leave);
  leaveRef.current = leave;

  // Lock scrolling while the intro is up.
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Play the write-on, hold on the lockup, then go.
  useEffect(() => {
    const go = () => leaveRef.current();
    if (reduce) {
      const t = setTimeout(go, 1400);
      return () => clearTimeout(t);
    }
    const v = video.current;
    if (!v) return undefined;
    let started = false;
    let hold;
    const notReady = setTimeout(() => !started && go(), READY_WITHIN);
    const safety = setTimeout(go, SAFETY);
    const start = () => {
      if (started) return;
      started = true;
      clearTimeout(notReady);
      const p = v.play();
      if (p && p.catch) p.catch(go);
    };
    const onTime = () => {
      if (v.currentTime >= STOP_AT && !hold) {
        v.pause();
        hold = setTimeout(go, HOLD * 1000);
      }
    };
    if (v.readyState >= 4) start();
    v.addEventListener('canplaythrough', start);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', go);
    v.addEventListener('error', go);
    return () => {
      clearTimeout(notReady);
      clearTimeout(safety);
      clearTimeout(hold);
      v.removeEventListener('canplaythrough', start);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', go);
      v.removeEventListener('error', go);
    };
  }, [reduce]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && leaveRef.current();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!leaving) return undefined;
    onReveal?.();
    const t = setTimeout(() => {
      document.documentElement.style.overflow = '';
      setGone(true);
      onDone?.();
    }, FADE * 1000);
    return () => clearTimeout(t);
  }, [leaving]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="logo-intro"
          data-lenis-prevent
          data-logo-intro
          role="presentation"
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: FADE, ease: easyEase }}
          onClick={leave}
        >
          {reduce ? (
            <img src="/intro/logo-final.webp" alt="The Plantation" className="w-[100vw] max-w-none shrink-0 object-contain md:w-[min(54vw,760px)]" />
          ) : (
            // multiply: the video's white becomes exactly the page's white, so no frame edge can ever show.
            // Kept deliberately small: the script spans ~540px on desktop (the video frame is 1.4x the script's width).
            <video
              ref={video}
              className="w-[100vw] max-w-none shrink-0 object-contain mix-blend-multiply md:w-[min(54vw,760px)]"
              src="/intro/logo-write-on.mp4"
              muted
              playsInline
              preload="auto"
              aria-label="The Plantation logo"
            />
          )}
          {!leaving && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                leave();
              }}
              className="absolute bottom-8 right-[var(--margin)] min-h-11 rounded-full px-5 type-nav text-stone outline-none transition-colors hover:text-forest"
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
