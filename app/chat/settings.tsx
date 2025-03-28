import React from 'react';
import { StyleSheet, View, Image, ScrollView, Pressable, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

// Mock data - in a real app, this would come from your backend
const mockParticipants = [
    { id: '1', name: 'Moolan Jameela', avatar: 'https://example.com/avatar1.jpg', isOnline: true },
    { id: '2', name: 'AI Assistant', avatar: undefined, isOnline: true },
];

export default function ChatSettings() {
    const router = useRouter();
    const { name, isGroup } = useLocalSearchParams();

    const HeaderContent = () => (
        <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#000" />
            </Pressable>
            <Text style={styles.headerTitle}>Chat Details</Text>
        </View>
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container} edges={['top']}>
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={80} tint="light" style={styles.headerContainer}>
                        <HeaderContent />
                    </BlurView>
                ) : (
                    <View style={[styles.headerContainer, styles.androidHeader]}>
                        <HeaderContent />
                    </View>
                )}

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.profileSection}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{String(name).charAt(0)}</Text>
                        </View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.status}>Online</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {isGroup === 'true' ? 'Participants' : 'Members'}
                        </Text>
                        {mockParticipants.map(participant => (
                            <Pressable
                                key={participant.id}
                                style={({ pressed }) => [
                                    styles.participantRow,
                                    pressed && styles.pressedRow
                                ]}
                            >
                                {participant.avatar ? (
                                    <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                                ) : (
                                    <View style={[styles.participantAvatar, styles.avatarPlaceholder]}>
                                        <Text style={styles.participantAvatarText}>{participant.name.charAt(0)}</Text>
                                    </View>
                                )}
                                <View style={styles.participantInfo}>
                                    <Text style={styles.participantName}>{participant.name}</Text>
                                    {participant.isOnline && (
                                        <Text style={styles.onlineStatus}>Online</Text>
                                    )}
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Settings</Text>
                        <Pressable
                            style={({ pressed }) => [
                                styles.settingRow,
                                pressed && styles.pressedRow
                            ]}
                        >
                            <Ionicons name="notifications-outline" size={22} color="#2C3E50" />
                            <Text style={styles.settingText}>Mute Notifications</Text>
                            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" style={styles.settingArrow} />
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.settingRow,
                                pressed && styles.pressedRow
                            ]}
                        >
                            <Ionicons name="image-outline" size={22} color="#2C3E50" />
                            <Text style={styles.settingText}>Media, Links, and Docs</Text>
                            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" style={styles.settingArrow} />
                        </Pressable>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.dangerButton,
                            pressed && styles.pressedDanger
                        ]}
                    >
                        <Text style={styles.dangerText}>Leave Chat</Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerContainer: {
        zIndex: 1,
    },
    androidHeader: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingHorizontal: 4,
        height: 52,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 32,
    },
    profileSection: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#7C4DFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    participantAvatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 4,
        color: '#2C3E50',
    },
    status: {
        fontSize: 16,
        color: '#65B741',
    },
    section: {
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    participantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    pressedRow: {
        backgroundColor: '#F5F7FA',
    },
    participantAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    participantInfo: {
        flex: 1,
    },
    participantName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
        color: '#2C3E50',
    },
    onlineStatus: {
        fontSize: 14,
        color: '#65B741',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#2C3E50',
        flex: 1,
    },
    settingArrow: {
        marginLeft: 'auto',
    },
    dangerButton: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    pressedDanger: {
        backgroundColor: '#FFF1F0',
    },
    dangerText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
}); 