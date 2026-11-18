import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { easyEase } from '../utils/motion';

// Text that gathers out of fairy dust: each letter condenses from a soft, glowing blur at a slightly
// scattered position, in a random order, while tiny champagne sparks rise and fade around the words.
// The whole effect lasts exactly `duration` seconds (default 2) after `delay`. Easy Ease throughout.
//
//   <FairyDust as="h1" className="type-hero" lines={['Where life’s most', <em key="u">unfold.</em>]} />
//
// Screen readers get the plain text once; the animated letters are hidden from them.
const LETTER = 0.9; // how long one letter takes to settle; the rest of the window is the random stagger

function seeded(seed) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const plainText = (node) => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainText).join('');
  if (isValidElement(node)) return plainText(node.props.children);
  return '';
};

export default function FairyDust({ as = 'p', lines, children, className = '', delay = 0, duration = 2, sparks = 28, seed = 11, block = true }) {
  const reduce = useReducedMotion();
  const Tag = as;
  const content = lines ?? [children];
  const label = content.map(plainText).join(' ');

  // Build the letter tree once: strings become words of letters (words never break mid-word).
  const tree = useMemo(() => {
    const rand = seeded(seed);
    const spread = Math.max(0, duration - LETTER);
    let key = 0;
    const letter = (ch) => {
      const r = () => rand();
      const d = delay + r() * spread;
      return (
        <motion.span
          key={key++}
          className="inline-block will-change-[transform,opacity,filter]"
          initial={{ opacity: 0, x: (r() - 0.5) * 28, y: (r() - 0.5) * 22 - 6, scale: 0.55, filter: 'blur(10px)', textShadow: '0 0 18px rgba(216,199,170,0.95)' }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', textShadow: '0 0 0px rgba(216,199,170,0)' }}
          transition={{ duration: LETTER, delay: d, ease: easyEase }}
        >
          {ch}
        </motion.span>
      );
    };
    const split = (node) => {
      if (typeof node === 'string') {
        return node.split(/(\s+)/).map((part) =>
          /^\s+$/.test(part) ? (
            ' '
          ) : part ? (
            <span key={key++} className="inline-block whitespace-nowrap">
              {[...part].map(letter)}
            </span>
          ) : null
        );
      }
      if (isValidElement(node)) return cloneElement(node, { key: key++ }, Children.map(node.props.children, split));
      return node;
    };
    return content.map((line) => split(line));
  }, [label, delay, duration, seed]); // eslint-disable-line react-hooks/exhaustive-deps

  const dust = useMemo(() => {
    const rand = seeded(seed * 7 + 3);
    return Array.from({ length: sparks }, (_, i) => {
      const life = 0.9 + rand() * 0.9;
      return {
        i,
        left: `${rand() * 100}%`,
        top: `${10 + rand() * 80}%`,
        size: 1.5 + rand() * 3,
        rise: -(14 + rand() * 46),
        drift: (rand() - 0.5) * 30,
        life,
        start: delay + rand() * Math.max(0, duration - life),
      };
    });
  }, [sparks, seed, delay, duration]);

  if (reduce) {
    return (
      <Tag className={className}>
        <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay, ease: easyEase }}>
          {content.map((line, i) => (
            <span key={i} className={block ? 'block' : ''}>
              {line}
              {!block && i < content.length - 1 ? ' ' : null}
            </span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  return (
    <Tag className={`relative ${className}`} aria-label={label}>
      <span aria-hidden="true">
        {tree.map((line, i) => (
          <span key={i} className={block ? 'block' : ''}>
            {line}
            {!block && i < tree.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {dust.map((p) => (
          <motion.span
            key={p.i}
            className="absolute rounded-full bg-champagne"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, boxShadow: `0 0 ${p.size * 4}px ${p.size}px rgb(232 215 174 / 0.55)` }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.4], x: [0, p.drift * 0.5, p.drift], y: [0, p.rise * 0.5, p.rise] }}
            transition={{ duration: p.life, delay: p.start, ease: easyEase, times: [0, 0.4, 1] }}
          />
        ))}
      </span>
    </Tag>
  );
}
