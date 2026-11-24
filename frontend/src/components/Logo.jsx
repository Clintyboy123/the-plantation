import { asset } from '../utils/asset';

// The Plantation's script wordmark, drawn as a mask so it takes the colour of the text around it
// (ivory over photographs, forest green on ivory) from one source file.
export default function Logo({ className = 'w-40' }) {
  return (
    <span
      role="img"
      aria-label="The Plantation"
      className={`block aspect-[730/115] bg-current ${className}`}
      style={{
        WebkitMask: `url(${asset('brand/logo-script.png')}) center / contain no-repeat`,
        mask: `url(${asset('brand/logo-script.png')}) center / contain no-repeat`,
      }}
    />
  );
}
