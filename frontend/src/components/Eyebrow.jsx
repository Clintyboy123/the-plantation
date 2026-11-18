// The small label that opens a section. "time" is the hour of the day on the estate this section
// belongs to (the site's organising idea); it is set in italic display type before the label.
export default function Eyebrow({ time, children, className = '' }) {
  return (
    <p className={`type-label flex items-center gap-4 ${className}`}>
      {time && (
        <>
          <span className="font-display text-[1.0625rem] font-normal italic leading-none tracking-normal normal-case">{time}</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
