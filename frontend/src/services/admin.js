import api from './api';

// Admin calls. The session is an httpOnly cookie the browser sends by itself; nothing is stored in the page.
const data = (r) => r.data.data;

export const getMe = () => api.get('/auth/me').then(data);
export const signIn = (email, password) => api.post('/auth/login', { email, password }).then(data);
export const signOut = () => api.post('/auth/logout');

export const listSpecials = () => api.get('/admin/specials').then(data);
export const createSpecial = (values) => api.post('/admin/specials', values).then(data);
export const updateSpecial = (id, values) => api.put(`/admin/specials/${id}`, values).then(data);
export const deleteSpecial = (id) => api.delete(`/admin/specials/${id}`);
export const reorderSpecials = (ids) => api.put('/admin/specials/order', { ids }).then(data);
