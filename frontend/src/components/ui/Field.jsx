import { ChevronDown, Check } from 'lucide-react';

// Form controls. Quiet underlined fields in the editorial voice; text stays left-aligned at every
// width so long answers read naturally. Errors sit under the field and are linked for screen readers.
const control =
  'peer block min-h-12 w-full appearance-none rounded-none border-0 border-b bg-transparent px-0 pb-2 pt-1 text-[1rem] leading-normal transition-colors duration-300 ease-site placeholder:opacity-45 focus:outline-none focus-visible:outline-none';

const toneClasses = {
  light: 'border-charcoal/30 text-charcoal hover:border-charcoal/60 focus:border-forest',
  dark: 'border-ivory/30 text-ivory hover:border-ivory/60 focus:border-champagne [color-scheme:dark]',
};

export function Field({ id, label, error, hint, required, tone = 'light', className = '', children }) {
  return (
    <div className={`text-left ${className}`}>
      <label htmlFor={id} className={`type-label ${tone === 'dark' ? 'text-mist' : 'text-stone'}`}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className="ml-2 normal-case tracking-normal opacity-70">(optional)</span>}
      </label>
      <div className="relative mt-2">{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className={`mt-2 type-caption ${tone === 'dark' ? 'text-mist' : 'text-stone'}`}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={`mt-2 type-caption ${tone === 'dark' ? 'text-champagne' : 'text-danger'}`}>
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export function Input({ id, label, error, hint, required, tone = 'light', className, ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} tone={tone} className={className}>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} ${toneClasses[tone]} ${error ? (tone === 'dark' ? '!border-champagne' : '!border-danger') : ''}`}
        {...props}
      />
    </Field>
  );
}

export function Textarea({ id, label, error, hint, required, tone = 'light', className, ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} tone={tone} className={className}>
      <textarea
        id={id}
        name={id}
        rows={4}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} ${toneClasses[tone]} resize-y ${error ? (tone === 'dark' ? '!border-champagne' : '!border-danger') : ''}`}
        {...props}
      />
    </Field>
  );
}

export function Select({ id, label, error, hint, required, tone = 'light', options, placeholder = 'Choose…', className, ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} tone={tone} className={className}>
      <select
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} ${toneClasses[tone]} cursor-pointer pr-8 ${error ? (tone === 'dark' ? '!border-champagne' : '!border-danger') : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 opacity-60" strokeWidth={1.5} aria-hidden="true" />
    </Field>
  );
}

export function Checkbox({ id, label, tone = 'light', checked, onChange, className = '' }) {
  return (
    <label htmlFor={id} className={`group flex min-h-11 cursor-pointer items-center gap-4 text-left ${className}`}>
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <input id={id} name={id} type="checkbox" checked={checked} onChange={onChange} className="peer absolute inset-0 cursor-pointer opacity-0" />
        <span
          aria-hidden="true"
          className={`size-5 ring-1 ring-inset transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${
            tone === 'dark'
              ? 'ring-ivory/50 peer-checked:bg-champagne peer-checked:ring-champagne peer-focus-visible:outline-champagne'
              : 'ring-charcoal/40 peer-checked:bg-forest peer-checked:ring-forest peer-focus-visible:outline-forest'
          }`}
        />
        <Check
          className={`pointer-events-none absolute size-3.5 opacity-0 transition-opacity peer-checked:opacity-100 ${tone === 'dark' ? 'text-evergreen' : 'text-ivory'}`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
      <span className="type-body">{label}</span>
    </label>
  );
}
