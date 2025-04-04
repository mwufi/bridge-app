import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Light theme colors
const LIGHT_THEME = {
    primary: '#F8F7FF', // Almost white with a hint of purple
    secondary: '#E4E1FF', // Light purple
    accent: '#9B8AFB', // Soft purple
    text: '#2D2B55', // Deep purple-blue
    background: '#FFFFFF',
    card: 'rgba(248, 247, 255, 0.85)', // Translucent primary
};

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: LIGHT_THEME.accent,
                tabBarInactiveTintColor: LIGHT_THEME.text,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: () => (
                    <BlurView
                        intensity={60}
                        tint="light"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    />
                ),
                tabBarStyle: Platform.select({
                    ios: {
                        backgroundColor: 'transparent',
                        borderTopColor: 'transparent',
                    },
                    default: {
                        backgroundColor: LIGHT_THEME.card,
                        borderTopColor: LIGHT_THEME.secondary,
                    },
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="sparkles" color={color} />,
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    title: 'Journal',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="book.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="compass.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.crop.circle.fill" color={color} />,
                }}
            />
        </Tabs>
    );
} 