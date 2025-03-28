import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export const Storage = {
    setOnboardingComplete: async () => {
        await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    },

    isOnboardingComplete: async () => {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        return value === 'true';
    }
}; 