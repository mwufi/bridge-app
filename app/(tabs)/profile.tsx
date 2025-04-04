import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Switch,
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

// Sample user data
const userData = {
    name: 'Zen',
    username: '@zenzen',
    bio: 'Exploring mindfulness and creativity. One day at a time. ✨',
    streak: 7,
    totalEntries: 42,
    achievements: 12,
    level: 'Explorer',
    progress: 75,
};

// Sample achievements
const achievements = [
    { id: '1', title: 'Early Bird', icon: 'sun', description: 'Complete 5 morning reflections' },
    { id: '2', title: 'Mindful Master', icon: 'spa', description: 'Practice mindfulness for 10 days' },
    { id: '3', title: 'Creative Soul', icon: 'palette', description: 'Complete 3 creative challenges' },
];

// Sample settings
const settingsSections = [
    {
        title: 'Preferences',
        items: [
            { id: 'notifications', label: 'Push Notifications', type: 'toggle' },
            { id: 'darkMode', label: 'Dark Mode', type: 'toggle' },
            { id: 'language', label: 'Language', type: 'select', value: 'English' },
        ],
    },
    {
        title: 'Account',
        items: [
            { id: 'privacy', label: 'Privacy Settings', type: 'link' },
            { id: 'export', label: 'Export Data', type: 'link' },
            { id: 'help', label: 'Help & Support', type: 'link' },
        ],
    },
];

export default function ProfileScreen() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
    });

    const handleSettingToggle = (settingId: string) => {
        setSettings(prev => ({
            ...prev,
            [settingId]: !prev[settingId],
        }));
    };

    const renderAchievement = (achievement) => (
        <View key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
                <FontAwesome5 name={achievement.icon} size={24} color={LIGHT_THEME.accent} />
            </View>
            <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
        </View>
    );

    const renderSettingItem = (item) => {
        switch (item.type) {
            case 'toggle':
                return (
                    <View key={item.id} style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Switch
                            value={settings[item.id]}
                            onValueChange={() => handleSettingToggle(item.id)}
                            trackColor={{ false: '#D1D1D6', true: LIGHT_THEME.accent }}
                            thumbColor={LIGHT_THEME.background}
                        />
                    </View>
                );
            case 'select':
                return (
                    <TouchableOpacity key={item.id} style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <View style={styles.settingValue}>
                            <Text style={styles.settingValueText}>{item.value}</Text>
                            <FontAwesome5 name="chevron-right" size={14} color={LIGHT_THEME.text} />
                        </View>
                    </TouchableOpacity>
                );
            case 'link':
                return (
                    <TouchableOpacity key={item.id} style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <FontAwesome5 name="chevron-right" size={14} color={LIGHT_THEME.text} />
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.profileInfo}>
                        <Image
                            source={require('@/assets/images/icon.png')}
                            style={styles.profileImage}
                        />
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{userData.name}</Text>
                            <Text style={styles.username}>{userData.username}</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <FontAwesome5 name="edit" size={16} color={LIGHT_THEME.accent} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.bio}>{userData.bio}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userData.streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userData.totalEntries}</Text>
                        <Text style={styles.statLabel}>Entries</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userData.achievements}</Text>
                        <Text style={styles.statLabel}>Achievements</Text>
                    </View>
                </View>

                {/* Level Progress */}
                <View style={styles.levelCard}>
                    <View style={styles.levelHeader}>
                        <Text style={styles.levelTitle}>{userData.level}</Text>
                        <Text style={styles.levelProgress}>{userData.progress}%</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View
                            style={[styles.progressBar, { width: `${userData.progress}%` }]}
                        />
                    </View>
                </View>

                {/* Recent Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Achievements</Text>
                    <View style={styles.achievementsContainer}>
                        {achievements.map(renderAchievement)}
                    </View>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    {settingsSections.map((section) => (
                        <View key={section.title} style={styles.settingsSection}>
                            <Text style={styles.settingsSectionTitle}>{section.title}</Text>
                            <View style={styles.settingsCard}>
                                {section.items.map(renderSettingItem)}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <FontAwesome5 name="sign-out-alt" size={16} color="#FF3B30" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
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
        padding: 20,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: LIGHT_THEME.accent,
    },
    nameContainer: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: LIGHT_THEME.text,
    },
    username: {
        fontSize: 16,
        color: LIGHT_THEME.text,
        opacity: 0.7,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: LIGHT_THEME.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bio: {
        fontSize: 16,
        color: LIGHT_THEME.text,
        lineHeight: 22,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: LIGHT_THEME.card,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: LIGHT_THEME.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.7,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: LIGHT_THEME.secondary,
    },
    levelCard: {
        backgroundColor: LIGHT_THEME.card,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: LIGHT_THEME.text,
    },
    levelProgress: {
        fontSize: 16,
        color: LIGHT_THEME.accent,
        fontWeight: '600',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: LIGHT_THEME.secondary,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: LIGHT_THEME.accent,
        borderRadius: 4,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: LIGHT_THEME.text,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    achievementsContainer: {
        paddingHorizontal: 20,
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LIGHT_THEME.card,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    achievementIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: LIGHT_THEME.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: LIGHT_THEME.text,
        marginBottom: 4,
    },
    achievementDescription: {
        fontSize: 14,
        color: LIGHT_THEME.text,
        opacity: 0.7,
    },
    settingsSection: {
        marginBottom: 20,
    },
    settingsSectionTitle: {
        fontSize: 16,
        color: LIGHT_THEME.text,
        opacity: 0.7,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    settingsCard: {
        backgroundColor: LIGHT_THEME.card,
        marginHorizontal: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: LIGHT_THEME.secondary,
    },
    settingLabel: {
        fontSize: 16,
        color: LIGHT_THEME.text,
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValueText: {
        fontSize: 16,
        color: LIGHT_THEME.text,
        opacity: 0.7,
        marginRight: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 30,
        padding: 15,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 15,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
        marginLeft: 10,
    },
}); 