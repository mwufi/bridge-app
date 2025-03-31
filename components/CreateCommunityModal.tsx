import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Modal, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type CreateCommunityModalProps = {
    visible: boolean;
    onClose: () => void;
    onCreateCommunity: (name: string, description: string) => void;
};

export function CreateCommunityModal({ visible, onClose, onCreateCommunity }: CreateCommunityModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = () => {
        if (name.trim() && description.trim()) {
            onCreateCommunity(name.trim(), description.trim());
            setName('');
            setDescription('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Create New Community</Text>
                            <TouchableOpacity onPress={onClose}>
                                <FontAwesome name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.scrollView}>
                            <View style={styles.form}>
                                <Text style={styles.label}>Community Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter community name"
                                    placeholderTextColor="#888"
                                    value={name}
                                    onChangeText={setName}
                                />

                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Describe your community"
                                    placeholderTextColor="#888"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    numberOfLines={4}
                                />

                                <TouchableOpacity
                                    style={[styles.createButton, (!name.trim() || !description.trim()) && styles.createButtonDisabled]}
                                    onPress={handleCreate}
                                    disabled={!name.trim() || !description.trim()}
                                >
                                    <Text style={styles.createButtonText}>Create Community</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    scrollView: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
    },
    form: {
        gap: 12,
    },
    label: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 12,
        color: '#FFF',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    createButton: {
        backgroundColor: '#FF3366',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    createButtonDisabled: {
        backgroundColor: '#666',
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 