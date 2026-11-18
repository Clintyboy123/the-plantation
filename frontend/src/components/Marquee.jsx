// A slow, endless line of text (client names, awards). Duplicated once so the loop is seamless.
// Pauses on hover; stops for reduced motion (via the global CSS rule).
export default function Marquee({ items, className = '', speed = 60 }) {
  const row = (hidden) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-8 md:px-12">{item}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-champagne" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] ${className}`}>
      <div className="flex w-max group-hover:[animation-play-state:paused]" style={{ animation: `drift ${speed}s linear infinite` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
