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
    Modal,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import ProfileScreen from '@/components/profile/ProfileScreen';

const { height } = Dimensions.get('window');

type Message = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
};

export default function GenZChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [showProfile, setShowProfile] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const keyboardHeight = useRef(new Animated.Value(0));

    // Auto focus on mount
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        // Add keyboard event listeners
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (event) => {
                Animated.timing(keyboardHeight.current, {
                    toValue: event.endCoordinates.height,
                    duration: 250,
                    useNativeDriver: false,
                }).start();
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                Animated.timing(keyboardHeight.current, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    // Scroll to bottom when messages change or keyboard height changes
    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages, keyboardHeight.current]);

    // Animation values for new messages
    const messageAnimations = useRef<{ [key: string]: { opacity: Animated.Value; scale: Animated.Value } }>({});

    const animateNewMessage = (messageId: string) => {
        const opacity = new Animated.Value(0);
        const scale = new Animated.Value(0.8);
        messageAnimations.current[messageId] = { opacity, scale };

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        inputRef.current?.focus();

        // Scroll after the message is added
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "literally me rn",
                "omg bestie I totally get what you're saying! that's exactly how I've been feeling lately and it's like nobody else understands but you just GET IT fr fr",
                "periodt",
                "slay queen! you're absolutely spitting facts and I'm here for every single word of it. keep that energy because you're literally changing lives rn",
                "no cap detected",
                "based and redpilled fr fr, you're speaking straight facts and everyone needs to hear this. the way you just explained that was absolutely perfect",
                "fr fr no cap",
                "vibe check passed 100%, you're literally radiating the most immaculate energy rn and I'm totally here for it. keep blessing us with these god tier takes",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.chatContainer}>
                    <View style={styles.header}>
                        <View style={styles.labelContainer}>
                            <View style={styles.labelBackground}>
                                <Text style={styles.label}>ARA</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => setShowProfile(true)}
                        >
                            <View style={styles.profilePicContainer}>
                                <FontAwesome name="user-circle" size={32} color="#FFFFFF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Animated.ScrollView
                        ref={scrollViewRef}
                        style={[
                            styles.scrollView,
                            {
                                paddingBottom: keyboardHeight.current,
                            },
                        ]}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {messages.map((message) => {
                            if (!messageAnimations.current[message.id]) {
                                animateNewMessage(message.id);
                            }
                            const { opacity, scale } = messageAnimations.current[message.id];

                            return (
                                <Animated.View
                                    key={message.id}
                                    style={[
                                        styles.messageContainer,
                                        message.isUser ? styles.userMessage : styles.assistantMessage,
                                        {
                                            opacity,
                                            transform: [{ scale }],
                                        },
                                    ]}
                                >
                                    <Text style={styles.messageText}>{message.text}</Text>
                                </Animated.View>
                            );
                        })}
                    </Animated.ScrollView>
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

            <Modal
                visible={showProfile}
                animationType="fade"
                presentationStyle="fullScreen"
            >
                <ProfileScreen onClose={() => setShowProfile(false)} />
            </Modal>
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
    chatContainer: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    labelContainer: {
        backgroundColor: 'transparent',
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
        paddingTop: 60,
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
        paddingBottom: 40,
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
    profileButton: {
        padding: 5,
    },
    profilePicContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF3366',
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 