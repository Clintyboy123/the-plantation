import api from './api';
import { packages } from '../content/weddings';
import { IS_PREVIEW } from '../utils/asset';

// The wedding specials the venue manages in /admin. The GitHub Pages preview has no API, so it shows the
// specials as they were when the site was built; if the API can't be reached, the same list stands in.
export const fetchSpecials = () =>
  IS_PREVIEW ? Promise.resolve(packages) : api.get('/specials').then((r) => r.data.data).catch(() => packages);

// The open answers the wedding form always offers after the specials.
export const extraPackageChoices = ['A custom package', 'Not sure yet'];
