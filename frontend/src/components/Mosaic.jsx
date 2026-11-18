import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import Photo, { allPhotos } from './Photo';
import Lightbox from './Lightbox';
import { ease, floatIn } from '../utils/motion';
import { useFrameTone } from './Frame';

// A masonry of photographs that opens into the lightbox. Each photo hangs in the site's shared frame
// (Frame.jsx) in the page's tone: gold on the Gallery and the Weddings album. Columns keep each photo's own
// proportions (nothing is stretched or forced into one crop).
//
// On scroll, each framed photo floats in from blur; neighbouring frames follow one another. Easy Ease.
const frameIn = (column) => floatIn(column * 0.14);
export default function Mosaic({ items, columns = 'columns-2 md:columns-3', className = '', dark = false }) {
  const [index, setIndex] = useState(null);
  const close = useCallback(() => setIndex(null), []);
  const tone = useFrameTone() || 'gold';
  return (
    <>
      <div className={`${columns} gap-[var(--gutter)] ${className}`}>
        {items.map((name, i) => {
          const p = allPhotos[name];
          if (!p) return null;
          const column = i % 3;
          return (
            <motion.button
              key={name}
              type="button"
              onClick={() => setIndex(i)}
              className="group relative mb-[var(--gutter)] block w-full break-inside-avoid text-left"
              variants={frameIn(column)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              aria-label={`Open photo: ${p.alt}`}
            >
              {/* The shared frame (Frame.jsx), in-flow so the photo's own proportions set the height */}
              <span className="frame frame-pad relative block shadow-[0_18px_40px_-26px_rgb(32_45_37/0.45)]" data-tone={tone} data-size="md">
                <span className="frame-inner-flow block">
                  <span className="absolute inset-0 block">
                    <Photo name={name} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" hover className="!absolute inset-0" alt="" frame={false} />
                  </span>
                  <span className="block w-full" style={{ aspectRatio: `${p.width} / ${p.height}` }} aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-500 ease-site group-hover:opacity-100 group-focus-visible:opacity-100 ${
                      dark ? 'bg-gradient-to-t from-night/70 to-transparent' : 'bg-gradient-to-t from-evergreen/60 to-transparent'
                    }`}
                  >
                    <span className="max-w-[80%] type-caption text-ivory">{p.alt}</span>
                    <span className="flex size-10 items-center justify-center rounded-full bg-ivory/90 text-evergreen">
                      <Plus className="size-4" strokeWidth={1.5} />
                    </span>
                  </span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
      <Lightbox items={items} index={index} onClose={close} onIndex={setIndex} />
    </>
  );
}
