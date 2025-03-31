import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';

const modelOptions = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most advanced capabilities' },
  { id: 'gpt-3.5', name: 'GPT-3.5', description: 'Fast and capable' },
  { id: 'claude-3', name: 'Claude 3', description: 'Anthropic\'s balanced AI' },
];

const personalityOptions = [
  { id: 'standard', name: 'Standard', description: 'Helpful and balanced' },
  { id: 'creative', name: 'Creative', description: 'More imaginative responses' },
  { id: 'concise', name: 'Concise', description: 'Brief, to-the-point answers' },
  { id: 'genz', name: 'Gen Z', description: 'Uses current internet lingo' },
];

export default function ChatSettingsScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string, name: string }>();
  
  const [selectedModel, setSelectedModel] = useState('claude-3');
  const [selectedPersonality, setSelectedPersonality] = useState('standard');
  const [isSummaryEnabled, setIsSummaryEnabled] = useState(true);
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleClearConversation = () => {
    // Implement clear conversation logic
    console.log('Clear conversation for chat ID:', id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="chevron-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Chat Settings</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chatInfoSection}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={64} color="#FFF" />
          </View>
          <Text style={styles.chatName}>{name || 'Chat'}</Text>
          <Text style={styles.chatId}>ID: {id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Model</Text>
          <Text style={styles.sectionDescription}>Select which AI model powers this chat</Text>
          
          {modelOptions.map((model) => (
            <TouchableOpacity 
              key={model.id} 
              style={[styles.optionItem, selectedModel === model.id && styles.selectedOption]}
              onPress={() => setSelectedModel(model.id)}
            >
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{model.name}</Text>
                <Text style={styles.optionDescription}>{model.description}</Text>
              </View>
              {selectedModel === model.id && (
                <FontAwesome name="check-circle" size={24} color="#FF3366" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality</Text>
          <Text style={styles.sectionDescription}>Choose how this AI responds</Text>
          
          {personalityOptions.map((personality) => (
            <TouchableOpacity 
              key={personality.id} 
              style={[styles.optionItem, selectedPersonality === personality.id && styles.selectedOption]}
              onPress={() => setSelectedPersonality(personality.id)}
            >
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{personality.name}</Text>
                <Text style={styles.optionDescription}>{personality.description}</Text>
              </View>
              {selectedPersonality === personality.id && (
                <FontAwesome name="check-circle" size={24} color="#FF3366" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.toggleItem}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Conversation Summary</Text>
              <Text style={styles.toggleDescription}>Generate summaries of long conversations</Text>
            </View>
            <Switch
              value={isSummaryEnabled}
              onValueChange={setIsSummaryEnabled}
              trackColor={{ false: '#444', true: '#FF3366' }}
              thumbColor="#FFF"
            />
          </View>
          
          <View style={styles.toggleItem}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Remember History</Text>
              <Text style={styles.toggleDescription}>Allow AI to recall previous conversations</Text>
            </View>
            <Switch
              value={isHistoryEnabled}
              onValueChange={setIsHistoryEnabled}
              trackColor={{ false: '#444', true: '#FF3366' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearConversation}>
            <FontAwesome name="trash-o" size={20} color="#FFF" style={styles.dangerIcon} />
            <Text style={styles.dangerButtonText}>Clear Conversation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  chatInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  chatName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  chatId: {
    fontSize: 14,
    color: '#888',
  },
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
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 10,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#AAA',
  },
  dangerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#6B1A1A',
    borderRadius: 12,
  },
  dangerIcon: {
    marginRight: 10,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});