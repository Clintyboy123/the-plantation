import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import useFocusTrap from '../hooks/useFocusTrap';
import { useSmoothScroll } from '../context/SmoothScroll';
import { allPhotos } from './Photo';
import { cinema, ease } from '../utils/motion';
import { BASE } from '../utils/asset';

// Full-screen viewer for a list of photo keys. Arrow keys, swipe and buttons move between images;
// Escape closes and returns focus to the thumbnail that opened it.
export default function Lightbox({ items, index, onClose, onIndex }) {
  const panel = useRef(null);
  const scroll = useSmoothScroll();
  const [direction, setDirection] = useState(1);
  const open = index !== null && index !== undefined;
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(open, panel, close);

  const go = useCallback(
    (step) => {
      setDirection(step);
      onIndex((i) => (i + step + items.length) % items.length);
    },
    [items.length, onIndex]
  );

  useEffect(() => {
    if (!open) return undefined;
    scroll.stop();
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      scroll.start();
    };
  }, [open, go]); // eslint-disable-line react-hooks/exhaustive-deps

  const name = open ? items[index] : null;
  const photo = name ? allPhotos[name] : null;

  return createPortal(
    <AnimatePresence>
      {open && photo && (
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="on-dark fixed inset-0 z-[60] flex flex-col bg-night/97 text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease } }}
        >
          <div className="wrap flex h-20 shrink-0 items-center justify-between">
            <p className="type-label text-mist" aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
            <button type="button" onClick={close} className="flex min-h-11 items-center gap-3 type-nav hover:text-champagne">
              Close <X className="size-5" strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.figure
                key={name}
                custom={direction}
                className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-4 md:px-24"
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease: cinema } }}
                exit={{ opacity: 0, x: direction * -80, transition: { duration: 0.5, ease: cinema } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
              >
                <img
                  src={`${BASE}photos/${name}-${photo.widths[photo.widths.length - 1]}.webp`}
                  srcSet={photo.widths.map((w) => `${BASE}photos/${name}-${w}.webp ${w}w`).join(', ')}
                  sizes="90vw"
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  draggable={false}
                  className="max-h-[calc(100%-3.5rem)] w-auto max-w-full select-none object-contain"
                />
                <figcaption className="mt-5 max-w-[40rem] text-center type-caption text-mist">{photo.alt}</figcaption>
              </motion.figure>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full ring-1 ring-ivory/30 transition-colors hover:bg-ivory hover:text-evergreen md:left-8 md:flex"
            >
              <ArrowLeft className="size-5" strokeWidth={1.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full ring-1 ring-ivory/30 transition-colors hover:bg-ivory hover:text-evergreen md:right-8 md:flex"
            >
              <ArrowRight className="size-5" strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
