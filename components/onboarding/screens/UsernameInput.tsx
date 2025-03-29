import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import {
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import OnboardingContainer from '../shared/OnboardingContainer';
import OnboardingButton from '../shared/OnboardingButton';

interface UsernameInputProps {
    onNext: (username: string) => void;
    picture?: string;
}

const UsernameInput = ({ onNext, picture }: UsernameInputProps) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const validateUsername = (value: string) => {
        if (value.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (value.length > 15) {
            return 'Username must be less than 15 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
    };

    const handleUsernameChange = (text: string) => {
        const sanitized = text.toLowerCase().replace(/[^a-z0-9_]/g, '');
        setUsername(sanitized);
        setError(validateUsername(sanitized));
    };

    const handleSubmit = () => {
        const validationError = validateUsername(username);
        if (!validationError) {
            onNext(username);
        } else {
            setError(validationError);
        }
    };

    return (
        <OnboardingContainer picture={picture}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>ARA</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>choose a username</Text>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        value={username}
                        onChangeText={handleUsernameChange}
                        placeholder="username"
                        placeholderTextColor="#666"
                        autoFocus
                        onSubmitEditing={handleSubmit}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <Text style={styles.helperText}>
                        letters, numbers, and underscores only
                    </Text>
                )}

                <OnboardingButton
                    label="next"
                    onPress={handleSubmit}
                    disabled={!!error || !username}
                />
            </View>
        </OnboardingContainer>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 24,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        color: '#2D3436',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    textInputWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginBottom: 12,
        shadowColor: 'rgba(255, 90, 95, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    textInput: {
        padding: 16,
        fontSize: 20,
        fontFamily: 'SpaceGrotesk_400Regular',
        color: '#2D3436',
    },
    errorText: {
        color: '#FF5A5F',
        fontSize: 14,
        fontFamily: 'SpaceGrotesk_400Regular',
        marginBottom: 24,
        marginHorizontal: 4,
    },
    helperText: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'SpaceGrotesk_400Regular',
        marginBottom: 24,
        marginHorizontal: 4,
    },
});

export default UsernameInput; 