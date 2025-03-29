import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk';

interface OnboardingButtonProps {
    onPress: () => void;
    label: string;
    disabled?: boolean;
}

const OnboardingButton = ({ onPress, label, disabled }: OnboardingButtonProps) => (
    <Pressable
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
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
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default OnboardingButton; 