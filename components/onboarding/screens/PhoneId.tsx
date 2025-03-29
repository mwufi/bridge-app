import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Pressable,
    Modal,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {
    useFonts,
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

interface PhoneIdScreenProps {
    onNext: (phoneNumber: string) => void;
    tagline: string;
    picture: string;
}

// Helper function to format phone number
const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const TermsSheet = ({ visible, onClose, content }: { visible: boolean; onClose: () => void; content: string }) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <ScrollView style={styles.modalScroll}>
                    <Text style={styles.modalText}>{content}</Text>
                </ScrollView>
                <Pressable style={styles.modalButton} onPress={onClose}>
                    <Text style={styles.modalButtonText}>Close</Text>
                </Pressable>
            </View>
        </View>
    </Modal>
);

const PhoneIdScreen = ({ onNext, tagline, picture }: PhoneIdScreenProps) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const [fontsLoaded] = useFonts({
        Fredoka_400Regular,
        Fredoka_600SemiBold,
        SpaceGrotesk_400Regular,
        SpaceGrotesk_600SemiBold,
        Outfit_400Regular,
        Outfit_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View style={styles.fullScreen} />;
    }

    const handleSubmit = () => {
        const rawNumber = phoneNumber.replace(/[^\d]/g, '');
        if (rawNumber.length >= 10) {
            onNext(rawNumber);
        }
    };

    const handlePhoneChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhoneNumber(formatted);
    };

    return (
        <View style={styles.fullScreen}>
            <ImageBackground
                source={picture || require('@/assets/images/onboarding-1.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    style={styles.content}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
                >
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>ARA</Text>
                        <Text style={styles.tagline}>{tagline}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>enter your number</Text>
                        <View style={styles.phoneInput}>
                            <View style={styles.countryCode}>
                                <Image
                                    source={require('@/assets/images/onboarding-2.png')}
                                    style={styles.flag}
                                />
                                <Text style={styles.countryCodeText}>+1</Text>
                            </View>
                            <TextInput
                                style={styles.numberInput}
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                keyboardType="phone-pad"
                                placeholder="(650) 213-7379"
                                placeholderTextColor="#666"
                                onSubmitEditing={handleSubmit}
                                returnKeyType="done"
                                maxLength={14}
                            />
                        </View>

                        <Text style={styles.termsText}>
                            by entering, you agree to our{' '}
                            <Text style={styles.termsLink} onPress={() => setShowPrivacy(true)}>
                                privacy policy
                            </Text>
                            {' & '}
                            <Text style={styles.termsLink} onPress={() => setShowTerms(true)}>
                                terms of service
                            </Text>
                        </Text>

                        <Pressable
                            style={[styles.submitButton, !phoneNumber.length && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={!phoneNumber.length}
                        >
                            <Text style={styles.submitButtonText}>enter</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>

            <TermsSheet
                visible={showPrivacy}
                onClose={() => setShowPrivacy(false)}
                content="Privacy Policy content goes here..."
            />
            <TermsSheet
                visible={showTerms}
                onClose={() => setShowTerms(false)}
                content="Terms of Service content goes here..."
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
        paddingTop: 10,
        minHeight: 10,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Fredoka_600SemiBold',
        textShadowColor: 'rgba(255, 90, 95, 0.25)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        letterSpacing: 2,
    },
    tagline: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Outfit_600SemiBold',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    inputContainer: {
        flex: 1,
        flexGrow: 1,
        flexShrink: 0,
        minHeight: 200,
        maxHeight: 300,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 24,
        marginBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: 'rgba(255, 90, 95, 0.2)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    inputLabel: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 24,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        color: '#2D3436',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    phoneInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        shadowColor: 'rgba(255, 90, 95, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        backgroundColor: '#F8F8F8',
    },
    flag: {
        width: 28,
        height: 20,
        marginRight: 12,
    },
    countryCodeText: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        color: '#2D3436',
    },
    numberInput: {
        flex: 1,
        padding: 16,
        fontSize: 20,
        fontFamily: 'SpaceGrotesk_400Regular',
        color: '#2D3436',
    },
    termsText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginTop: 20,
        marginBottom: 24,
        lineHeight: 20,
        fontFamily: 'Outfit_400Regular',
    },
    termsLink: {
        color: '#FF5A5F',
        textDecorationLine: 'underline',
        fontFamily: 'Outfit_600SemiBold',
    },
    submitButton: {
        backgroundColor: '#FF5A5F',
        borderRadius: 30,
        padding: 18,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#FF5A5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalScroll: {
        maxHeight: '90%',
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
        color: '#2D3436',
        fontFamily: 'Outfit_400Regular',
    },
    modalButton: {
        backgroundColor: '#FF5A5F',
        borderRadius: 30,
        padding: 18,
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#FF5A5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default PhoneIdScreen; 