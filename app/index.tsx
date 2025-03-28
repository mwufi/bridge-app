import React, { useState, useEffect } from 'react';
import { Storage } from '@/utils/storage';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import GenZChatScreen from '@/components/genz_chat/ChatScreen';

export default function App() {
    const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        const complete = await Storage.isOnboardingComplete();
        setIsOnboardingComplete(complete);
    };

    const handleOnboardingComplete = () => {
        setIsOnboardingComplete(true);
    };

    if (isOnboardingComplete === null) {
        return null; // Or a loading screen
    }

    return isOnboardingComplete ? (
        <GenZChatScreen />
    ) : (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
    );
} 