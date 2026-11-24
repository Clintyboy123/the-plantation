import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { Link } from 'react-router';
import Logo from '../../components/Logo';
import { getMe, signOut } from '../../services/admin';
import { IS_PREVIEW } from '../../utils/asset';
import { ease } from '../../utils/motion';
import SignIn from './SignIn';
import Specials from './Specials';

// /admin: where the venue keeps its wedding specials up to date. A quiet back office in the site's own
// colours and type, so it feels like part of The Plantation rather than a bolted-on tool.
export default function Admin() {
  const [admin, setAdmin] = useState(undefined); // undefined = checking, null = signed out

  useEffect(() => {
    if (IS_PREVIEW) return;
    getMe().then(setAdmin).catch(() => setAdmin(null));
  }, []);

  const leave = async () => {
    await signOut().catch(() => {});
    setAdmin(null);
  };

  return (
    <div className="min-h-dvh bg-ivory text-charcoal">
      <title>Admin | The Plantation</title>
      <meta name="robots" content="noindex, nofollow" />

      <header className="bg-evergreen text-ivory">
        <div className="wrap flex min-h-16 items-center justify-between gap-6">
          <Link to="/" aria-label="The Plantation website" className="block">
            <Logo className="w-32 md:w-36" />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/weddings#packages" target="_blank" className="hidden items-center gap-2 type-nav text-mist transition-colors duration-700 ease-site hover:text-ivory sm:flex">
              View site <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            {admin && (
              <button type="button" onClick={leave} className="flex min-h-11 items-center gap-2 type-nav text-mist transition-colors duration-700 ease-site hover:text-ivory">
                Sign out <LogOut className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="wrap py-14 md:py-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={IS_PREVIEW ? 'preview' : admin === undefined ? 'checking' : admin ? 'in' : 'out'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease } }}
          >
            {IS_PREVIEW ? (
              <PreviewNotice />
            ) : admin === undefined ? (
              <p className="type-caption text-stone" role="status">Checking your sign-in…</p>
            ) : admin ? (
              <Specials onSignedOut={() => setAdmin(null)} />
            ) : (
              <SignIn onSignedIn={setAdmin} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function PreviewNotice() {
  return (
    <div className="mx-auto max-w-[34rem] text-center">
      <p className="type-label text-forest">Admin</p>
      <h1 className="mt-5 type-h3">Available on the live site</h1>
      <p className="mt-5 type-body-l text-stone">
        This is a preview of the new website, so there is no admin behind it yet. Once the site is live, this is where you update your wedding specials.
      </p>
    </div>
  );
}
