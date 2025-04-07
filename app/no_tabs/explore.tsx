import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Light theme colors
const LIGHT_THEME = {
    primary: '#F8F7FF', // Almost white with a hint of purple
    secondary: '#E4E1FF', // Light purple
    accent: '#9B8AFB', // Soft purple
    text: '#2D2B55', // Deep purple-blue
    background: '#FFFFFF',
    card: 'rgba(248, 247, 255, 0.85)', // Translucent primary
};

// Sample categories
const categories = [
    { id: '1', name: 'Mindfulness', icon: 'spa' },
    { id: '2', name: 'Creativity', icon: 'palette' },
    { id: '3', name: 'Fitness', icon: 'running' },
    { id: '4', name: 'Learning', icon: 'book-reader' },
    { id: '5', name: 'Nature', icon: 'leaf' },
    { id: '6', name: 'Social', icon: 'users' },
];

// Sample featured activities
const featuredActivities = [
    {
        id: '1',
        title: '30 Days of Gratitude',
        description: 'Transform your perspective with daily gratitude practices',
        image: require('@/assets/images/icon.png'),
        participants: 1234,
        category: 'Mindfulness',
    },
    {
        id: '2',
        title: 'Creative Writing Challenge',
        description: 'Unlock your creativity with daily writing prompts',
        image: require('@/assets/images/icon.png'),
        participants: 856,
        category: 'Creativity',
    },
];

// Sample daily challenges
const dailyChallenges = [
    {
        id: '1',
        title: 'Morning Pages',
        description: 'Write three pages of stream of consciousness',
        duration: '15 mins',
        difficulty: 'Easy',
    },
    {
        id: '2',
        title: 'Nature Walk',
        description: 'Take a mindful walk in nature',
        duration: '30 mins',
        difficulty: 'Medium',
    },
    {
        id: '3',
        title: 'Digital Detox',
        description: 'Stay offline for 2 hours',
        duration: '2 hours',
        difficulty: 'Hard',
    },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function ExploreScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const renderCategory = (category) => (
        <TouchableOpacity
            key={category.id}
            style={styles.categoryButton}
            onPress={() => {
                // Navigate to category
                router.push({
                    pathname: '/explore/category/[id]',
                    params: { id: category.id }
                });
            }}
        >
            <View style={styles.categoryIcon}>
                <FontAwesome5 name={category.icon} size={24} color={LIGHT_THEME.accent} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
    );

    const renderFeaturedActivity = (activity) => (
        <TouchableOpacity
            key={activity.id}
            style={styles.featuredCard}
            onPress={() => {
                // Navigate to activity
                router.push({
                    pathname: '/explore/activity/[id]',
                    params: { id: activity.id }
                });
            }}
        >
            <Image source={activity.image} style={styles.featuredImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.featuredGradient}
            >
                <View style={styles.featuredContent}>
                    <Text style={styles.featuredTitle}>{activity.title}</Text>
                    <Text style={styles.featuredDescription}>{activity.description}</Text>
                    <View style={styles.featuredMeta}>
                        <View style={styles.featuredParticipants}>
                            <FontAwesome5 name="users" size={12} color="#FFF" />
                            <Text style={styles.featuredParticipantsText}>
                                {activity.participants.toLocaleString()} joined
                            </Text>
                        </View>
                        <View style={styles.featuredCategory}>
                            <Text style={styles.featuredCategoryText}>{activity.category}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={16} color={LIGHT_THEME.text} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search activities..."
                    placeholderTextColor="#A9A5D2"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Categories */}
                <View style={styles.categoriesContainer}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map(renderCategory)}
                    </View>
                </View>

                {/* Featured Activities */}
                <View style={styles.featuredContainer}>
                    <Text style={styles.sectionTitle}>Featured</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuredScroll}
                        snapToInterval={CARD_WIDTH + 20}
                        decelerationRate="fast"
                    >
                        {featuredActivities.map(renderFeaturedActivity)}
                    </ScrollView>
                </View>

                {/* Daily Challenges */}
                <View style={styles.challengesContainer}>
                    <Text style={styles.sectionTitle}>Daily Challenges</Text>
                    {dailyChallenges.map((challenge) => (
                        <TouchableOpacity
                            key={challenge.id}
                            style={styles.challengeCard}
                            onPress={() => {
                                // Navigate to challenge
                                router.push({
                                    pathname: '/explore/challenge/[id]',
                                    params: { id: challenge.id }
                                });
                            }}
                        >
                            <View style={styles.challengeContent}>
                                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                                <Text style={styles.challengeDescription}>{challenge.description}</Text>
                            </View>
                            <View style={styles.challengeMeta}>
                                <View style={styles.challengeMetaItem}>
                                    <FontAwesome5 name="clock" size={12} color={LIGHT_THEME.text} />
                                    <Text style={styles.challengeMetaText}>{challenge.duration}</Text>
                                </View>
                                <View style={styles.challengeMetaItem}>
                                    <FontAwesome5 name="star" size={12} color={LIGHT_THEME.text} />
                                    <Text style={styles.challengeMetaText}>{challenge.difficulty}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_THEME.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: LIGHT_THEME.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LIGHT_THEME.primary,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 15,
        padding: 12,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: LIGHT_THEME.text,
    },
    content: {
        paddingBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: LIGHT_THEME.text,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    categoriesContainer: {
        marginBottom: 30,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
    },
    categoryButton: {
        width: '33.33%',
        alignItems: 'center',
        marginBottom: 20,
    },
    categoryIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: LIGHT_THEME.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        textAlign: 'center',
    },
    featuredContainer: {
        marginBottom: 30,
    },
    featuredScroll: {
        paddingHorizontal: 20,
    },
    featuredCard: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 20,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        justifyContent: 'flex-end',
        padding: 15,
    },
    featuredContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 8,
    },
    featuredDescription: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.8,
        marginBottom: 12,
    },
    featuredMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredParticipants: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuredParticipantsText: {
        color: '#FFF',
        fontSize: 12,
        marginLeft: 6,
    },
    featuredCategory: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    featuredCategoryText: {
        color: '#FFF',
        fontSize: 12,
    },
    challengesContainer: {
        paddingHorizontal: 20,
    },
    challengeCard: {
        backgroundColor: LIGHT_THEME.card,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    challengeContent: {
        marginBottom: 12,
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: LIGHT_THEME.text,
        marginBottom: 6,
    },
    challengeDescription: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.8,
    },
    challengeMeta: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    challengeMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    challengeMetaText: {
        fontSize: 12,
        color: LIGHT_THEME.text,
        marginLeft: 6,
    },
}); 