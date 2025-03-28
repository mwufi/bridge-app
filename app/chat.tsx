import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import ChatScreen from '@/components/chat/ChatScreen';

export default function Chat() {
    const { taskId, title } = useLocalSearchParams();

    return (
        <ChatScreen />
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
}); 