import React from 'react';
import { StyleSheet, View, Image, Pressable, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

interface ChatHeaderProps {
    name: string;
    avatar?: string;
    status?: string;
    isGroup?: boolean;
    participants?: { id: string; name: string; avatar?: string }[];
}

export function ChatHeader({ name, avatar, status = 'Online', isGroup, participants }: ChatHeaderProps) {
    const router = useRouter();

    const HeaderContent = () => (
        <>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#000" />
            </Pressable>

            <Link href={{
                pathname: "/chat/settings",
                params: { name, isGroup: isGroup ? "true" : "false" }
            }} asChild>
                <Pressable style={styles.profileSection}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                        </View>
                    )}

                    <View style={styles.nameSection}>
                        <Text style={styles.name} numberOfLines={1}>{name}</Text>
                        <Text style={styles.status}>{status}</Text>
                    </View>
                </Pressable>
            </Link>

            <Link href={{
                pathname: "/chat/settings",
                params: { name, isGroup: isGroup ? "true" : "false" }
            }} asChild>
                <Pressable style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={22} color="#000" />
                </Pressable>
            </Link>
        </>
    );

    return Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="light" style={styles.header}>
            <HeaderContent />
        </BlurView>
    ) : (
        <View style={[styles.header, styles.androidHeader]}>
            <HeaderContent />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingHorizontal: 4,
        height: 52,
    },
    androidHeader: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E8EAF6',
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#7C4DFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nameSection: {
        marginLeft: 10,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    status: {
        fontSize: 13,
        color: '#65B741',
        marginTop: 1,
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 