import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import {
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Outfit_400Regular } from '@expo-google-fonts/outfit';
import OnboardingButton from '../shared/OnboardingButton';

interface InfoScreenProps {
    onNext: () => void;
    title: string;
    description: string;
    buttonLabel?: string;
    picture?: string;
}

const InfoScreen = ({ onNext, title, description, buttonLabel = "next", picture }: InfoScreenProps) => {
    return (
        <View style={styles.fullScreen}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <OnboardingButton
                    label={buttonLabel}
                    onPress={onNext}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    contentContainer: {
        flex: 1,
        flexGrow: 1,
        flexShrink: 0,
        minHeight: 200,
        paddingTop: "25%",
        width: '100%',
        backgroundColor: 'rgba(255, 248, 240, 0.95)',
        borderRadius: 24,
        padding: 24,
        marginBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: 'rgba(255, 90, 95, 0.2)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        marginBottom: 16,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        color: '#2D3436',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    description: {
        fontSize: 18,
        lineHeight: 26,
        marginBottom: 32,
        fontFamily: 'Outfit_400Regular',
        color: '#2D3436',
    },
});

export default InfoScreen; 