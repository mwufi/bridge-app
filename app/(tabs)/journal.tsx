import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Light theme colors
const LIGHT_THEME = {
    primary: '#F8F7FF', // Almost white with a hint of purple
    secondary: '#E4E1FF', // Light purple
    accent: '#9B8AFB', // Soft purple
    text: '#2D2B55', // Deep purple-blue
    background: '#FFFFFF',
    card: 'rgba(248, 247, 255, 0.85)', // Translucent primary
};

// Sample journal entries
const journalEntries = [
    {
        id: '1',
        date: 'May 15, 2024',
        title: 'Morning Reflections',
        preview: 'Today started with a beautiful sunrise...',
        mood: 'peaceful',
        tags: ['morning', 'gratitude'],
        imageUrl: require('@/assets/images/icon.png'),
    },
    {
        id: '2',
        date: 'May 14, 2024',
        title: 'Creative Flow',
        preview: 'Found myself lost in the creative process...',
        mood: 'inspired',
        tags: ['creativity', 'work'],
    },
    {
        id: '3',
        date: 'May 13, 2024',
        title: 'Evening Thoughts',
        preview: 'Reflecting on today\'s achievements...',
        mood: 'grateful',
        tags: ['evening', 'reflection'],
    },
];

export default function JournalScreen() {
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'All Entries' },
        { id: 'photos', label: 'With Photos' },
        { id: 'favorites', label: 'Favorites' },
    ];

    const renderJournalEntry = ({ item }) => (
        <TouchableOpacity
            style={styles.entryCard}
            onPress={() => {
                // Navigate to entry detail
                router.push({
                    pathname: '/journal/[id]',
                    params: { id: item.id }
                });
            }}
        >
            <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>{item.date}</Text>
                <View style={styles.moodContainer}>
                    <FontAwesome5
                        name={item.mood === 'peaceful' ? 'smile' : item.mood === 'inspired' ? 'star' : 'heart'}
                        size={14}
                        color={LIGHT_THEME.accent}
                    />
                    <Text style={styles.moodText}>{item.mood}</Text>
                </View>
            </View>

            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryPreview}>{item.preview}</Text>

            {item.imageUrl && (
                <Image source={item.imageUrl} style={styles.entryImage} />
            )}

            <View style={styles.tagsContainer}>
                {item.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Journal</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <FontAwesome5 name="search" size={20} color={LIGHT_THEME.text} />
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
            >
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter.id && styles.filterButtonActive
                        ]}
                        onPress={() => setSelectedFilter(filter.id)}
                    >
                        <Text style={[
                            styles.filterText,
                            selectedFilter === filter.id && styles.filterTextActive
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Journal Entries */}
            <FlatList
                data={journalEntries}
                renderItem={renderJournalEntry}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.entriesContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* New Entry FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    // Navigate to new entry screen
                    router.push('/journal/new');
                }}
            >
                <FontAwesome5 name="plus" size={24} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_THEME.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: LIGHT_THEME.text,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: LIGHT_THEME.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filtersContainer: {
        maxHeight: 50,
        marginBottom: 10,
    },
    filtersContent: {
        paddingHorizontal: 15,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: LIGHT_THEME.primary,
    },
    filterButtonActive: {
        backgroundColor: LIGHT_THEME.accent,
    },
    filterText: {
        color: LIGHT_THEME.text,
        fontSize: 14,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFF',
    },
    entriesContainer: {
        padding: 15,
    },
    entryCard: {
        backgroundColor: LIGHT_THEME.card,
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        shadowColor: LIGHT_THEME.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    entryDate: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.7,
    },
    moodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LIGHT_THEME.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    moodText: {
        fontSize: 12,
        color: LIGHT_THEME.text,
        marginLeft: 6,
    },
    entryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: LIGHT_THEME.text,
        marginBottom: 8,
    },
    entryPreview: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.8,
        marginBottom: 12,
    },
    entryImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: LIGHT_THEME.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: LIGHT_THEME.text,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
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
}); 