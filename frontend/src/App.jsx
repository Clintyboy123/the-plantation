import { lazy, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { easyEase } from './utils/motion';
import { Route, Routes, useLocation } from 'react-router';
import MainLayout from './layouts/MainLayout';
import { SmoothScroll } from './context/SmoothScroll';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// The home page ships in the main bundle; every other page loads when it is first visited.
const Weddings = lazy(() => import('./pages/Weddings'));
const Corporate = lazy(() => import('./pages/Corporate'));
const Accommodation = lazy(() => import('./pages/Accommodation'));
const Boma = lazy(() => import('./pages/Boma'));
const Church = lazy(() => import('./pages/Church'));
const Cuisine = lazy(() => import('./pages/Cuisine'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Story = lazy(() => import('./pages/Story'));
const Contact = lazy(() => import('./pages/Contact'));
const Enquire = lazy(() => import('./pages/Enquire'));
const Admin = lazy(() => import('./pages/admin/Admin'));

export default function App() {
  const location = useLocation();

  // The admin is a quiet back office: no intro, music, smooth scroll or page transitions.
  if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) {
    return (
      <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: easyEase }}>
        <Suspense fallback={<div className="min-h-dvh bg-ivory" />}>
          <Admin />
        </Suspense>
      </MotionConfig>
    );
  }

  return (
    // reducedMotion="user": visitors who ask their device for less motion get fades without movement.
    <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: easyEase }}>
      <SmoothScroll>
        <MainLayout>
          <Suspense fallback={<div className="min-h-dvh bg-evergreen" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/weddings" element={<Weddings />} />
              <Route path="/corporate" element={<Corporate />} />
              <Route path="/accommodation" element={<Accommodation />} />
              <Route path="/the-boma" element={<Boma />} />
              <Route path="/39-on-church" element={<Church />} />
              <Route path="/cuisine" element={<Cuisine />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/our-story" element={<Story />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/enquire" element={<Enquire />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </SmoothScroll>
    </MotionConfig>
  );
}
