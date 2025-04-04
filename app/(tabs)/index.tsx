import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';

// Light theme colors
const LIGHT_THEME = {
    primary: '#F8F7FF', // Almost white with a hint of purple
    secondary: '#E4E1FF', // Light purple
    accent: '#9B8AFB', // Soft purple
    text: '#2D2B55', // Deep purple-blue
    background: '#FFFFFF',
    card: 'rgba(248, 247, 255, 0.85)', // Translucent primary
};

// Sample data for daily insights
const dailyInsights = [
    { id: '1', title: 'Morning Reflection', time: '8:00 AM', completed: true },
    { id: '2', title: 'Mindful Break', time: '12:30 PM', completed: false },
    { id: '3', title: 'Evening Journal', time: '7:00 PM', completed: false },
];

// Sample data for mood tracking
const moodHistory = [
    { id: '1', mood: 'joyful', date: 'Mon' },
    { id: '2', mood: 'peaceful', date: 'Tue' },
    { id: '3', mood: 'focused', date: 'Wed' },
    { id: '4', mood: 'grateful', date: 'Thu' },
    { id: '5', mood: 'inspired', date: 'Fri' },
];

// Sample prompts for reflection
const reflectionPrompts = [
    "What's bringing you joy today?",
    "Share a small win from yesterday",
    "What are you looking forward to?",
    "Name three things you're grateful for",
];

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isInputModalVisible, setIsInputModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [currentPrompt, setCurrentPrompt] = useState(reflectionPrompts[0]);

    // Animation for the floating action button
    const [scaleAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        // Pulse animation for the FAB
        const pulseAnimation = Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]);

        Animated.loop(pulseAnimation).start();
    }, []);

    const handlePromptPress = () => {
        setIsInputModalVisible(true);
    };

    const renderMoodIcon = (mood: string) => {
        const moodIcons = {
            joyful: 'laugh-beam',
            peaceful: 'smile',
            focused: 'glasses',
            grateful: 'heart',
            inspired: 'star',
        };
        return moodIcons[mood] || 'smile';
    };

    return (
        <SafeAreaView style={[styles.container]} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.greeting}>Good morning,</Text>
                        <Text style={styles.name}>Zen</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.push('/explore')}
                        >
                            <FontAwesome5 name="compass" size={20} color={LIGHT_THEME.accent} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.push('/journal')}
                        >
                            <FontAwesome5 name="book" size={20} color={LIGHT_THEME.accent} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.avatarContainer}
                            onPress={() => router.push('/profile')}
                        >
                            <Image
                                source={require('@/assets/images/icon.png')}
                                style={styles.avatar}
                            />
                            <View style={styles.avatarBadge} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Daily Quote Card */}
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteText}>
                        "Every morning we are born again. What we do today is what matters most."
                    </Text>
                    <Text style={styles.quoteAuthor}>- Buddha</Text>
                </View>

                {/* Mood History */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Mood Journey</Text>
                    <View style={styles.moodContainer}>
                        {moodHistory.map((item) => (
                            <View key={item.id} style={styles.moodItem}>
                                <View style={styles.moodIconContainer}>
                                    <FontAwesome5
                                        name={renderMoodIcon(item.mood)}
                                        size={24}
                                        color={LIGHT_THEME.accent}
                                    />
                                </View>
                                <Text style={styles.moodDate}>{item.date}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Daily Insights */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Today's Journey</Text>
                    {dailyInsights.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.insightItem}>
                            <View style={styles.insightLeft}>
                                <View style={[
                                    styles.insightDot,
                                    item.completed && styles.insightDotCompleted
                                ]} />
                                <Text style={styles.insightTitle}>{item.title}</Text>
                            </View>
                            <Text style={styles.insightTime}>{item.time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Reflection Prompt */}
                <View style={styles.promptCard}>
                    <Text style={styles.promptLabel}>Reflection Prompt</Text>
                    <Text style={styles.promptText}>{currentPrompt}</Text>
                    <TouchableOpacity
                        style={styles.promptButton}
                        onPress={handlePromptPress}
                    >
                        <Text style={styles.promptButtonText}>Share Your Thoughts</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <Animated.View style={[
                styles.fabContainer,
                { transform: [{ scale: scaleAnim }] }
            ]}>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setIsInputModalVisible(true)}
                >
                    <FontAwesome5 name="feather-alt" size={24} color="#FFF" />
                </TouchableOpacity>
            </Animated.View>

            {/* Input Modal */}
            <Modal
                visible={isInputModalVisible}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setIsInputModalVisible(false)}
            >
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Share Your Thoughts</Text>
                            <TouchableOpacity
                                onPress={() => setIsInputModalVisible(false)}
                                style={styles.modalCloseButton}
                            >
                                <FontAwesome5 name="times" size={20} color={LIGHT_THEME.text} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Write your reflection here..."
                            placeholderTextColor="#A9A5D2"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            autoFocus
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                // Handle saving the reflection
                                setIsInputModalVisible(false);
                                setInputText('');
                            }}
                        >
                            <Text style={styles.modalButtonText}>Save Reflection</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_THEME.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: 100,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: LIGHT_THEME.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
        color: LIGHT_THEME.text,
        opacity: 0.7,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: LIGHT_THEME.text,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: LIGHT_THEME.accent,
    },
    avatarBadge: {
        position: 'absolute',
        right: -2,
        bottom: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: LIGHT_THEME.background,
    },
    quoteCard: {
        backgroundColor: LIGHT_THEME.card,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: LIGHT_THEME.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    quoteText: {
        fontSize: 16,
        color: LIGHT_THEME.text,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    quoteAuthor: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.7,
        marginTop: 10,
        textAlign: 'right',
    },
    sectionContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: LIGHT_THEME.text,
        marginBottom: 15,
    },
    moodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: LIGHT_THEME.card,
        borderRadius: 20,
        padding: 15,
    },
    moodItem: {
        alignItems: 'center',
    },
    moodIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: LIGHT_THEME.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    moodDate: {
        fontSize: 12,
        color: LIGHT_THEME.text,
        opacity: 0.7,
    },
    insightItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LIGHT_THEME.card,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    insightLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    insightDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: LIGHT_THEME.secondary,
        marginRight: 12,
    },
    insightDotCompleted: {
        backgroundColor: '#4CAF50',
    },
    insightTitle: {
        fontSize: 16,
        color: LIGHT_THEME.text,
    },
    insightTime: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.7,
    },
    promptCard: {
        backgroundColor: LIGHT_THEME.card,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    promptLabel: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.7,
        marginBottom: 8,
    },
    promptText: {
        fontSize: 18,
        color: LIGHT_THEME.text,
        marginBottom: 15,
        lineHeight: 26,
    },
    promptButton: {
        backgroundColor: LIGHT_THEME.accent,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    promptButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    fabContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: LIGHT_THEME.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: LIGHT_THEME.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: LIGHT_THEME.background,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: LIGHT_THEME.text,
    },
    modalCloseButton: {
        padding: 8,
    },
    modalInput: {
        backgroundColor: LIGHT_THEME.primary,
        borderRadius: 15,
        padding: 15,
        minHeight: 120,
        fontSize: 16,
        color: LIGHT_THEME.text,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    modalButton: {
        backgroundColor: LIGHT_THEME.accent,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 