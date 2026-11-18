import { useEffect } from 'react';

// Keeps keyboard focus inside an open menu or lightbox, makes the page behind it inert,
// closes on Escape and hands focus back to whatever opened it.
// Order matters: remember the opener before making the page inert, and remove inert before refocusing.
export default function useFocusTrap(open, containerRef, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const page = document.getElementById('page-root');
    page?.setAttribute('inert', '');

    const container = containerRef.current;
    const focusables = () =>
      [...(container?.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])') || [])].filter(
        (el) => el.offsetParent !== null
      );
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      page?.removeAttribute('inert');
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [open, containerRef, onClose]);
}
