import FairyDust from './FairyDust';
import ScrollFadeLines from './ScrollFadeLines';

// A display headline with art-directed line breaks: pass each line yourself.
//   <SplitHeading as="h2" className="type-h2" lines={['Exceptional spaces.', <em>Meaningful connections.</em>]} />
// Section headings read in line by line as the visitor scrolls (ScrollFadeLines: each line fades up out of a
// soft blur, tied to the scroll). Page titles that play as the page opens (onMount) gather out of fairy dust
// instead (2 seconds).
export default function SplitHeading({ as = 'h2', lines, className = '', delay = 0, onMount = false }) {
  if (onMount) return <FairyDust as={as} lines={lines} className={className} delay={delay} />;
  return <ScrollFadeLines as={as} lines={lines} className={className} />;
}
