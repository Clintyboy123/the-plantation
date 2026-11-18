// The site's motion language, defined once so every animation shares the same timing and easing.
// Every animation uses Easy Ease: After Effects' F9 keyframe (33.33% influence in and out),
// i.e. cubic-bezier(0.333, 0, 0.667, 1). "cinema" is kept as a name for the big image and page moves,
// but it is the same curve. Keep in step with --ease-site in styles/index.css.
export const easyEase = [0.333, 0, 0.667, 1];
export const ease = easyEase;
export const cinema = easyEase;

export const duration = {
  fast: 0.25, // hovers, taps, small state changes
  base: 0.7, // most entrances
  slow: 1.1, // headline lines, image reveals
  hero: 1.6, // the opening of the home page only
};

// Fade up into place: the default entrance for copy blocks.
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
};

// Put on a parent so its children arrive one after another.
export const stagger = (gap = 0.09, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

// A headline line rising out of its mask.
export const line = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: duration.slow, ease } },
};

// An image uncovered by a moving edge (clip-path).
export const wipe = (from = 'bottom') => ({
  hidden: {
    clipPath: {
      bottom: 'inset(100% 0% 0% 0%)',
      top: 'inset(0% 0% 100% 0%)',
      left: 'inset(0% 100% 0% 0%)',
      right: 'inset(0% 0% 0% 100%)',
    }[from],
  },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: duration.slow + 0.2, ease: cinema } },
});

// The image inside a wipe settles from a slight zoom.
export const settle = {
  hidden: { scale: 1.16 },
  visible: { scale: 1, transition: { duration: duration.slow + 0.7, ease } },
};

export const viewportOnce = { once: true, amount: 0.2 };

// Easy Ease as a function of t (0..1), for places that need a function rather than a bezier array (Lenis).
// Solves cubic-bezier(0.333, 0, 0.667, 1) for x, then returns y.
export function easyEaseFn(t) {
  const x1 = 0.333, y1 = 0, x2 = 0.667, y2 = 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let u = t;
  for (let i = 0; i < 6; i++) {
    const x = ((ax * u + bx) * u + cx) * u - t;
    const d = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(x) < 1e-5 || !d) break;
    u -= x / d;
  }
  return ((ay * u + by) * u + cy) * u;
}

// Float in from blur: the site's single reveal for photographs. The image (with its frame) rises a
// little, sharpens out of a soft blur and settles from a slight zoom. Replaces the old clip "wipe".
export const floatIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 48, scale: 1.04, filter: 'blur(18px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.3, ease: easyEase, delay } },
});
