import axios from 'axios';

// The one Axios instance for the whole site. Relative URL: the browser calls the site's own
// domain and Nginx forwards /api/* to the backend, so there is no CORS and no hardcoded address.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Turn every failure into the same shape, so pages can always show error.message
// and forms can read error.fields[fieldName].
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const normalised = new Error(
      data?.message ||
        (error.response ? 'Something went wrong. Please try again.' : 'Could not reach the server. Check your connection and try again.')
    );
    normalised.status = error.response?.status ?? 0;
    normalised.fields = Object.fromEntries((data?.errors || []).map((e) => [e.field, e.message]));
    return Promise.reject(normalised);
  }
);

export default api;
