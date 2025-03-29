import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Storage } from '@/utils/storage';

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
    const handleComplete = async () => {
        await Storage.setOnboardingComplete();
        onComplete();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to ARA</Text>
                <Text style={styles.subtitle}>Your Gen Z AI bestie</Text>

                <TouchableOpacity style={styles.button} onPress={handleComplete}>
                    <Text style={styles.buttonText}>GET STARTED</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        padding: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        color: '#666666',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#FF3366',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
    },
}); 