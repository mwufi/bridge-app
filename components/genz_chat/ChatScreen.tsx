import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

type Message = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
};

export default function GenZChatScreen() {
    const [userMessage, setUserMessage] = useState<string>('');
    const [assistantMessage, setAssistantMessage] = useState<string>('');
    const [inputText, setInputText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const inputRef = useRef<TextInput>(null);
    const assistantScrollRef = useRef<ScrollView>(null);
    const userScrollRef = useRef<ScrollView>(null);

    // Auto focus on mount
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (userMessage) {
            userScrollRef.current?.scrollToEnd({ animated: true });
        }
    }, [userMessage]);

    useEffect(() => {
        if (assistantMessage) {
            assistantScrollRef.current?.scrollToEnd({ animated: true });
        }
    }, [assistantMessage]);

    // Animation values
    const userOpacity = new Animated.Value(0);
    const assistantOpacity = new Animated.Value(0);
    const userScale = new Animated.Value(0.8);
    const assistantScale = new Animated.Value(0.8);

    // Simulate typing effect
    useEffect(() => {
        if (userMessage) {
            Animated.parallel([
                Animated.timing(userOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(userScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [userMessage]);

    useEffect(() => {
        if (assistantMessage) {
            Animated.parallel([
                Animated.timing(assistantOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(assistantScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [assistantMessage]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        setUserMessage(inputText);
        setInputText('');
        inputRef.current?.focus();

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "literally me rn",
                "bestie you're so right",
                "periodt",
                "slay",
                "no cap detected",
                "based and redpilled",
                "fr fr no cap",
                "vibe",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setAssistantMessage(randomResponse);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.assistantSection}>
                    <View style={styles.labelContainer}>
                        <View style={styles.labelBackground}>
                            <Text style={styles.label}>ARA</Text>
                        </View>
                    </View>
                    <ScrollView
                        ref={assistantScrollRef}
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <Animated.View style={[
                            styles.messageContainer,
                            styles.assistantMessage,
                            {
                                opacity: assistantOpacity,
                                transform: [{ scale: assistantScale }],
                            },
                        ]}>
                            <Text style={styles.messageText}>{assistantMessage}</Text>
                        </Animated.View>
                    </ScrollView>
                </View>

                <View style={styles.userSection}>
                    <View style={styles.labelContainer}>
                        <View style={styles.labelBackground}>
                            <Text style={styles.label}>YOU</Text>
                        </View>
                    </View>
                    <ScrollView
                        ref={userScrollRef}
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <Animated.View style={[
                            styles.messageContainer,
                            styles.userMessage,
                            {
                                opacity: userOpacity,
                                transform: [{ scale: userScale }],
                            },
                        ]}>
                            <Text style={styles.messageText}>{userMessage}</Text>
                        </Animated.View>
                    </ScrollView>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="type something..."
                        placeholderTextColor="#666666"
                        multiline
                        maxLength={100}
                        onSubmitEditing={handleSend}
                        autoFocus
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                    >
                        <Text style={styles.sendButtonText}>SEND</Text>
                    </TouchableOpacity>
                </View>
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
    assistantSection: {
        flex: 1,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        position: 'relative',
    },
    userSection: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    labelBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 8,
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    scrollView: {
        flex: 1,
        paddingTop: 60, // Add space for the floating label
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },
    messageContainer: {
        padding: 20,
        borderRadius: 20,
        maxWidth: '80%',
        marginBottom: 10,
    },
    assistantMessage: {
        backgroundColor: '#FF3366',
        alignSelf: 'flex-start',
    },
    userMessage: {
        backgroundColor: '#00FF99',
        alignSelf: 'flex-end',
    },
    messageText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        flexWrap: 'wrap',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#000000',
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    input: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#FF3366',
        borderRadius: 25,
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
    },
}); 