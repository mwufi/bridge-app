import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { Header } from '@/components/typography/header';
import { CommunityChat } from '@/components/CommunityChat';

// Mock data for messages
const mockMessages = [
    { id: '1', userName: 'SarahAI', content: 'Just discovered a cool new AI tool for generating images. Anyone tried it yet?', timePosted: '2 hours ago' },
    { id: '2', userName: 'CodeMaster', content: "What's your favorite JavaScript framework in 2025?", timePosted: '4 hours ago' },
    { id: '3', userName: 'BookWorm', content: 'Currently reading "The Algorithm of Thoughts". Highly recommend!', timePosted: '1 day ago' },
];

export default function CommunityScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState(mockMessages);

    const handleSendMessage = (content: string) => {
        const newMessage = {
            id: String(messages.length + 1),
            userName: 'CurrentUser', // This would come from auth context in a real app
            content,
            timePosted: 'Just now',
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <FontAwesome name="arrow-left" size={20} color="#FFF" />
                </TouchableOpacity>
                <Header>AI Enthusiasts</Header>
            </View>

            <CommunityChat
                communityName="AI Enthusiasts"
                messages={messages}
                onSendMessage={handleSendMessage}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
}); 