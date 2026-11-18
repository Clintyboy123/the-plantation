import { useLocation } from 'react-router';
import { site } from '../content/site';

// Per-page title, description and canonical URL. React 19 moves these into <head>.
export default function Seo({ title, description, image = '/photos/hero-dusk-1600.webp' }) {
  const { pathname } = useLocation();
  const full = title ? `${title} | ${site.name}` : `${site.name} | Weddings, events & forest stays in Gqeberha`;
  const url = `${site.url}${pathname === '/' ? '' : pathname}`;
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${site.url}${image}`} />
    </>
  );
}
