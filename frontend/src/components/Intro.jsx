import Eyebrow from './Eyebrow';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';

// The one spacing rhythm for every section opening:
//   eyebrow --1.5rem--> heading --2rem--> copy --2.5rem--> actions
// On phones everything centres on one axis; from tablet up it follows "align".
export default function Intro({ eyebrow, time, title, as = 'h2', size = 'type-h2', body, actions, align = 'left', className = '', bodyClass = 'max-w-[34rem]' }) {
  const centred = align === 'center';
  const lines = Array.isArray(title) ? title : [title];
  return (
    <div className={`flex flex-col items-center text-center ${centred ? '' : 'md:items-start md:text-left'} ${className}`}>
      {eyebrow && (
        <Reveal>
          <Eyebrow time={time}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <SplitHeading as={as} lines={lines} className={`${size} ${eyebrow ? 'mt-6' : ''}`} />
      {body && (
        <Reveal className={`mt-8 type-body-l text-pretty opacity-85 ${bodyClass} ${centred ? 'mx-auto' : ''}`}>{body}</Reveal>
      )}
      {actions && (
        <Reveal className={`mt-10 flex flex-col items-center gap-x-8 gap-y-4 sm:flex-row sm:flex-wrap sm:justify-center ${centred ? '' : 'md:justify-start'}`}>{actions}</Reveal>
      )}
    </div>
  );
}
