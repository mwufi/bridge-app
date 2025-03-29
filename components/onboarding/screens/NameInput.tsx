import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import OnboardingContainer from '../shared/OnboardingContainer';
import OnboardingButton from '../shared/OnboardingButton';

interface NameInputProps {
    onNext: (name: string) => void;
    picture?: string;
}

const NameInput = ({ onNext, picture }: NameInputProps) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onNext(name.trim());
        }
    };

    return (
        <OnboardingContainer picture={picture}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>ARA</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>what's your name?</Text>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="your name"
                        placeholderTextColor="#666"
                        autoFocus
                        onSubmitEditing={handleSubmit}
                        returnKeyType="done"
                    />
                </View>

                <OnboardingButton
                    label="next"
                    onPress={handleSubmit}
                    disabled={!name.trim()}
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

export default NameInput; 