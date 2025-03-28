import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function Header() {
    const router = useRouter();
    const notificationCount = 3; // This would come from your notifications state

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.name}>Keisya</Text>
                <Text style={styles.subtitle}>32 new messages are coming</Text>
            </View>

            <View style={styles.rightSection}>
                <Pressable
                    style={styles.notificationButton}
                    onPress={() => router.push('/notifications')}
                >
                    <FontAwesome name="bell" size={24} color="#2C3E50" />
                    {notificationCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{notificationCount}</Text>
                        </View>
                    )}
                </Pressable>

                <Pressable
                    style={styles.avatarContainer}
                    onPress={() => router.push('/settings')}
                >
                    <Image
                        source={{ uri: 'https://placekitten.com/100/100' }} // Replace with actual avatar
                        style={styles.avatar}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    leftSection: {
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#7C4DFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#9E9E9E',
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F7FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#7C4DFF',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
}); 