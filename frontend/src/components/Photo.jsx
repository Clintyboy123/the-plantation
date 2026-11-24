import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import photos from '../content/photos.json';
import { floatIn, viewportOnce } from '../utils/motion';
import { BASE } from '../utils/asset';
import { useFrameTone } from './Frame';

// Every photograph on the site goes through here: responsive WebP sizes, a blurred placeholder while
// loading, the art-directed focal point, and (optionally) a wipe reveal and/or scroll parallax.
//   <Photo name="chapel-aisle" sizes="50vw" className="aspect-[4/5]" reveal="bottom" parallax={8} />
// The wrapper sets the box (give it an aspect ratio or a height); the image always covers it.
// Framing: inside a <FrameTone> every Photo is framed and rounded in that tone (see Frame.jsx).
//   frame="gold" forces a tone, frame={false} = full-bleed (no frame, square), frameSize="sm" for thumbnails.
export default function Photo({
  name,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  alt,
  position,
  priority = false,
  reveal,
  parallax = 0,
  hover = false,
  frame,
  frameSize = 'md',
}) {
  const contextTone = useFrameTone();
  const tone = frame === false ? null : frame || contextTone;
  const photo = photos[name];
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);

  if (!photo) {
    if (import.meta.env.DEV) console.warn(`Photo "${name}" is not in photos.json`);
    return null;
  }

  const srcSet = photo.widths.map((w) => `${BASE}photos/${name}-${w}.webp ${w}w`).join(', ');
  const src = `${BASE}photos/${name}-${photo.widths[Math.min(1, photo.widths.length - 1)]}.webp`;
  // Framed photos float in from blur as they scroll into view (reveal={false} opts out)
  const useReveal = !reduce && (reveal === true || typeof reveal === 'string' || (tone && reveal !== false));
  const useParallax = parallax && !reduce;

  return (
    // Outer frame: sized by the caller and watched for entering the viewport (never clipped itself,
    // so it can always be observed). The inner layer carries the wipe and the placeholder.
    <motion.div
      ref={ref}
      className={`${/(^|\s)!?(absolute|fixed|sticky)/.test(className) ? '' : 'relative'} ${tone ? 'frame' : 'overflow-hidden'} ${className}`}
      data-tone={tone || undefined}
      data-size={tone ? frameSize : undefined}
      variants={useReveal ? floatIn() : undefined}
      initial={useReveal ? 'hidden' : undefined}
      whileInView={useReveal ? 'visible' : undefined}
      viewport={viewportOnce}
    >
      <motion.div
        className={`${tone ? 'frame-inner' : 'absolute inset-0 overflow-hidden'} bg-cover bg-center`}
        style={{ backgroundImage: `url(${photo.blur})` }}
      >
        <motion.div className="absolute inset-0">
          <motion.img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            width={photo.width}
            height={photo.height}
            alt={alt ?? photo.alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            onLoad={() => setLoaded(true)}
            style={{
              objectPosition: position || photo.focus || '50% 50%',
              y: useParallax ? y : 0,
              scale: useParallax ? 1 + (parallax * 2.2) / 100 : 1,
            }}
            className={`photo-img absolute inset-0 size-full object-cover transition-[opacity,scale] duration-1000 ease-site ${
              loaded ? 'opacity-100' : 'opacity-0'
            } ${hover ? 'group-hover:scale-[1.045]' : ''} ${imgClassName}`}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const photoAlt = (name) => photos[name]?.alt ?? '';
export const allPhotos = photos;
