import { createContext, useContext } from 'react';

// THE FRAME SYSTEM
// Every photograph that sits inside the layout hangs in the same frame: a fine rule in the colour of
// its experience, a small gap of the page background, then the rounded photo. Radii are nested
// (photo radius = frame radius - rule - gap) so the curves run parallel. Full-bleed photos (heroes,
// edge-to-edge backgrounds) are never framed or rounded.
//
// Tones, one per experience (content/frames.js maps experiences to tones):
//   gold (metallic) · forest · sage · champagne · charcoal · evergreen · ivory (for dark sections)
//
//   <FrameTone tone="forest"> ...page... </FrameTone>       sets the default for every Photo inside
//   <Photo ... />                                            framed in the current tone
//   <Photo ... frame={false} />                             full-bleed: no frame, square corners
//   <Frame tone="gold" className="aspect-[4/5]"> ...absolutely positioned children... </Frame>
//                                                            frames a container (e.g. a crossfading viewer)

const ToneContext = createContext(null);

export function FrameTone({ tone, children }) {
  return <ToneContext.Provider value={tone}>{children}</ToneContext.Provider>;
}

export const useFrameTone = () => useContext(ToneContext);

export default function Frame({ tone, size = 'md', as: Tag = 'div', className = '', innerClassName = '', children, ...rest }) {
  const context = useFrameTone();
  const t = tone ?? context ?? 'champagne';
  return (
    <Tag className={`frame ${/(^|\s)!?(absolute|fixed|sticky)/.test(className) ? '' : 'relative'} ${className}`} data-tone={t} data-size={size} {...rest}>
      <div className={`frame-inner ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
