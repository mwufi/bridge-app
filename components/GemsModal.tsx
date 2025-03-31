import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';

interface GemsModalProps {
    visible: boolean;
    onClose: () => void;
    gemCount: number;
}

export const GemsModal: React.FC<GemsModalProps> = ({ visible, onClose, gemCount }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.gemsModalContainer}>
                <View style={styles.gemsModalContent}>
                    <TouchableOpacity
                        style={styles.gemsModalCloseButton}
                        onPress={onClose}
                    >
                        <FontAwesome name="times" size={20} color="#888" />
                    </TouchableOpacity>

                    <Text style={styles.gemsModalTitle}>Congratulations!</Text>
                    <Text style={styles.gemsModalSubtitle}>You discovered the gems feature</Text>

                    <View style={styles.gemsModalIconContainer}>
                        <FontAwesome name="diamond" size={60} color="#4FACFE" />
                        <Text style={styles.gemsModalGemCount}>{gemCount}</Text>
                    </View>

                    <Text style={styles.gemsModalDescription}>
                        Gems are needed for Ara to run. Gems are consumed when you chat with Ara.
                    </Text>

                    <TouchableOpacity style={styles.gemsModalButton}>
                        <Text style={styles.gemsModalButtonText}>Get 1000 gems for $2</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gemsModalLearnMore}>
                        <Text style={styles.gemsModalLearnMoreText}>Learn more</Text>
                        <FontAwesome name="chevron-right" size={12} color="#4FACFE" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    gemsModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    gemsModalContent: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        position: 'relative',
    },
    gemsModalCloseButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gemsModalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    gemsModalSubtitle: {
        fontSize: 16,
        color: '#AAA',
        marginBottom: 24,
        textAlign: 'center',
    },
    gemsModalIconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    gemsModalGemCount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4FACFE',
        marginTop: 12,
    },
    gemsModalDescription: {
        fontSize: 14,
        color: '#CCC',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    gemsModalButton: {
        backgroundColor: '#4FACFE',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    gemsModalButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
    gemsModalLearnMore: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gemsModalLearnMoreText: {
        color: '#4FACFE',
        fontSize: 14,
        marginRight: 4,
    },
});