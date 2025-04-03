const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev
  ? 'https://f6db-71-238-155-26.ngrok-free.app'
  : 'https://prod-api.com';