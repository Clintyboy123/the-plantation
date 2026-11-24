import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Checkbox, Input, Textarea } from '../../components/ui/Field';
import useFocusTrap from '../../hooks/useFocusTrap';
import { createSpecial, deleteSpecial, updateSpecial } from '../../services/admin';
import { ease } from '../../utils/motion';
import { altOf, categories, library, thumb } from './photoLibrary';

const BODY_MAX = 600;

const blank = { kicker: '', name: '', body: '', note: '', photo: '', isPublished: true, availableUntil: '' };

// Add or edit one special. A panel from the right on larger screens, full screen on a phone.
export default function SpecialEditor({ special, onClose, onSaved, onDeleted, onSignedOut }) {
  const isNew = !special.id;
  const [values, setValues] = useState(() => ({ ...blank, ...special, note: special.note || '', availableUntil: special.availableUntil || '' }));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const panel = useRef(null);
  useFocusTrap(true, panel, onClose);

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const fail = (error) => {
    if (error.status === 401) return onSignedOut();
    setErrors(error.fields || {});
    setMessage(error.message);
    return panel.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event) => {
    event.preventDefault();
    const missing = {};
    if (!values.kicker.trim()) missing.kicker = 'Enter a short label';
    if (!values.name.trim()) missing.name = 'Enter a name';
    if (!values.body.trim()) missing.body = 'Enter a description';
    if (!values.photo) missing.photo = 'Choose a photo';
    if (Object.keys(missing).length) return fail({ message: 'Please check the highlighted fields.', fields: missing });

    setSaving(true);
    setMessage('');
    const payload = {
      kicker: values.kicker.trim(),
      name: values.name.trim(),
      body: values.body.trim(),
      note: values.note.trim() || null,
      photo: values.photo,
      isPublished: values.isPublished,
      availableUntil: values.availableUntil || null,
    };
    try {
      onSaved(isNew ? await createSpecial(payload) : await updateSpecial(special.id, payload), isNew);
    } catch (error) {
      fail(error);
      setSaving(false);
    }
    return undefined;
  };

  const remove = async () => {
    setSaving(true);
    try {
      await deleteSpecial(special.id);
      onDeleted(special);
    } catch (error) {
      fail(error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        className="absolute inset-0 bg-evergreen/50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, ease } }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
        className="absolute inset-y-0 right-0 w-full overflow-y-auto overscroll-contain bg-ivory shadow-2xl md:max-w-[40rem]"
        initial={{ x: '100%' }}
        animate={{ x: 0, transition: { duration: 0.9, ease } }}
        exit={{ x: '100%', transition: { duration: 0.6, ease } }}
      >
        <form onSubmit={save} noValidate className="px-6 pb-16 pt-6 md:px-12 md:pt-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="type-label text-forest">{isNew ? 'New special' : 'Edit special'}</p>
              <h2 id="editor-title" className="mt-4 type-h3">{isNew ? 'Add a special' : special.name}</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Close without saving" className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-700 ease-site hover:bg-charcoal/10">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {message && (
            <p role="alert" className="mt-8 border-l-2 border-danger py-1 pl-4 type-body">
              {message}
            </p>
          )}

          <div className="mt-10 space-y-8">
            <Input id="kicker" label="Label" required maxLength={40} hint="A word or two above the name, e.g. Summer or All-in." value={values.kicker} onChange={set('kicker')} error={errors.kicker} />
            <Input id="name" label="Name" required maxLength={120} value={values.name} onChange={set('name')} error={errors.name} />
            <Textarea
              id="body"
              label="Description"
              required
              rows={5}
              maxLength={BODY_MAX}
              hint={`${values.body.length} of ${BODY_MAX} characters. What's included, and who it's for.`}
              value={values.body}
              onChange={set('body')}
              error={errors.body}
            />
            <Input id="note" label="Small print" maxLength={200} hint="Shown under the description, e.g. Available May to August 2027." value={values.note} onChange={set('note')} error={errors.note} />

            <PhotoPicker value={values.photo} onChange={(photo) => { setValues((v) => ({ ...v, photo })); setErrors((e) => ({ ...e, photo: undefined })); }} error={errors.photo} />

            <div className="border-t border-charcoal/15 pt-8">
              <Checkbox id="isPublished" label="Show on the website" checked={values.isPublished} onChange={set('isPublished')} />
              <Input
                id="availableUntil"
                type="date"
                label="Show until"
                className="mt-6"
                hint="The special hides itself after this day. Leave empty to show it until you hide it."
                value={values.availableUntil}
                onChange={set('availableUntil')}
                error={errors.availableUntil}
              />
            </div>
          </div>

          <div className="mt-12 flex flex-col-reverse items-center gap-4 border-t border-charcoal/15 pt-8 sm:flex-row sm:justify-between">
            {!isNew ? (
              <button type="button" onClick={() => setConfirming(true)} className="min-h-11 type-nav text-danger underline-offset-4 hover:underline">
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
              <Button type="button" variant="outline" icon={false} onClick={onClose}>Cancel</Button>
              <Button type="submit" loading={saving}>{isNew ? 'Add special' : 'Save changes'}</Button>
            </div>
          </div>

          <AnimatePresence>
            {confirming && (
              <motion.div
                role="alertdialog"
                aria-labelledby="confirm-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.5, ease } }}
                className="mt-8 bg-ivory-deep p-6 text-center sm:text-left"
              >
                <p id="confirm-title" className="type-h4">Delete {special.name}?</p>
                <p className="mt-3 type-body text-stone">This can't be undone. To keep it for later, untick "Show on the website" instead.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button type="button" icon={false} loading={saving} onClick={remove} className="!bg-danger">Yes, delete it</Button>
                  <Button type="button" variant="outline" icon={false} onClick={() => setConfirming(false)}>Keep it</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}

function PhotoPicker({ value, onChange, error }) {
  const startCategory = library.find((p) => p.name === value)?.category || 'weddings';
  const [category, setCategory] = useState(startCategory);
  const [open, setOpen] = useState(!value);
  const shown = useMemo(() => library.filter((p) => p.category === category), [category]);

  return (
    <fieldset className="text-left">
      <legend className="type-label text-stone">Photo <span aria-hidden="true">*</span></legend>
      <div className="mt-4 flex items-center gap-5">
        {value ? (
          <img src={thumb(value)} alt={altOf(value)} className="aspect-[4/5] w-24 bg-sage-light object-cover" />
        ) : (
          <span className="flex aspect-[4/5] w-24 items-center justify-center bg-sage-light type-caption text-stone">None</span>
        )}
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="min-h-11 type-nav text-forest underline-offset-4 hover:underline">
          {open ? 'Close photos' : value ? 'Change photo' : 'Choose a photo'}
        </button>
      </div>
      {error && <p className="mt-2 type-caption text-danger">{error}</p>}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.9, ease } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.6, ease } }}
            className="overflow-hidden"
          >
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Photo categories">
              {categories.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  aria-pressed={category === key}
                  className={`min-h-9 rounded-full px-4 type-caption ring-1 ring-inset transition-colors duration-700 ease-site ${
                    category === key ? 'bg-forest text-ivory ring-forest' : 'text-charcoal ring-charcoal/20 hover:ring-charcoal/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-5 grid max-h-[26rem] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
              {shown.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    onChange(p.name);
                    setOpen(false);
                  }}
                  aria-pressed={value === p.name}
                  aria-label={p.alt}
                  title={p.alt}
                  className={`relative aspect-[4/5] overflow-hidden bg-sage-light outline-offset-2 ${value === p.name ? 'outline-2 outline-forest' : ''}`}
                >
                  <img src={thumb(p.name)} alt="" loading="lazy" className="size-full object-cover transition-transform duration-1000 ease-site hover:scale-105" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
