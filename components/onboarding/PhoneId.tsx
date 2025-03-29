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
                source={picture || require('../../assets/images/onboarding-1.png')}
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
                                    source={require('../../assets/images/onboarding-2.png')}
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
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tagline: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputContainer: {
        flex: 1,
        flexGrow: 1,
        flexShrink: 0,
        minHeight: 200, // Add minimum height to prevent shrinking
        maxHeight: 300, // Add maximum height to prevent growing
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

export default PhoneIdScreen; 