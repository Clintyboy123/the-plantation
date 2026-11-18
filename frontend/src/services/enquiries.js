import api from './api';

export const sendEnquiry = (values) => api.post('/enquiries', values).then((r) => r.data);
