import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// A horizontal carousel that never takes over the page's scroll.
// Browse it by dragging (mouse), swiping (trackpad / touch), the arrow buttons or the keyboard arrows.
// Native scrolling with snap points, so it feels like the device; a thin progress line shows position.
//   <Carousel label="Dishes" controlsSlot={el}> {items} </Carousel>
export default function Carousel({ label, children, tone = 'dark', className = '' }) {
  const track = useRef(null);
  const drag = useRef(null);
  const [progress, setProgress] = useState({ start: 0, size: 1 });
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const size = el.clientWidth / el.scrollWidth;
    setProgress({ start: max > 0 ? (el.scrollLeft / max) * (1 - size) : 0, size });
    setEdges({ atStart: el.scrollLeft < 4, atEnd: el.scrollLeft > max - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // one card at a time
  const step = (dir) => {
    const el = track.current;
    const card = el.querySelector('[data-carousel-item]');
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const w = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  // mouse drag (touch and trackpads scroll natively)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = track.current;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    const el = track.current;
    // settle on the nearest card, then restore snapping
    const card = el.querySelector('[data-carousel-item]');
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const w = card ? card.getBoundingClientRect().width + gap : 1;
    el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: 'smooth' });
    setTimeout(() => {
      el.style.scrollSnapType = '';
      el.style.scrollBehavior = '';
    }, 450);
    // a drag is not a click on the card underneath
    if (d.moved) {
      const stop = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      el.addEventListener('click', stop, { capture: true, once: true });
    }
    drag.current = null;
  };

  const dark = tone === 'dark';
  const btn = `flex size-12 items-center justify-center rounded-full ring-1 transition-[background-color,color,opacity] duration-500 ease-site disabled:opacity-30 disabled:cursor-default ${
    dark ? 'ring-ivory/40 hover:enabled:bg-ivory hover:enabled:text-evergreen' : 'ring-charcoal/25 hover:enabled:bg-forest hover:enabled:text-ivory'
  }`;

  return (
    <div className={className} role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        tabIndex={0}
        onScroll={measure}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            step(1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            step(-1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="flex cursor-grab snap-x snap-mandatory scroll-px-[var(--margin)] gap-[var(--gutter)] overflow-x-auto px-[var(--margin)] pb-2 [scrollbar-width:none] select-none active:cursor-grabbing focus-visible:outline-offset-[-2px] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div data-carousel-item className="shrink-0 snap-start">
            {child}
          </div>
        ))}
        <div aria-hidden="true" className="w-px shrink-0" />
      </div>

      <div className="wrap mt-10 flex items-center gap-6">
        <div className={`relative h-px flex-1 ${dark ? 'bg-ivory/20' : 'bg-charcoal/15'}`} aria-hidden="true">
          <span
            className="absolute inset-y-[-1px] rounded-full bg-champagne transition-[left] duration-150"
            style={{ left: `${progress.start * 100}%`, width: `${progress.size * 100}%` }}
          />
        </div>
        <div className="flex gap-3">
          <button type="button" className={btn} onClick={() => step(-1)} disabled={edges.atStart} aria-label="Previous">
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className={btn} onClick={() => step(1)} disabled={edges.atEnd} aria-label="Next">
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
