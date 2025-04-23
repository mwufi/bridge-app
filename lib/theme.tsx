import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { View, Image } from 'react-native';
import { useFonts, Poppins_100Thin } from '@expo-google-fonts/poppins';
import { EBGaramond_400Regular } from '@expo-google-fonts/eb-garamond';

export type Color = {
    type: 'gradient' | 'solid' | 'image';
    value: {
        start?: string;
        end?: string;
        color?: string;
        image?: any;
    };
};

export type ColorScheme = {
    name: string;
    background: Color;
    userBubble?: {
        background?: Color;
        foreground?: string;
        fontFamily?: string;
    };
    assistantBubble?: {
        background?: Color;
        foreground?: string;
        fontFamily?: string;
    };
    input?: {
        background?: string;
        foreground?: string;
    };
};

export const ColorSchemes: Record<string, ColorScheme> = {
    rose: {
        name: 'rose',
        background: {
            type: 'gradient',
            value: {
                start: '#E6E2E5',
                end: '#E3ACAB',
            },
        },
        userBubble: {
            background: {
                type: 'solid',
                value: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            foreground: '#333333',
            fontFamily: 'Poppins_100Thin',
        },
        assistantBubble: {
            background: {
                type: 'solid',
                value: { color: 'transparent' },
            },
            foreground: 'black',
            fontFamily: 'EBGaramond_400Regular',
        },
        input: {
            background: 'transparent',
            foreground: 'black',
        },
    },
    dark: {
        name: 'dark',
        background: {
            type: 'solid',
            value: { color: '#000000' },
        },
        userBubble: {
            background: {
                type: 'solid',
                value: { color: '#FF3366' },
            },
            foreground: '#FFFFFF',
            fontFamily: 'Poppins_100Thin',
        },
        assistantBubble: {
            background: {
                type: 'solid',
                value: { color: '#1A1A1A' },
            },
            foreground: '#FFFFFF',
            fontFamily: 'EBGaramond_400Regular',
        },
        input: {
            background: '#1A1A1A',
            foreground: '#FFFFFF',
        },
    },
    // Add more themes as needed
};

export const renderBackground = (color: Color, children: ReactNode): ReactNode => {
    switch (color.type) {
        case 'gradient':
            const start = color.value.start || '#000000';
            const end = color.value.end || '#000000';
            return (
                <LinearGradient
                    colors={[start, end]}
                    style={{ flex: 1 }}
                    start={{ x: 0, y: 0 }
                    }
                    end={{ x: 0, y: 1 }}
                >
                    {children}
                </LinearGradient>
            );
        case 'solid':
            return <View style={{ flex: 1, backgroundColor: color.value.color }} />;
        case 'image':
            return (
                <Image
                    source={color.value.image}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                />
            );
    }
};

export const getBackgroundStyle = (color: Color) => {
    switch (color.type) {
        case 'gradient':
            return {
                backgroundColor: 'transparent',
            };
        case 'solid':
            return {
                backgroundColor: color.value.color,
            };
        case 'image':
            return {
                backgroundColor: 'transparent',
            };
    }
}; 