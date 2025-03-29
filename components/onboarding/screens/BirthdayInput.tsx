import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import OnboardingContainer from '../shared/OnboardingContainer';
import OnboardingButton from '../shared/OnboardingButton';

interface BirthdayInputProps {
    onNext: (birthday: string) => void;
    picture?: string;
}

const formatBirthday = (value: string) => {
    if (!value) return value;
    const numbers = value.replace(/[^\d]/g, '');
    const length = numbers.length;
    if (length < 2) return numbers;
    if (length < 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

const BirthdayInput = ({ onNext, picture }: BirthdayInputProps) => {
    const [birthday, setBirthday] = useState('');

    const handleBirthdayChange = (text: string) => {
        const formatted = formatBirthday(text);
        if (formatted.length <= 10) {
            setBirthday(formatted);
        }
    };

    const isValidBirthday = (date: string) => {
        const parts = date.split('/');
        if (parts.length !== 3) return false;

        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const birthDate = new Date(year, month - 1, day);
        const now = new Date();

        return (
            month >= 1 && month <= 12 &&
            day >= 1 && day <= 31 &&
            year >= 1900 && year <= now.getFullYear() &&
            birthDate <= now
        );
    };

    const handleSubmit = () => {
        onNext(birthday);
    };

    return (
        <OnboardingContainer picture={picture}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>ARA</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>when's your birthday?</Text>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        value={birthday}
                        onChangeText={handleBirthdayChange}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor="#666"
                        keyboardType="number-pad"
                        autoFocus
                        onSubmitEditing={handleSubmit}
                        returnKeyType="done"
                        maxLength={10}
                    />
                </View>

                <OnboardingButton
                    label="next"
                    onPress={handleSubmit}
                    disabled={!isValidBirthday(birthday)}
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
        marginBottom: 24,
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
});

export default BirthdayInput; 