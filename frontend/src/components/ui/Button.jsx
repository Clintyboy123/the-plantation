import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, LoaderCircle } from 'lucide-react';

// Buttons. Rounded pills, uppercase, tracked: the same voice as the navigation.
// Hover: a fill rises from the bottom edge and the arrow steps forward.
//   variant: solid (forest on light), light (ivory on dark), outline (inherits colour), link (text + arrow)
//   to = internal route, href = external link (new tab) or #anchor / mailto / tel (same tab), otherwise a <button>.
const base =
  'group relative isolate inline-flex min-h-12 shrink-0 items-center whitespace-nowrap justify-center gap-3 overflow-hidden rounded-full type-nav transition-colors duration-500 ease-site disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  solid: 'bg-forest px-8 text-ivory hover:text-ivory',
  light: 'bg-ivory px-8 text-evergreen hover:text-ivory',
  outline: 'px-8 text-current ring-1 ring-current/45 ring-inset hover:text-evergreen',
  link: 'min-h-11 gap-3 rounded-none px-0 text-current',
};

const fills = {
  solid: 'bg-evergreen',
  light: 'bg-forest',
  outline: 'bg-ivory',
};

export default function Button({ variant = 'solid', to, href, loading = false, disabled = false, icon = true, className = '', children, ...props }) {
  const external = href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:');
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      {fills[variant] && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-500 ease-site group-hover:scale-y-100 ${fills[variant]}`}
        />
      )}
      <span className={variant === 'link' ? 'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-site group-hover:bg-[length:100%_1px]' : ''}>
        {children}
      </span>
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        icon && <Arrow className="size-4 transition-transform duration-500 ease-site group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
      )}
    </>
  );
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {inner}
      </Link>
    );
  }
  if (href && !external) {
    return (
      <a href={href} className={classes} {...props}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <button type="button" {...props} className={classes} disabled={loading || disabled} aria-busy={loading}>
      {inner}
    </button>
  );
}
