import { useEffect } from 'react';
import { useRouter } from 'expo-router';

// This route is now handled as a modal from the tabs/chat.tsx screen
// This file exists just to redirect any direct navigation to /chat/new back to the main chat screen
export default function NewChatRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main chat screen immediately
    router.replace('/chat');
  }, [router]);
  
  return null;
}