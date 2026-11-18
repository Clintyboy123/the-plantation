import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Logo from './Logo';
import Menu from './Menu';
import { nav } from '../content/site';
import { ease } from '../utils/motion';

// Pages that open on a full photograph or a dark panel: the header starts in ivory ink there.
// Every other page (39 on Church, Gallery, Our Story, Contact, Enquire, 404) opens on ivory.
const DARK_TOPS = ['/', '/weddings', '/corporate', '/accommodation', '/the-boma', '/cuisine'];

export default function Header() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 480 && y > previous + 2);
    if (y < previous - 2) setHidden(false);
  });

  // On a page change the header comes back while the old page is still going out of focus, so it is
  // settled before the new page arrives (it used to slide in afterwards, which read as a jolt).
  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  const lightTop = !DARK_TOPS.includes(pathname);
  const solid = scrolled;
  const ink = solid || lightTop ? 'text-evergreen' : 'text-ivory';

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ease-site ${ink} ${
          solid ? 'bg-ivory/90 shadow-[0_1px_0_rgb(32_45_37/0.08)] backdrop-blur-md' : 'bg-transparent'
        }`}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease }}
      >
        {!solid && !lightTop && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-evergreen/55 to-transparent" />
        )}
        <div className={`wrap flex items-center justify-between transition-[height] duration-500 ease-site ${solid ? 'h-18' : 'h-22 lg:h-26'}`}>
          <Link to="/" className={`-my-2 py-2 transition-none ${ink}`} aria-label="The Plantation, home">
            {/* The logo never animates: fixed size, and its colour switches without a fade. */}
            <Logo className="w-34 lg:w-40" />
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="group relative block py-3 type-nav">
                    {({ isActive }) => (
                      <>
                        <span className="relative">
                          {item.short || item.label}
                          <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-site group-hover:origin-left group-hover:scale-x-100" />
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute -bottom-1 left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-champagne shadow-[0_0_10px_2px_rgb(216_199_170/0.6)]"
                            transition={{ duration: 0.6, ease }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-6">
            <Link
              to="/enquire"
              className={`hidden min-h-11 items-center rounded-full px-6 type-nav ring-1 ring-inset transition-colors duration-500 ease-site sm:inline-flex ${
                solid || lightTop ? 'ring-evergreen/35 hover:bg-evergreen hover:text-ivory' : 'ring-ivory/50 hover:bg-ivory hover:text-evergreen'
              }`}
            >
              Enquire
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex min-h-11 items-center gap-3 pl-2 type-nav"
            >
              <span className="hidden sm:inline">Menu</span>
              <span aria-hidden="true" className="flex w-7 flex-col items-end gap-[7px]">
                <span className="h-px w-7 bg-current" />
                <span className="h-px w-4 bg-current transition-[width] duration-500 ease-site group-hover:w-7" />
              </span>
              <span className="sr-only sm:hidden">Open menu</span>
            </button>
          </div>
        </div>
      </motion.header>
      <Menu open={open} onClose={closeMenu} />
    </>
  );
}
