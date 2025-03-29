import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ScrollView,
    Dimensions,
    Pressable,
    Animated,
} from 'react-native';
import {
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Outfit_400Regular } from '@expo-google-fonts/outfit';
import OnboardingContainer from '../shared/OnboardingContainer';
import OnboardingButton from '../shared/OnboardingButton';

interface Personality {
    id: string;
    name: string;
    description: string;
}

interface PersonalitySelectProps {
    onNext: (personalityId: string) => void;
    picture?: string;
}

const PERSONALITIES: Personality[] = [
    {
        id: 'playful',
        name: 'Playful',
        description: 'Fun, energetic, and always ready for a laugh. Perfect for casual chats and creative brainstorming.',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Focused, efficient, and straight to the point. Ideal for work-related tasks and productivity.',
    },
    {
        id: 'wise',
        name: 'Wise',
        description: 'Thoughtful, insightful, and philosophical. Great for deep conversations and learning.',
    },
    {
        id: 'caring',
        name: 'Caring',
        description: 'Empathetic, supportive, and understanding. Perfect for emotional support and personal growth.',
    },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_MARGIN = 16;

const PersonalitySelect = ({ onNext, picture }: PersonalitySelectProps) => {
    const [selectedId, setSelectedId] = useState(PERSONALITIES[0].id);
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const handlePersonalitySelect = (id: string) => {
        setSelectedId(id);
        const index = PERSONALITIES.findIndex(p => p.id === id);
        scrollViewRef.current?.scrollTo({
            x: index * (CARD_WIDTH + CARD_MARGIN),
            animated: true,
        });
    };

    return (
        <OnboardingContainer picture={picture}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>ARA</Text>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.title}>customize your ara</Text>
                <Text style={styles.subtitle}>pick a personality</Text>

                <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    snapToInterval={CARD_WIDTH + CARD_MARGIN}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {PERSONALITIES.map((personality, index) => {
                        const inputRange = [
                            (index - 1) * (CARD_WIDTH + CARD_MARGIN),
                            index * (CARD_WIDTH + CARD_MARGIN),
                            (index + 1) * (CARD_WIDTH + CARD_MARGIN),
                        ];

                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.9, 1, 0.9],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={personality.id}
                                style={[
                                    styles.card,
                                    { transform: [{ scale }] },
                                    selectedId === personality.id && styles.cardSelected,
                                ]}
                            >
                                <Pressable
                                    onPress={() => handlePersonalitySelect(personality.id)}
                                    style={styles.cardContent}
                                >
                                    <Text style={styles.personalityName}>
                                        {personality.name}
                                    </Text>
                                    <Text style={styles.personalityDescription}>
                                        {personality.description}
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </Animated.ScrollView>

                <View style={styles.dotsContainer}>
                    {PERSONALITIES.map((personality, index) => {
                        const inputRange = [
                            (index - 1) * (CARD_WIDTH + CARD_MARGIN),
                            index * (CARD_WIDTH + CARD_MARGIN),
                            (index + 1) * (CARD_WIDTH + CARD_MARGIN),
                        ];

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={personality.id}
                                style={[
                                    styles.dot,
                                    { opacity },
                                    selectedId === personality.id && styles.dotSelected,
                                ]}
                            />
                        );
                    })}
                </View>

                <Text style={styles.helperText}>
                    don't worry, you can change this later
                </Text>

                <OnboardingButton
                    label="let's go!"
                    onPress={() => onNext(selectedId)}
                />
            </View>
        </OnboardingContainer>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
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
        maxHeight: 500,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 16,
        marginBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: 'rgba(255, 90, 95, 0.2)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        marginBottom: 8,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        color: '#2D3436',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 24,
        fontFamily: 'SpaceGrotesk_400Regular',
        color: '#666',
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
    card: {
        width: CARD_WIDTH,
        marginRight: CARD_MARGIN,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: 'rgba(255, 90, 95, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    cardSelected: {
        borderColor: '#FF5A5F',
        shadowColor: 'rgba(255, 90, 95, 0.2)',
        shadowOpacity: 0.2,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    personalityName: {
        fontSize: 24,
        marginBottom: 12,
        fontFamily: 'SpaceGrotesk_600SemiBold',
        color: '#2D3436',
    },
    personalityDescription: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Outfit_400Regular',
        color: '#666',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5A5F',
        marginHorizontal: 4,
    },
    dotSelected: {
        width: 24,
    },
    helperText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        fontFamily: 'SpaceGrotesk_400Regular',
        marginBottom: 24,
    },
});

export default PersonalitySelect; 