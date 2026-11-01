import axios from 'axios';

let accessToken = null;
let refreshPromise = null;
export const api = axios.create({ baseURL: '/api', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
export function setAccessToken(token) { accessToken = token; }
export function clearAccessToken() { accessToken = null; }

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use((response) => response, async (error) => {
  const original = error.config;
  const isAuthRequest = original?.url?.includes('/auth/refresh') || original?.url?.includes('/auth/login') || original?.url?.includes('/auth/register');
  if (error.response?.status !== 401 || original?._retry || isAuthRequest) return Promise.reject(error);
  original._retry = true;
  refreshPromise ||= api.post('/auth/refresh').then(({ data }) => {
    accessToken = data.data.accessToken;
    return accessToken;
  }).finally(() => { refreshPromise = null; });
  try {
    await refreshPromise;
    return api(original);
  } catch (refreshError) {
    accessToken = null;
    return Promise.reject(refreshError);
  }
});
