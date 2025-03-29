import React, { useState, useEffect } from 'react';
import { Storage } from '@/utils/storage';
import DynamicOnboarding from '@/components/onboarding/DynamicOnboarding';
import GenZChatScreen from '@/components/genz_chat/ChatScreen';
import { Text } from 'react-native';

export default function App() {
    const isDebug = true;
    const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        const complete = await Storage.isOnboardingComplete();
        setIsOnboardingComplete(complete);
    };

    const handleOnboardingComplete = async () => {
        await Storage.setOnboardingComplete(true); // Persist the completion
        setIsOnboardingComplete(true);
    };

    if (isOnboardingComplete === null) {
        return <Text>Loading...</Text>; // Simple loading state
    }

    if (isDebug) {
        return <DynamicOnboarding onComplete={handleOnboardingComplete} />
    }

    return isOnboardingComplete ? (
        <GenZChatScreen />
    ) : (
        <DynamicOnboarding onComplete={handleOnboardingComplete} />
    );
}