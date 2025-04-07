import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import ProfileScreen from '@/components/profile/ProfileScreen';

export default function ProfileTab() {
  const router = useRouter();

  // Since ProfileScreen expects an onClose prop for modal behavior,
  // we'll provide a no-op function since this is in a tab
  const handleClose = () => {
    // No-op in tab context, but could be used for navigation if needed
    console.log('Profile tab close pressed');
  };

  return (
    <>
      <StatusBar style="light" />
      <ProfileScreen onClose={handleClose} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});