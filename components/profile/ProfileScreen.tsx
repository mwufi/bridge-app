import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

type ProfileScreenProps = {
    onClose: () => void;
};

export default function ProfileScreen({ onClose }: ProfileScreenProps) {
    const [name, setName] = useState('Your Name');
    const [preferences, setPreferences] = useState({
        darkMode: true,
        notifications: true,
        language: 'English'
    });
    const [friends, setFriends] = useState<string[]>([]);
    const [feedback, setFeedback] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const handleAddFriend = () => {
        // TODO: Implement friend adding logic
        setFriends([...friends, 'New Friend']);
    };

    const handleSubmitFeedback = () => {
        // TODO: Implement feedback submission
        setFeedback('');
    };

    const handleFeedbackFocus = () => {
        // Add a small delay to ensure the keyboard is shown
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesome name="times" size={24} color="#FFFFFF" />
                    </TouchableOpacity> */}
                    <Text style={styles.title}>Profile</Text>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <FontAwesome name="user-circle" size={80} color="#FFFFFF" />
                        </View>
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#666666"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>
                        <TouchableOpacity
                            style={styles.preferenceItem}
                            onPress={() => setPreferences({ ...preferences, darkMode: !preferences.darkMode })}
                        >
                            <Text style={styles.preferenceText}>Dark Mode</Text>
                            <FontAwesome
                                name={preferences.darkMode ? "toggle-on" : "toggle-off"}
                                size={24}
                                color={preferences.darkMode ? "#FF3366" : "#666666"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.preferenceItem}
                            onPress={() => setPreferences({ ...preferences, notifications: !preferences.notifications })}
                        >
                            <Text style={styles.preferenceText}>Notifications</Text>
                            <FontAwesome
                                name={preferences.notifications ? "toggle-on" : "toggle-off"}
                                size={24}
                                color={preferences.notifications ? "#FF3366" : "#666666"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Friends</Text>
                        {friends.map((friend, index) => (
                            <View key={index} style={styles.friendItem}>
                                <FontAwesome name="user-circle" size={24} color="#FFFFFF" />
                                <Text style={styles.friendText}>{friend}</Text>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
                            <Text style={styles.addButtonText}>Add Friend</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Feedback</Text>
                        <TextInput
                            style={[styles.input, styles.feedbackInput]}
                            value={feedback}
                            onChangeText={setFeedback}
                            placeholder="Share your thoughts..."
                            placeholderTextColor="#666666"
                            multiline
                            numberOfLines={4}
                            onFocus={handleFeedbackFocus}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
                            <Text style={styles.submitButtonText}>Submit Feedback</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        backgroundColor: '#000000',
    },
    closeButton: {
        marginRight: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#000000',
    },
    avatarSection: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        backgroundColor: '#000000',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FF3366',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    changePhotoButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    changePhotoText: {
        color: '#FF3366',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        backgroundColor: '#000000',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        padding: 15,
        color: '#FFFFFF',
        fontSize: 16,
    },
    feedbackInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    preferenceText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    friendText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 10,
    },
    addButton: {
        backgroundColor: '#FF3366',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#FF3366',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 