import Seo from '../components/Seo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/Eyebrow';

export default function NotFound() {
  return (
    <section className="wrap flex min-h-dvh flex-col items-center justify-center pt-24 text-center">
      <Seo title="Page not found" description="This page could not be found." />
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-6 type-h1 text-evergreen">
        This path leads
        <br />
        <em>into the trees.</em>
      </h1>
      <p className="mt-8 max-w-[28rem] type-body-l text-stone">The page you were looking for has moved or no longer exists.</p>
      <div className="mt-10">
        <Button to="/">Back to the estate</Button>
      </div>
    </section>
  );
}
