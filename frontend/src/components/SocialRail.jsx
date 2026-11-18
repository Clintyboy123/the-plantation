import { motion } from 'motion/react';
import SocialIcon from './SocialIcon';
import { site } from '../content/site';
import { easyEase } from '../utils/motion';
import useFloatingChrome from '../utils/useFloatingChrome';

// The estate's social channels, standing in a slim porcelain rail on the left edge, vertically centred.
// Appears once the hero has scrolled away.
// It sits in the page margin (centred on it), so it never touches the content; the same porcelain material
// as the music player. Shown from wide screens (xl) up, where the margin has room; smaller screens get the
// icons in the footer. Hover: the mark fills Forest and its name slides out to the right.
export default function SocialRail({ show: introDone }) {
  // not over the hero (it would compete with the opening image), and it steps aside at the footer,
  // which carries the same icons
  const { pastHero, atFooter } = useFloatingChrome();
  const show = introDone && pastHero && !atFooter;
  return (
    <nav
      aria-hidden={!show || undefined}
      aria-label="The Plantation on social media"
      data-social-rail
      className="fixed left-[calc(var(--margin)/2)] top-1/2 z-40 hidden -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-site xl:block"
    >
      <motion.div
        initial={false}
        animate={show ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: -16, filter: 'blur(8px)' }}
        transition={{ duration: 0.9, ease: easyEase, delay: show ? 0.15 : 0 }}
        style={{ pointerEvents: show ? 'auto' : 'none' }}
      >
        <ul className="flex flex-col items-center gap-0.5 rounded-full bg-ivory/95 px-px py-1 text-evergreen shadow-[0_14px_36px_-20px_rgb(32_45_37/0.55)] ring-1 ring-champagne backdrop-blur-md">
          {site.socials.map((s) => (
            <li key={s.label} className="group relative">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.name || s.label} (opens in a new tab)`}
                className="flex size-8 items-center justify-center rounded-full transition-colors duration-500 ease-site hover:bg-forest hover:text-ivory focus-visible:bg-forest focus-visible:text-ivory"
              >
                <SocialIcon name={s.label} className="size-4" />
              </a>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-full bg-forest px-3 py-1.5 type-label text-ivory opacity-0 transition-[opacity,transform] duration-500 ease-site group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100"
              >
                {s.name || s.label}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>
  );
}
