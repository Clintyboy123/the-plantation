import { useState } from 'react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import { signIn } from '../../services/admin';

export default function SignIn({ onSignedIn }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setMessage('');
    setErrors({});
    try {
      onSignedIn(await signIn(values.email.trim(), values.password));
    } catch (error) {
      setErrors(error.fields || {});
      setMessage(error.message);
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-[26rem]">
      <p className="type-label text-forest">Admin</p>
      <h1 className="mt-5 type-h2">Sign in</h1>
      <p className="mt-5 type-body text-stone">Update the wedding specials on your website.</p>

      <form onSubmit={submit} noValidate className="mt-10 space-y-8">
        {message && (
          <p role="alert" className="border-l-2 border-danger py-1 pl-4 type-body text-charcoal">
            {message}
          </p>
        )}
        <Input id="email" type="email" label="Email" required autoComplete="username" value={values.email} onChange={set('email')} error={errors.email} />
        <Input id="password" type="password" label="Password" required autoComplete="current-password" value={values.password} onChange={set('password')} error={errors.password} />
        <Button type="submit" loading={sending} className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
