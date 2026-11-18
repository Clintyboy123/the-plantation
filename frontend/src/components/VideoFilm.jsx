import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Play, X } from 'lucide-react';
import useFocusTrap from '../hooks/useFocusTrap';
import { ease } from '../utils/motion';

// The wedding film from the current site (YouTube). Nothing loads from YouTube until a visitor
// chooses to play it: faster pages, and no third-party cookies by default (youtube-nocookie).
const VIDEO_ID = 'M3UUvS2tvQA';

export default function VideoFilm() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(open, panel, close);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group flex min-h-11 items-center gap-5 text-evergreen">
        <span className="relative flex size-16 items-center justify-center rounded-full ring-1 ring-forest/40 transition-colors duration-500 ease-site group-hover:bg-forest group-hover:text-ivory">
          <Play className="ml-0.5 size-4" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="text-left">
          <span className="block type-nav">Watch the film</span>
          <span className="block type-caption text-stone">A wedding at The Plantation</span>
        </span>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label="Wedding film"
              className="on-dark fixed inset-0 z-[60] flex flex-col items-center justify-center bg-night/96 p-4 text-ivory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5, ease } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <button type="button" onClick={close} className="absolute right-[var(--margin)] top-6 flex min-h-11 items-center gap-3 type-nav hover:text-champagne">
                Close <X className="size-5" strokeWidth={1.25} aria-hidden="true" />
              </button>
              <div className="aspect-video w-full max-w-6xl bg-black">
                <iframe
                  className="size-full"
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                  title="A wedding at The Plantation"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
