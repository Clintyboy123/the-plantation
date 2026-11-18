// Brand marks redrawn as fine line icons, so they sit with the rest of the site's iconography
// (Lucide, 1.5 stroke, round joins) instead of four mismatched logos. 24-unit grid, currentColor.
const PATHS = {
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.15" cy="6.85" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.6-1.5h1.6V4.6a20 20 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v1.9H8.6v3h2.7V21" />,
  Pinterest: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.4 20.2 12 13.5" />
      <path d="M11.2 15.4c.5.6 1.3.9 2.2.9 2.3 0 3.8-2 3.8-4.6 0-2.7-2.3-4.6-5.1-4.6-3.1 0-5 2.1-5 4.5 0 1.1.4 2.1 1.2 2.6" />
    </>
  ),
  X: (
    <>
      <path d="M4.5 4.5h4.2l10.8 15h-4.2z" />
      <path d="M19 4.5l-5.9 6.6M5 19.5l5.9-6.6" />
    </>
  ),
};

export default function SocialIcon({ name, className = 'size-[18px]' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
