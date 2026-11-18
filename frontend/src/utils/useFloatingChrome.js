import { useEffect, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { useLocation } from 'react-router';

// Where the visitor is on the page, for the floating controls (social rail, back-to-top):
//   pastHero: the page's opening section (its hero) has mostly scrolled away
//   atFooter: the footer has come into view
export default function useFloatingChrome() {
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const [state, setState] = useState({ pastHero: false, atFooter: false });

  const measure = () => {
    const vh = window.innerHeight;
    const hero = document.querySelector('#main section');
    const footer = document.querySelector('footer');
    const next = {
      pastHero: hero ? hero.getBoundingClientRect().bottom < vh * 0.35 : scrollY.get() > vh * 0.8,
      atFooter: !!footer && footer.getBoundingClientRect().top < vh * 0.8,
    };
    setState((prev) => (prev.pastHero === next.pastHero && prev.atFooter === next.atFooter ? prev : next));
  };

  useMotionValueEvent(scrollY, 'change', measure);
  useEffect(() => {
    measure();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
