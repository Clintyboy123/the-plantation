import { useMemo } from 'react';

// The site's one decorative device: a scatter of tiny champagne lights that breathe slowly,
// like the fairy lights strung through the trees at night. Only ever placed in night sections.
// Deterministic positions (seeded), CSS-only animation, hidden from assistive tech.
export default function FairyLights({ count = 46, className = '' }) {
  const lights = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: count }, () => ({
      left: `${rand() * 100}%`,
      top: `${Math.pow(rand(), 1.6) * 100}%`, // denser toward the top, like a canopy
      size: 1.5 + rand() * 2.5,
      delay: `${-rand() * 6}s`,
      duration: `${3.5 + rand() * 4.5}s`,
    }));
  }, [count]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {lights.map((l, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-champagne"
          style={{
            left: l.left,
            top: l.top,
            width: l.size,
            height: l.size,
            boxShadow: `0 0 ${l.size * 4}px ${l.size}px rgb(216 199 170 / 0.35)`,
            animation: `twinkle ${l.duration} var(--ease-site) ${l.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
