
import Constants from 'expo-constants';

const isDev = process.env.NODE_ENV === 'development';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Constants.expoConfig?.extra?.apiUrl as string) || 
  (isDev ? 'https://f6db-71-238-155-26.ngrok-free.app' : 'https://prod-api.com');