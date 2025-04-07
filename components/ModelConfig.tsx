import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import db from '@/lib/instant';

interface ModelConfigProps {
    selectedModel: string;
    onModelChange: (modelId: string) => void;
}

interface ModelOption {
    id: string;
    name: string;
    description: string;
}

export default function ModelConfig({ selectedModel, onModelChange }: ModelConfigProps) {
    const { data, isLoading: modelConfigLoading, error: modelConfigError } = db.useQuery({
        "dev.config": {
            $: {
                where: {
                    name: "prod_model_options"
                }
            }
        }
    });

    if (modelConfigLoading) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Model</Text>
                <Text style={styles.sectionDescription}>Loading model options...</Text>
            </View>
        );
    }

    if (modelConfigError) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Model</Text>
                <Text style={styles.sectionDescription}>Error loading model options</Text>
            </View>
        );
    }

    const modelConfig = data?.["dev.config"][0]

    console.log(modelConfig && modelConfig.value);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Model</Text>
            <Text style={styles.sectionDescription}>Select which AI model powers this chat</Text>

            {modelConfig?.value?.map((model: ModelOption) => (
                <TouchableOpacity
                    key={model.id}
                    style={[styles.optionItem, selectedModel === model.id && styles.selectedOption]}
                    onPress={() => onModelChange(model.id)}
                >
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>{model.name}</Text>
                        <Text style={styles.optionDescription}>{model.description || ''}</Text>
                    </View>
                    {selectedModel === model.id && (
                        <FontAwesome name="check-circle" size={24} color="#FF3366" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        marginBottom: 10,
    },
    selectedOption: {
        borderWidth: 1,
        borderColor: '#FF3366',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: '#AAA',
    },
}); 