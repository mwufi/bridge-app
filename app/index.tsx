import React, { useState, useEffect } from 'react';
import { Storage } from '@/utils/storage';
import DynamicOnboarding from '@/components/onboarding/DynamicOnboarding';
import GenZChatScreen from '@/components/genz_chat/ChatScreen';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';
import {
    Fredoka_400Regular,
    Fredoka_600SemiBold,
} from '@expo-google-fonts/fredoka';
import {
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import {
    Outfit_400Regular,
    Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';

export default function App() {
    const isDebug = true;
    const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

    const [fontsLoaded] = useFonts({
        Fredoka_400Regular,
        Fredoka_600SemiBold,
        SpaceGrotesk_400Regular,
        SpaceGrotesk_600SemiBold,
        Outfit_400Regular,
        Outfit_600SemiBold,
    });

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        const complete = await Storage.isOnboardingComplete();
        setIsOnboardingComplete(complete);
    };

    const handleOnboardingComplete = async () => {
        await Storage.setOnboardingComplete();
        setIsOnboardingComplete(true);
    };

    if (!fontsLoaded || isOnboardingComplete === null) {
        return <Text>Loading...</Text>;
    }

    if (isDebug) {
        return <DynamicOnboarding onComplete={handleOnboardingComplete} />;
    }

    return isOnboardingComplete ? (
        <GenZChatScreen />
    ) : (
        <DynamicOnboarding onComplete={handleOnboardingComplete} />
    );
}