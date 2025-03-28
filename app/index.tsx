import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, ViewStyle, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { TabsFilter, TabType } from '@/components/TabsFilter';
import { BentoCard, BentoCardData } from '@/components/BentoCard';

const bentoCards: BentoCardData[] = [
    {
        id: '1',
        type: 'voice',
        title: 'Jaxson Septimus',
        content: 'Voice message',
        time: '05:12',
        color: '#7C4DFF',
        span: 'full',
        category: 'all',
        isNew: true,
    },
    {
        id: '2',
        type: 'text',
        title: 'Craig Levin',
        content: 'Hey, you left your book in class',
        time: '05:12',
        color: '#FF6B6B',
        span: 'half',
        category: 'classes',
        isNew: true,
    },
    {
        id: '3',
        type: 'image',
        title: 'Kaiya Vaccaro',
        content: 'Bestie, this is a picture of us hanging out together yesterday',
        time: '05:12',
        color: '#4ECDC4',
        span: 'full',
        category: 'groups',
        isNew: true,
    },
    {
        id: '4',
        type: 'reminder',
        title: 'Cheyenne Hadeed',
        content: 'When will we do group work?',
        time: '05:12',
        color: '#FFD93D',
        span: 'half',
        category: 'groups',
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('new');

    const filteredCards = bentoCards.filter(card => {
        if (activeTab === 'new') return card.isNew;
        if (activeTab === 'all') return true;
        return card.category === activeTab;
    });

    return (
        <SafeAreaView style={styles.safeArea as ViewStyle}>
            <View style={styles.container as ViewStyle}>
                <Header />

                <TabsFilter activeTab={activeTab} onTabChange={setActiveTab} />

                <ScrollView
                    style={styles.scrollView as ViewStyle}
                    contentContainerStyle={styles.content as ViewStyle}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.bentoGrid as ViewStyle}>
                        {filteredCards.map(card => (
                            <BentoCard key={card.id} card={card} />
                        ))}
                    </View>
                </ScrollView>

                <Pressable
                    style={styles.fab as ViewStyle}
                    onPress={() => router.push('/chat')}
                >
                    <FontAwesome name="pencil" size={24} color="#FFFFFF" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    bentoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#7C4DFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
}); 