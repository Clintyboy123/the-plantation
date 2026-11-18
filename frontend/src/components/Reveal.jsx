import { motion } from 'motion/react';
import { fadeUp, stagger, viewportOnce } from '../utils/motion';

// Animates its content in the first time it scrolls into view.
//   <Reveal>...</Reveal>                       one block fades up
//   <Reveal group> <Reveal.Item/> ... </Reveal> children arrive one after another
export default function Reveal({ as = 'div', group = false, gap, delay, className, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={group ? stagger(gap, delay) : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Reveal.Item = function RevealItem({ as = 'div', className, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp} {...rest}>
      {children}
    </Tag>
  );
};
