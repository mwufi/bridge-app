import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Light theme colors
const LIGHT_THEME = {
    primary: '#F8F7FF', // Almost white with a hint of purple
    secondary: '#E4E1FF', // Light purple
    accent: '#9B8AFB', // Soft purple
    text: '#2D2B55', // Deep purple-blue
    background: '#FFFFFF',
    card: 'rgba(248, 247, 255, 0.85)', // Translucent primary
};

export default function RootLayout() {
    return (
        <>
            <StatusBar style="dark" />
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: LIGHT_THEME.background }
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="homescreen" />
                <Stack.Screen
                    name="explore"
                    options={{
                        presentation: 'card',
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="profile"
                    options={{
                        presentation: 'card',
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="journal"
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
            </Stack>
        </>
    );
} 