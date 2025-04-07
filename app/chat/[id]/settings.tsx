import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Switch, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import db from '@/lib/instant';
import ModelConfig from '@/components/ModelConfig';

const personalityOptions = [
  { id: 'standard', name: 'Standard', description: 'Helpful and balanced' },
  { id: 'creative', name: 'Creative', description: 'More imaginative responses' },
  { id: 'concise', name: 'Concise', description: 'Brief, to-the-point answers' },
  { id: 'genz', name: 'Gen Z', description: 'Uses current internet lingo' },
];

export default function ChatSettingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isSystemPromptModalVisible, setIsSystemPromptModalVisible] = useState(false);
  const [isMemoriesModalVisible, setIsMemoriesModalVisible] = useState(false);
  const [isChatNameModalVisible, setIsChatNameModalVisible] = useState(false);
  const [tempSystemPrompt, setTempSystemPrompt] = useState('');
  const [tempMemories, setTempMemories] = useState('');
  const [tempChatName, setTempChatName] = useState('');

  // Use InstantDB query directly to get the conversation data
  const { data, error, isLoading } = db.useQuery({
    conversations: {
      $: {
        where: {
          id: id
        }
      },
    }
  });

  const conversation = data?.conversations?.[0];
  const [chatName, setChatName] = useState('');
  const botInfo = conversation?.data?.botInfo || {};

  // Set chat name when data loads
  useEffect(() => {
    if (conversation) {
      setChatName(conversation.name || 'Chat');
    }
  }, [conversation]);

  const systemPrompt = botInfo.systemPrompt || '';
  const memories = botInfo.memories || '';
  const selectedModel = botInfo.model || 'gpt-4o';
  const isProactiveEnabled = botInfo.features?.proactivePrompts || false;
  // Handle explicitly false values correctly
  const isRememberAcrossConvosEnabled = botInfo.features?.rememberAcrossConvos === false ? false : true;

  // Save changes to InstantDB
  const saveChanges = async (field: string, value: any) => {
    if (!id) return;

    const updatedBotInfo = {
      ...botInfo,
      [field]: value
    };

    // For nested fields like features
    if (field === 'features') {
      updatedBotInfo.features = {
        ...(botInfo?.features || {}),
        ...value
      };
    }

    await db.transact([
      db.tx.conversations[id as string].merge({
        data: {
          botInfo: updatedBotInfo
        }
      })
    ]);
  };

  const updateModel = async (modelId: string) => {
    await saveChanges('model', modelId);
  };

  const openSystemPromptModal = () => {
    setTempSystemPrompt(systemPrompt);
    setIsSystemPromptModalVisible(true);
  };

  const updateSystemPrompt = async () => {
    await saveChanges('systemPrompt', tempSystemPrompt);
    setIsSystemPromptModalVisible(false);
  };

  const openMemoriesModal = () => {
    setTempMemories(memories);
    setIsMemoriesModalVisible(true);
  };

  const updateMemories = async () => {
    await saveChanges('memories', tempMemories);
    setIsMemoriesModalVisible(false);
  };

  const openChatNameModal = () => {
    setTempChatName(chatName);
    setIsChatNameModalVisible(true);
  };

  const updateChatName = async () => {
    if (!id || !tempChatName.trim()) return;

    await db.transact([
      db.tx.conversations[id as string].update({
        name: tempChatName.trim()
      })
    ]);

    setChatName(tempChatName.trim());
    setIsChatNameModalVisible(false);
  };

  const updateProactivePrompts = async (value: boolean) => {
    await saveChanges('features', { proactivePrompts: value });
  };

  const updateRememberAcrossConvos = async (value: boolean) => {
    await saveChanges('features', { rememberAcrossConvos: value });
  };

  const handleBack = () => {
    router.back();
  };

  const handleClearConversation = () => {
    // Implement clear conversation logic
    console.log('Clear conversation for chat ID:', id);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={styles.chatNameContainer}>
            <Text style={styles.chatName}>{chatName}</Text>
            <TouchableOpacity onPress={openChatNameModal} style={styles.editNameButton}>
              <Feather name="edit-2" size={16} color="#FF3366" />
            </TouchableOpacity>
          </View>
          <Text style={styles.chatId}>ID: {id}</Text>

          <Modal
            visible={isChatNameModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Chat Name</Text>
                <TextInput
                  style={[styles.textInput, styles.chatNameInput]}
                  value={tempChatName}
                  onChangeText={setTempChatName}
                  placeholder="Enter chat name..."
                  placeholderTextColor="#888"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsChatNameModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={updateChatName}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <ModelConfig
          selectedModel={selectedModel}
          onModelChange={updateModel}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality</Text>
          <Text style={styles.sectionDescription}>Choose how this AI responds</Text>

          {personalityOptions.map((personality) => (
            <TouchableOpacity
              key={personality.id}
              style={[styles.optionItem, botInfo.personality === personality.id && styles.selectedOption]}
              onPress={() => saveChanges('personality', personality.id)}
            >
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{personality.name}</Text>
                <Text style={styles.optionDescription}>{personality.description}</Text>
              </View>
              {botInfo.personality === personality.id && (
                <FontAwesome name="check-circle" size={24} color="#FF3366" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Prompt</Text>
          <Text style={styles.sectionDescription}>Instructions that guide the AI's behavior</Text>

          <TouchableOpacity
            style={styles.promptContainer}
            onPress={openSystemPromptModal}
          >
            <View style={styles.promptTextContainer}>
              <Text style={styles.promptPreview} numberOfLines={2}>
                {systemPrompt || 'No system prompt set. Tap to add one.'}
              </Text>
            </View>
            <Feather name="edit-2" size={20} color="#FF3366" />
          </TouchableOpacity>

          <Modal
            visible={isSystemPromptModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit System Prompt</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  value={tempSystemPrompt}
                  onChangeText={setTempSystemPrompt}
                  placeholder="Enter instructions for the AI..."
                  placeholderTextColor="#888"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsSystemPromptModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={updateSystemPrompt}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Memories</Text>
          <Text style={styles.sectionDescription}>Facts the AI will remember about you</Text>

          <TouchableOpacity
            style={styles.promptContainer}
            onPress={openMemoriesModal}
          >
            <View style={styles.promptTextContainer}>
              <Text style={styles.promptPreview} numberOfLines={2}>
                {memories || 'No memories set. Tap to add some.'}
              </Text>
            </View>
            <Feather name="edit-2" size={20} color="#FF3366" />
          </TouchableOpacity>

          <Modal
            visible={isMemoriesModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Memories</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  value={tempMemories}
                  onChangeText={setTempMemories}
                  placeholder="Enter facts for the AI to remember..."
                  placeholderTextColor="#888"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsMemoriesModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={updateMemories}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.toggleItem}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Proactive Prompts</Text>
              <Text style={styles.toggleDescription}>Allow bot to send you notifications</Text>
            </View>
            <Switch
              value={isProactiveEnabled}
              onValueChange={updateProactivePrompts}
              trackColor={{ false: '#444', true: '#FF3366' }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Remember Across Convos</Text>
              <Text style={styles.toggleDescription}>Let AI access past conversations</Text>
            </View>
            <Switch
              value={isRememberAcrossConvosEnabled}
              onValueChange={updateRememberAcrossConvos}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
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
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  editNameButton: {
    marginLeft: 8,
    padding: 4,
  },
  chatNameInput: {
    minHeight: 50,
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
  promptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 10,
  },
  promptTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  promptPreview: {
    fontSize: 14,
    color: '#DDD',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#FF3366',
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
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