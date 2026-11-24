import api from './api';
import { site } from '../content/site';
import { IS_PREVIEW } from '../utils/asset';

// The GitHub Pages preview has no backend, so say so plainly instead of failing with a network error.
const previewOnly = () => {
  const error = new Error(`This is a preview of the new site, so enquiries aren't sent yet. Please email ${site.email} or call ${site.phone}.`);
  error.status = 0;
  error.fields = {};
  return Promise.reject(error);
};

export const sendEnquiry = (values) => (IS_PREVIEW ? previewOnly() : api.post('/enquiries', values).then((r) => r.data));
