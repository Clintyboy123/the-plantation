import { ArrowUpRight } from 'lucide-react';
import Frame from './Frame';

// Where the venue is: the address, a framed map and a way to get directions.
// The map is Google's own embed, softened to sit in the palette (the page's colours, not Google's), and loads
// only as it scrolls near. Pass the place: { label, address: [...lines], mapUrl, mapEmbed }.
export default function LocationMap({ place, dark = false, className = '' }) {
  return (
    // same rule and rhythm as the "Prefer to talk?" block above it
    <div className={`border-t pt-8 ${dark ? 'border-ivory/15' : 'border-charcoal/15'} ${className}`}>
      <div className="text-center md:text-left">
        <p className={`type-label ${dark ? 'text-champagne' : 'text-stone'}`}>Find us</p>
        <address className={`mt-4 not-italic type-body ${dark ? 'text-mist' : 'text-stone'}`}>{place.address.join(', ')}</address>
      </div>

      <Frame size="sm" className="mt-6 aspect-[4/3]">
        <iframe
          title={`Map to ${place.label}`}
          src={place.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0 [filter:grayscale(0.85)_sepia(0.18)_contrast(0.95)_brightness(1.02)]"
        />
      </Frame>

      <div className="mt-5 flex justify-center md:justify-start">
        <a
          href={place.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex min-h-11 items-center gap-2 type-nav transition-colors ${dark ? 'text-champagne hover:text-ivory' : 'text-forest hover:text-evergreen'}`}
        >
          Get directions
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-site group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
