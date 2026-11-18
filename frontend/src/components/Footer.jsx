import { Link } from 'react-router';
import Logo from './Logo';
import SocialIcon from './SocialIcon';
import { boma, church, nav, navSecondary, site } from '../content/site';

// Night floor of every page: the three venues, how to reach them, and the way back up.
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-night text-ivory">
      <div className="wrap pt-24 pb-10 lg:pt-32">
        <div className="grid-site gap-y-16">
          <div className="col-span-4 flex flex-col items-center text-center md:col-span-12 lg:col-span-4 lg:items-start lg:text-left">
            <Logo className="w-52 text-ivory" />
            <p className="mt-8 max-w-[22rem] type-body text-mist">
              A family-owned forest estate on Sardinia Bay Road, hosting weddings, events and guests since {site.founded}.
            </p>
            <ul className="mt-8 flex gap-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name || s.label} (opens in a new tab)`}
                    className="flex size-11 items-center justify-center rounded-full text-mist ring-1 ring-ivory/20 transition-colors duration-500 ease-site hover:bg-champagne hover:text-evergreen hover:ring-champagne"
                  >
                    <SocialIcon name={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="col-span-4 text-center md:col-span-4 md:text-left lg:col-span-2 lg:col-start-6">
            <h2 className="type-label text-champagne">Explore</h2>
            <ul className="mt-6 space-y-1">
              {[...nav, ...navSecondary].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="inline-flex min-h-9 items-center type-body text-mist transition-colors hover:text-ivory">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="col-span-4 text-center not-italic md:col-span-4 md:text-left lg:col-span-3">
            <h2 className="type-label text-champagne">The Plantation</h2>
            <p className="mt-6 type-body text-mist">
              {site.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </p>
            <p className="mt-5 type-body">
              <a href={site.phoneHref} className="block min-h-9 leading-9 hover:text-champagne">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="block min-h-9 leading-9 hover:text-champagne">{site.email}</a>
            </p>
            <p className="mt-5 type-caption text-mist">
              Office: Mon – Fri 09h00 – 16h00 · Sat 09h00 – 12h00
            </p>
          </address>

          <div className="col-span-4 space-y-10 text-center md:col-span-4 md:text-left lg:col-span-2">
            <div>
              <h2 className="type-label text-champagne">39 on Church</h2>
              <p className="mt-6 type-body text-mist">39 Church Road, Walmer</p>
              <a href={church.phoneHref} className="mt-1 block type-body hover:text-champagne">{church.phone}</a>
            </div>
            <div>
              <h2 className="type-label text-champagne">The Boma</h2>
              <p className="mt-6 type-body text-mist">Next door, Sardinia Bay Road</p>
              <a href={boma.phoneHref} className="mt-1 block type-body hover:text-champagne">{boma.phone}</a>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center gap-4 border-t border-ivory/12 pt-8 type-caption text-mist md:flex-row md:justify-between">
          <p>© {year} The Plantation. All rights reserved.</p>
          <a href="#top" className="inline-flex min-h-11 items-center type-nav transition-colors hover:text-champagne">
            Back to the top
          </a>
        </div>
      </div>
    </footer>
  );
}
