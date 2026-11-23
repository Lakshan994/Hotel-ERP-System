import api, { dataOf } from './api';
const root = '/customers';
export async function list() { return dataOf(await api.get(root)); }
export async function create(payload) { return dataOf(await api.post(root, payload)); }
export async function update(id, payload) { return dataOf(await api.put(`${root}/${id}`, payload)); }
export async function remove(id) { return (await api.delete(`${root}/${id}`)).data; }
