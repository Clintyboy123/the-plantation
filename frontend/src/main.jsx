import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { BASE } from './utils/asset';
import './styles/index.css';

// A reload always starts again from the home page, at the top. Only a reload: a link someone shares or
// a search result still opens the page it points to.
const navEntry = performance.getEntriesByType?.('navigation')[0];
if (navEntry?.type === 'reload' && window.location.pathname !== BASE) window.history.replaceState(null, '', BASE);
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={BASE}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
