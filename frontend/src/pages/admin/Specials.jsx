import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { listSpecials, reorderSpecials, updateSpecial } from '../../services/admin';
import { ease } from '../../utils/motion';
import { thumb } from './photoLibrary';
import SpecialEditor from './SpecialEditor';

const todayInSA = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date());
const longDate = (iso) => new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

// What a visitor sees for this special right now.
export const statusOf = (special) => {
  if (!special.isPublished) return { label: 'Hidden', tone: 'text-stone', dot: 'bg-stone/60' };
  if (special.availableUntil && special.availableUntil < todayInSA()) return { label: 'Expired', tone: 'text-danger', dot: 'bg-danger' };
  return { label: 'Live', tone: 'text-forest', dot: 'bg-forest' };
};

export default function Specials({ onSignedOut }) {
  const [specials, setSpecials] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // a special, {} for a new one, or null
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const handle = useCallback(
    (err) => {
      if (err.status === 401) onSignedOut();
      else setError(err.message);
    },
    [onSignedOut]
  );

  const load = useCallback(() => {
    setError('');
    return listSpecials().then(setSpecials).catch(handle);
  }, [handle]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const move = async (index, by) => {
    const next = [...specials];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    setSpecials(next);
    setBusy(true);
    try {
      setSpecials(await reorderSpecials(next.map((s) => s.id)));
      setNotice('Order saved.');
    } catch (err) {
      handle(err);
      load();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (special) => {
    setBusy(true);
    try {
      const saved = await updateSpecial(special.id, { isPublished: !special.isPublished });
      setSpecials((list) => list.map((s) => (s.id === saved.id ? saved : s)));
      setNotice(saved.isPublished ? `${saved.name} is showing on the website.` : `${saved.name} is hidden from the website.`);
    } catch (err) {
      handle(err);
    } finally {
      setBusy(false);
    }
  };

  const onSaved = (saved, wasNew) => {
    setSpecials((list) => (wasNew ? [...list, saved] : list.map((s) => (s.id === saved.id ? saved : s))));
    setEditing(null);
    setNotice(wasNew ? `${saved.name} added.` : `${saved.name} saved.`);
  };

  const onDeleted = (special) => {
    setSpecials((list) => list.filter((s) => s.id !== special.id));
    setEditing(null);
    setNotice(`${special.name} deleted.`);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div className="max-w-[38rem]">
          <p className="type-label text-forest">Weddings page</p>
          <h1 className="mt-5 type-h2">Specials &amp; packages</h1>
          <p className="mt-5 type-body-l text-stone">
            What couples see on your Weddings page, in this order. Changes go live as soon as you save.
          </p>
        </div>
        <Button onClick={() => setEditing({})} icon={false}>
          <Plus className="mr-2 inline size-4 align-[-3px]" aria-hidden="true" />
          Add a special
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-10 border-l-2 border-danger py-1 pl-4 type-body">
          {error}{' '}
          <button type="button" onClick={load} className="underline underline-offset-4">Try again</button>
        </p>
      )}

      <div className="mt-12 md:mt-16">
        {specials === null && !error && <p className="type-caption text-stone" role="status">Loading specials…</p>}
        {specials?.length === 0 && (
          <p className="border-y border-charcoal/15 py-12 text-center type-body-l text-stone">
            No specials yet. The Weddings page invites couples to ask about current offers until you add one.
          </p>
        )}
        {specials?.length > 0 && (
          <ol className="border-t border-charcoal/15">
            <AnimatePresence initial={false}>
              {specials.map((special, index) => (
                <motion.li
                  key={special.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.8, ease } }}
                  exit={{ opacity: 0, transition: { duration: 0.5, ease } }}
                  transition={{ layout: { duration: 0.8, ease } }}
                  className="border-b border-charcoal/15"
                >
                  <Row
                    special={special}
                    first={index === 0}
                    last={index === specials.length - 1}
                    busy={busy}
                    onUp={() => move(index, -1)}
                    onDown={() => move(index, 1)}
                    onToggle={() => toggle(special)}
                    onEdit={() => setEditing(special)}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <SpecialEditor
            key={editing.id ?? 'new'}
            special={editing}
            onClose={() => setEditing(null)}
            onSaved={onSaved}
            onDeleted={onDeleted}
            onSignedOut={onSignedOut}
          />
        )}
      </AnimatePresence>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
        <AnimatePresence>
          {notice && (
            <motion.p
              key={notice}
              role="status"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease } }}
              exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
              className="rounded-full bg-evergreen px-6 py-3 type-caption text-ivory shadow-lg"
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

const iconButton =
  'flex size-11 items-center justify-center rounded-full text-charcoal ring-1 ring-inset ring-charcoal/20 transition-colors duration-700 ease-site hover:bg-forest hover:text-ivory hover:ring-forest disabled:pointer-events-none disabled:opacity-30';

function Row({ special, first, last, busy, onUp, onDown, onToggle, onEdit }) {
  const status = statusOf(special);
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center md:flex-row md:gap-8 md:py-6 md:text-left">
      <img src={thumb(special.photo)} alt="" className="aspect-[4/5] w-24 shrink-0 bg-sage-light object-cover md:w-20" />
      <div className="min-w-0 flex-1">
        <p className="type-label text-stone">{special.kicker}</p>
        <h2 className="mt-2 type-h4">{special.name}</h2>
        <p className={`mt-3 inline-flex items-center gap-2 type-caption ${status.tone}`}>
          <span className={`size-2 rounded-full ${status.dot}`} aria-hidden="true" />
          {status.label}
          {special.availableUntil && status.label !== 'Hidden' && (
            <span className="text-stone">
              {status.label === 'Expired' ? ` since ${longDate(special.availableUntil)}` : ` until ${longDate(special.availableUntil)}`}
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={iconButton} onClick={onUp} disabled={first || busy} aria-label={`Move ${special.name} up`}>
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
        <button type="button" className={iconButton} onClick={onDown} disabled={last || busy} aria-label={`Move ${special.name} down`}>
          <ArrowDown className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={iconButton}
          onClick={onToggle}
          disabled={busy}
          aria-label={special.isPublished ? `Hide ${special.name} from the website` : `Show ${special.name} on the website`}
          title={special.isPublished ? 'Hide from the website' : 'Show on the website'}
        >
          {special.isPublished ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
        <button type="button" onClick={onEdit} className={`${iconButton} w-auto gap-2 px-5 type-nav`}>
          <Pencil className="size-4" aria-hidden="true" /> Edit
        </button>
      </div>
    </div>
  );
}
