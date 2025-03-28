import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { impactLight } from '../../lib/haptics';

type MessageContent = {
  type: 'text' | 'file';
  text?: string;
  file?: string;
};

interface InputContainerProps {
  onSend: (content: MessageContent[]) => void;
  setIsTyping?: (isTyping: boolean) => void;
}

export function InputContainer({ onSend, setIsTyping }: InputContainerProps) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    onSend([{
      type: 'text',
      text: inputText.trim()
    }]);

    setInputText('');
    impactLight();
  };

  const handleChangeText = (text: string) => {
    setInputText(text);
    setIsTyping?.(text.length > 0);
  };

  const handleFeatureComing = () => {
    Alert.alert('Coming Soon!', 'This feature will be available in a future update.');
    impactLight();
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Pressable onPress={handleFeatureComing} style={styles.iconButton}>
          <Ionicons name="image" size={22} color="#666" />
        </Pressable>

        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleChangeText}
          placeholder="Message AI..."
          placeholderTextColor="#9E9E9E"
          multiline
          maxLength={1000}
        />

        <Pressable
          onPress={inputText.trim() ? handleSend : handleFeatureComing}
          style={styles.iconButton}
        >
          <Ionicons
            name={inputText.trim() ? "send" : "mic"}
            size={22}
            color={inputText.trim() ? "#0066FF" : "#666"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 12,
    paddingBottom: 16,
    backgroundColor: '#F5F7FA',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    marginHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#2C3E50',
    fontSize: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
