const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev
  ? 'http://192.168.0.235:8000'
  : 'https://prod-api.com';