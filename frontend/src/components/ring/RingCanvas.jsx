import { useEffect, useRef } from 'react';
import { useMotionValueEvent } from 'motion/react';
import RingRenderer from './RingRenderer';
import { asset } from '../../utils/asset';

// The canvas for the engagement ring. `pose` is a motion value 0..1 (from the scroll); every change redraws
// one frame. Loaded lazily (three.js is only fetched on the page that shows the ring).
// If WebGL is unavailable, it simply renders nothing.
//
// Drag to turn it any way you like (mouse: any direction; touch: sideways, so an up/down swipe still scrolls
// the page). Your turn stays while you look; once you scroll on, it eases back into the scroll pose so the
// story still lands front-facing on the last line. onInteract fires on the first drag (hides the hint).
const RESUME_AFTER = 0.04; // how much scroll (pose) after a drag before the ring eases back

export default function RingCanvas({ pose, onInteract, className = '' }) {
  const canvas = useRef(null);
  const ring = useRef(null);
  const drag = useRef(null);
  const turnedAt = useRef(null); // the pose when the visitor last let go, while their turn is showing

  useEffect(() => {
    let r;
    try {
      r = new RingRenderer(canvas.current);
    } catch {
      return undefined; // no WebGL: leave the space empty
    }
    ring.current = r;
    if (import.meta.env.DEV) window.__ring = r; // dev only: inspect frames from the console
    const box = canvas.current.parentElement;
    const ro = new ResizeObserver(([entry]) => r.resize(entry.contentRect.width, entry.contentRect.height));
    ro.observe(box);
    r.setPose(pose.get());
    r.load({ model: asset('ring/solitaire-ring.glb'), hdr: asset('ring/pretoria_gardens_1k.hdr'), draco: asset('ring/draco/') })
      .then(() => {
        const { width, height } = box.getBoundingClientRect();
        r.resize(width, height);
        r.setPose(pose.get());
      })
      .catch(() => {});
    return () => {
      ro.disconnect();
      r.dispose();
      ring.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useMotionValueEvent(pose, 'change', (v) => {
    ring.current?.setPose(v);
    if (turnedAt.current !== null && !drag.current && Math.abs(v - turnedAt.current) > RESUME_AFTER) {
      turnedAt.current = null;
      ring.current?.settle();
    }
  });

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, touch: e.pointerType !== 'mouse' };
    e.currentTarget.setPointerCapture(e.pointerId);
    onInteract?.();
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = d.touch ? 0 : e.clientY - d.y; // touch: sideways only, vertical swipes scroll the page
    d.x = e.clientX;
    d.y = e.clientY;
    ring.current?.rotateBy(dx, dy);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    turnedAt.current = pose.get();
  };

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`block size-full cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`}
    />
  );
}
