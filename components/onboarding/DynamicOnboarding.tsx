import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Pressable, Modal } from 'react-native';
import PhoneIdScreen from './screens/PhoneId';
import NameInput from './screens/NameInput';
import BirthdayInput from './screens/BirthdayInput';
import UsernameInput from './screens/UsernameInput';
import InfoScreen from './screens/InfoScreen';
import PersonalitySelect from './screens/PersonalitySelect';

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
    | { id: number; type: 'name'; picture: string }
    | { id: number; type: 'birthday'; picture: string }
    | { id: number; type: 'username'; picture: string }
    | { id: number; type: 'info'; title: string; description: string; buttonLabel?: string; picture: string }
    | { id: number; type: 'personality'; picture: string };

const getOnboardingData = async (): Promise<OnboardingStep[]> => {
    // This could be fetched from an API for A/B testing
    const data: OnboardingStep[] = [
        {
            id: 1,
            type: 'phoneId',
            tagline: 'find your place',
            picture: require('@/assets/images/onboarding-1.png')
        },
        // {
        //     id: 2,
        //     type: 'name',
        //     picture: require('@/assets/images/onboarding-2.png')
        // },
        // {
        //     id: 3,
        //     type: 'birthday',
        //     picture: require('@/assets/images/onboarding-3.png')
        // },
        // {
        //     id: 4,
        //     type: 'username',
        //     picture: require('@/assets/images/onboarding-4.png')
        // },
        {
            id: 5,
            type: 'info',
            title: 'Meet Ara',
            description: 'Ara is a digital companion, a pet you can talk to. Or a super-intelligent AI that helps you get things done.',
            picture: require('@/assets/images/onboarding-5.png')
        },
        {
            id: 6,
            type: 'info',
            title: 'Growing Features',
            description: "Right now Ara doesn't have a lot of features. But we'll be adding more integrations, like email, Google Docs, Calendar, and more.",
            picture: require('@/assets/images/onboarding-6.png')
        },
        {
            id: 7,
            type: 'info',
            title: 'Two Modes',
            description: 'Ara comes in two formats: search & converse. Use search when you want a quick tool. Use converse when you want deep conversation.',
            buttonLabel: 'got it',
            picture: require('@/assets/images/onboarding-7.png')
        },
        {
            id: 8,
            type: 'personality',
            picture: require('@/assets/images/onboarding-2.png')
        }
    ];
    return data;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [onboardingData, setOnboardingData] = useState<OnboardingStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState({
        phone: '',
        name: '',
        birthday: '',
        username: '',
        personality: ''
    });

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

    const handleNext = (data?: any) => {
        if (data) {
            setUserData(prev => ({ ...prev, ...data }));
        }

        if (currentStep < onboardingData.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Here you could send the collected userData to your backend
            console.log('Completed onboarding with data:', userData);
            onComplete();
        }
    };

    const renderScreen = (screenConfig: OnboardingStep) => {
        switch (screenConfig.type) {
            case 'phoneId':
                return (
                    <PhoneIdScreen
                        onNext={(phone) => handleNext({ phone })}
                        tagline={screenConfig.tagline}
                        picture={screenConfig.picture}
                    />
                );
            case 'name':
                return (
                    <NameInput
                        onNext={(name) => handleNext({ name })}
                        picture={screenConfig.picture}
                    />
                );
            case 'birthday':
                return (
                    <BirthdayInput
                        onNext={(birthday) => handleNext({ birthday })}
                        picture={screenConfig.picture}
                    />
                );
            case 'username':
                return (
                    <UsernameInput
                        onNext={(username) => handleNext({ username })}
                        picture={screenConfig.picture}
                    />
                );
            case 'info':
                return (
                    <InfoScreen
                        onNext={() => handleNext()}
                        title={screenConfig.title}
                        description={screenConfig.description}
                        buttonLabel={screenConfig.buttonLabel}
                        picture={screenConfig.picture}
                    />
                );
            case 'personality':
                return (
                    <PersonalitySelect
                        onNext={(personality) => handleNext({ personality })}
                        picture={screenConfig.picture}
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
        <View style={styles.container}>
            {renderScreen(onboardingData[currentStep])}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background for the screens
    },
    stepIndicator: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'SpaceGrotesk_400Regular',
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