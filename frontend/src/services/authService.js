import api from './api';
export async function login(email, password) { return (await api.post('/auth/login', { email, password })).data; }
export async function profile() { return (await api.get('/auth/profile')).data.data; }
