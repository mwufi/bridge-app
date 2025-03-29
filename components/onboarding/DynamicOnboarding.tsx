import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Pressable, Modal } from 'react-native';
import PhoneIdScreen from './PhoneId';

interface OnboardingScreenProps {
    onComplete: () => void;
}

interface WelcomeScreenProps {
    title: string;
    description: string;
    onNext: () => void;
}

interface FeaturesScreenProps {
    items: string[];
    onNext: () => void;
}

interface SignupScreenProps {
    buttonText: string;
    onComplete: () => void;
}

const WelcomeScreen = ({ title, description, onNext }: WelcomeScreenProps) => (
    <View style={styles.screen}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Button title="Next" onPress={onNext} />
    </View>
);

const FeaturesScreen = ({ items, onNext }: FeaturesScreenProps) => (
    <View style={styles.screen}>
        <Text style={styles.title}>Features</Text>
        {items.map((item, index) => (
            <Text key={index} style={styles.description}>{item}</Text>
        ))}
        <Button title="Next" onPress={onNext} />
    </View>
);

const SignupScreen = ({ buttonText, onComplete }: SignupScreenProps) => (
    <View style={styles.screen}>
        <Text style={styles.title}>Get Started</Text>
        <Button title={buttonText} onPress={onComplete} />
    </View>
);

type OnboardingStep =
    | { id: number; type: 'phoneId'; tagline: string; picture: string }
    | { id: number; type: 'welcome'; title: string; description: string }
    | { id: number; type: 'features'; items: string[] }
    | { id: number; type: 'signup'; buttonText: string };

const getOnboardingData = async (): Promise<OnboardingStep[]> => {
    const data: OnboardingStep[] = [
        { id: 1, type: 'phoneId', tagline: 'better ai, better life', picture: require('../../assets/images/onboarding-1.png') },
        { id: 2, type: 'phoneId', tagline: 'seondary', picture: require('../../assets/images/onboarding-3.png') },
        {
            id: 3,
            type: 'welcome',
            title: 'Welcome!',
            description: "Let's get started."
        },
        {
            id: 4,
            type: 'features',
            items: ['Feature 1', 'Feature 2', 'Feature 3']
        },
        {
            id: 5,
            type: 'signup',
            buttonText: 'Sign Up Now'
        }
    ];
    return data;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [onboardingData, setOnboardingData] = useState<OnboardingStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

    useEffect(() => {
        const fetchOnboardingData = async () => {
            try {
                const data = await getOnboardingData();
                setOnboardingData(data);
            } catch (err) {
                setError('Failed to load onboarding data');
            } finally {
                setLoading(false);
            }
        };
        fetchOnboardingData();
    }, []);

    const handleNext = (phone?: string) => {
        if (phone) {
            setPhoneNumber(phone);
        }
        if (currentStep < onboardingData.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const renderScreen = (screenConfig: OnboardingStep) => {
        switch (screenConfig.type) {
            case 'phoneId':
                return <PhoneIdScreen onNext={handleNext} {...screenConfig} />;
            case 'welcome':
                return (
                    <WelcomeScreen
                        title={screenConfig.title}
                        description={screenConfig.description}
                        onNext={() => handleNext()}
                    />
                );
            case 'features':
                return (
                    <FeaturesScreen
                        items={screenConfig.items}
                        onNext={() => handleNext()}
                    />
                );
            case 'signup':
                return (
                    <SignupScreen
                        buttonText={screenConfig.buttonText}
                        onComplete={handleComplete}
                    />
                );
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    if (onboardingData.length === 0) {
        return <Text>No onboarding steps available</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {renderScreen(onboardingData[currentStep])}
            <Text style={styles.stepIndicator}>
                Step {currentStep + 1} of {onboardingData.length}
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    stepIndicator: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
    },
    fullScreen: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: '100%',
        left: 0,
        top: 0,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        paddingTop: '40%',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    },
    tagline: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 8,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 20,
        marginBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    inputLabel: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    },
    phoneInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        overflow: 'hidden',
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRightWidth: 1,
        borderRightColor: '#E5E5E5',
    },
    flag: {
        width: 24,
        height: 16,
        marginRight: 8,
    },
    countryCodeText: {
        fontSize: 16,
    },
    numberInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    termsText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginTop: 16,
        marginBottom: 20,
    },
    termsLink: {
        color: '#000',
        textDecorationLine: 'underline',
    },
    submitButton: {
        backgroundColor: '#1a365d',
        borderRadius: 25,
        padding: 16,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalScroll: {
        maxHeight: '90%',
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#1a365d',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OnboardingScreen;