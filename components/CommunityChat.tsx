import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Message = {
    id: string;
    userName: string;
    content: string;
    timePosted: string;
    userImage?: any;
};

type CommunityChatProps = {
    communityName: string;
    messages: Message[];
    onSendMessage: (content: string) => void;
};

export function CommunityChat({ communityName, messages, onSendMessage }: CommunityChatProps) {
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
            // Scroll to bottom after sending
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={styles.messageContainer}>
            <Image
                source={item.userImage || require('@/assets/images/icon.png')}
                style={styles.userImage}
            />
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.timePosted}>{item.timePosted}</Text>
                </View>
                <Text style={styles.messageText}>{item.content}</Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                    <FontAwesome name="plus" size={20} color="#888" />
                </TouchableOpacity>

                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#888"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                        blurOnSubmit={false}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        !newMessage.trim() && styles.sendButtonDisabled
                    ]}
                    onPress={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <FontAwesome
                        name="paper-plane"
                        size={20}
                        color={newMessage.trim() ? "#FFF" : "#555"}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    messagesList: {
        padding: 16,
        paddingBottom: 80, // Add extra padding at bottom for input
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        marginRight: 8,
    },
    timePosted: {
        fontSize: 12,
        color: '#888',
    },
    messageText: {
        fontSize: 16,
        color: '#FFF',
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#222',
        backgroundColor: '#000',
    },
    attachButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInputContainer: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        maxHeight: 120,
    },
    textInput: {
        fontSize: 16,
        color: '#FFF',
        paddingVertical: 10,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF3366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#333',
    },
}); 