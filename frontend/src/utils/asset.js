// Where the site is served from. "/" on the VPS; "/the-plantation/" for the GitHub Pages preview.
// Vite fills this in from `base` in vite.config.js, so files in public/ resolve on both hosts.
export const BASE = import.meta.env.BASE_URL;

// A file in public/, e.g. asset('/music/track.m4a') → '/the-plantation/music/track.m4a' on Pages.
export const asset = (path) => BASE + path.replace(/^\//, '');

// True only in the GitHub Pages preview build, which has no backend behind it.
export const IS_PREVIEW = import.meta.env.VITE_PREVIEW === 'true';
