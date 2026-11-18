import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo';
import Photo from './Photo';
import FairyLights from './FairyLights';
import useFocusTrap from '../hooks/useFocusTrap';
import { useSmoothScroll } from '../context/SmoothScroll';
import { nav, navSecondary, site } from '../content/site';
import Frame from './Frame';
import { routeTone } from '../content/frames';
import { cinema, ease } from '../utils/motion';

// Full-screen menu. Night falls over the page (evergreen, fairy lights); the experiences are listed
// by the hour they belong to, and on desktop the photograph of the hovered one fades in beside them.
export default function Menu({ open, onClose }) {
  const panel = useRef(null);
  const { pathname } = useLocation();
  const scroll = useSmoothScroll();
  const [preview, setPreview] = useState(nav[0].photo);
  const close = useCallback(() => onClose(), [onClose]);

  useFocusTrap(open, panel, close);

  useEffect(() => {
    if (open) scroll.stop();
    else scroll.start();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close when the route changes (a link was followed).
  useEffect(() => {
    close();
  }, [pathname, close]);

  const ordered = [...nav].sort((a, b) => a.time.localeCompare(b.time));
  const photos = [...nav, ...navSecondary].map((n) => n.photo);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="on-dark fixed inset-0 z-50 overflow-y-auto bg-evergreen text-ivory"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.9, ease: cinema } }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.7, ease: cinema, delay: 0.1 } }}
        >
          <FairyLights count={28} className="opacity-60" />

          <div className="wrap relative flex min-h-dvh flex-col">
            <div className="flex h-22 items-center justify-between lg:h-26">
              <Link to="/" onClick={close} aria-label="The Plantation, home">
                <Logo className="w-36 lg:w-44" />
              </Link>
              <button type="button" onClick={close} className="group flex min-h-11 items-center gap-3 type-nav">
                <span>Close</span>
                <span aria-hidden="true" className="relative block size-7">
                  <span className="absolute left-0 top-1/2 h-px w-7 rotate-45 bg-current transition-transform duration-500 ease-site group-hover:rotate-[135deg]" />
                  <span className="absolute left-0 top-1/2 h-px w-7 -rotate-45 bg-current transition-transform duration-500 ease-site group-hover:rotate-45" />
                </span>
              </button>
            </div>

            <div className="grid-site flex-1 items-center py-10 lg:py-6">
              <nav aria-label="Menu" className="col-span-4 md:col-span-12 lg:col-span-7">
                <motion.ul
                  className="flex flex-col items-center lg:items-start"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } }, hidden: {} }}
                >
                  {ordered.map((item) => (
                    <li key={item.to} className="overflow-hidden">
                      <motion.div variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease } } }}>
                        <Link
                          to={item.to}
                          onClick={close}
                          onMouseEnter={() => setPreview(item.photo)}
                          onFocus={() => setPreview(item.photo)}
                          aria-current={pathname === item.to ? 'page' : undefined}
                          className="group flex items-baseline gap-5 py-1.5 pr-6 text-center lg:text-left"
                        >
                          <span className="hidden w-14 font-display text-lg italic text-champagne/80 transition-colors duration-500 group-hover:text-champagne lg:block">
                            {item.time}
                          </span>
                          <span className="font-display text-[clamp(2.4rem,5.4vw,4.75rem)] font-light leading-[1.02] tracking-[-0.01em] transition-[transform,opacity] duration-500 ease-site group-hover:translate-x-3 group-aria-[current=page]:italic">
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </motion.ul>

                <motion.ul
                  className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 lg:ml-[4.75rem] lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.6 } }}
                >
                  {navSecondary.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={close}
                        onMouseEnter={() => setPreview(item.photo)}
                        className="inline-flex min-h-11 items-center type-nav text-mist transition-colors hover:text-ivory"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/enquire" onClick={close} className="inline-flex min-h-11 items-center type-nav text-champagne transition-colors hover:text-ivory">
                      Enquire
                    </Link>
                  </li>
                </motion.ul>
              </nav>

              <motion.div
                aria-hidden="true"
                className="hidden lg:col-span-4 lg:col-start-9 lg:block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 1, ease } }}
              >
                <Frame tone={routeTone[[...nav, ...navSecondary].find((n) => n.photo === preview)?.to] || 'champagne'} className="aspect-[4/5] w-full">
                  {photos.map((name) => (
                    <div
                      key={name}
                      className={`absolute inset-0 transition-opacity duration-700 ease-site ${preview === name ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <Photo name={name} sizes="30vw" className="size-full" alt="" frame={false} />
                    </div>
                  ))}
                </Frame>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-col items-center gap-3 border-t border-ivory/15 py-8 text-center type-caption text-mist md:flex-row md:justify-between md:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.9, duration: 0.6 } }}
            >
              <p>{site.addressLine}</p>
              <p className="flex flex-wrap justify-center gap-x-6">
                <a href={site.phoneHref} className="hover:text-ivory">{site.phone}</a>
                <a href={`mailto:${site.email}`} className="hover:text-ivory">{site.email}</a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
