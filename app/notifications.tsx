import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type Notification = {
    id: string;
    type: 'message' | 'mention' | 'reminder';
    title: string;
    description: string;
    timestamp: string;
    avatar?: string;
    read: boolean;
};

const notifications: Notification[] = [
    {
        id: '1',
        type: 'message',
        title: 'New Message',
        description: 'Jaxson sent you a voice message',
        timestamp: '5m ago',
        avatar: 'https://placekitten.com/50/50',
        read: false,
    },
    {
        id: '2',
        type: 'mention',
        title: 'Mentioned You',
        description: 'Craig mentioned you: "Hey, you left your book in class"',
        timestamp: '10m ago',
        avatar: 'https://placekitten.com/51/51',
        read: false,
    },
    {
        id: '3',
        type: 'reminder',
        title: 'Group Work',
        description: 'Reminder: Group work session starts in 30 minutes',
        timestamp: '30m ago',
        read: true,
    },
];

export default function NotificationsScreen() {
    const router = useRouter();

    const renderNotification = ({ item }: { item: Notification }) => (
        <Pressable
            style={[styles.notificationItem, !item.read && styles.unread]}
            onPress={() => {
                // Handle notification press
                router.push('/chat');
            }}
        >
            <View style={styles.notificationContent}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.iconContainer}>
                        <FontAwesome
                            name={item.type === 'reminder' ? 'calendar' : 'comment'}
                            size={20}
                            color="#7C4DFF"
                        />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={24} color="#2C3E50" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={{ width: 24 }} />
                </View>

                <FlatList
                    data={notifications}
                    renderItem={renderNotification}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    list: {
        padding: 20,
    },
    notificationItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    unread: {
        backgroundColor: '#F8F7FF',
        borderLeftWidth: 3,
        borderLeftColor: '#7C4DFF',
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0EEFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#9E9E9E',
    },
}); 