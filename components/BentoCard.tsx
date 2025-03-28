import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Animated,
    TextInput,
    Modal,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TabType } from './TabsFilter';
import { BlurView } from 'expo-blur';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export type BentoCardData = {
    id: string;
    type: 'voice' | 'text' | 'image' | 'reminder';
    title: string;
    content: string;
    time: string;
    color: string;
    span?: 'full' | 'half';
    category?: TabType;
    isNew?: boolean;
};

interface BentoCardProps {
    card: BentoCardData;
    inModal?: boolean;
}

function BentoCardContent({ card, inModal }: BentoCardProps) {
    return (
        <>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardTime}>{card.time}</Text>
            </View>
            <Text style={[styles.cardText, inModal && styles.modalCardText]}>
                {card.content}
            </Text>
            {card.type === 'voice' && (
                <View style={styles.waveform}>
                    {[...Array(8)].map((_, i) => (
                        <View key={i} style={styles.waveformBar} />
                    ))}
                </View>
            )}
        </>
    );
}
export function BentoCard({ card }: BentoCardProps) {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [replyText, setReplyText] = useState('');
    const inputRef = useRef<TextInput>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsModalVisible(true);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        });
    };

    const handleSubmit = () => {
        if (replyText.trim()) {
            setIsModalVisible(false);
            router.push({
                pathname: '/chat',
                params: {
                    replyTo: card.id,
                    initialMessage: replyText.trim(),
                }
            });
        }
    };

    const closeModal = () => {
        Keyboard.dismiss();
        setIsModalVisible(false);
        setReplyText('');
    };

    return (
        <>
            <Animated.View
                style={[
                    styles.card,
                    { backgroundColor: card.color },
                    card.span === 'full' ? styles.fullCard : styles.halfCard,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <Pressable onPress={handlePress}>
                    <View style={styles.cardContent}>
                        <BentoCardContent card={card} />
                    </View>
                </Pressable>
            </Animated.View>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <BlurView tint="systemThickMaterialLight" intensity={20} style={StyleSheet.absoluteFill} />
                        <TouchableWithoutFeedback>
                            <View style={[styles.modalCard, { backgroundColor: card.color }]}>
                                <BentoCardContent card={card} />
                                <View style={styles.replyContainer}>
                                    <TextInput
                                        ref={inputRef}
                                        style={styles.replyInput}
                                        placeholder="Type a quick reply..."
                                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                        value={replyText}
                                        onChangeText={setReplyText}
                                        onSubmitEditing={handleSubmit}
                                        onBlur={closeModal}
                                        returnKeyType="send"
                                        multiline
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <Text>Hello</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    fullCard: {
        width: '100%',
    },
    halfCard: {
        width: '48%',
        flex: 1,
        flexBasis: '45%',
    },
    cardContent: {
        flex: 1,
    },
    modalCardContent: {
        paddingBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cardTime: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    cardText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    waveform: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        height: 40,
        gap: 2,
    },
    waveformBar: {
        width: 3,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 1.5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    modalCard: {
        borderRadius: 24,
        padding: 20,
        maxHeight: '80%',
        elevation: 16,
        marginBottom: 100
    },
    replyContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        paddingTop: 12,
    },
    replyInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 16,
        minHeight: 44,
        maxHeight: 120,
    },
    modalCardText: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 1,
    },
}); 