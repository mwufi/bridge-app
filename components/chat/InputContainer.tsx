import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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

  return (
    <View style={styles.inputContainer}>
      <TextInput style={styles.input} value={inputText} onChangeText={handleChangeText} placeholder="Message AI..." placeholderTextColor="#9E9E9E"
        multiline
        maxLength={1000} />
      <Pressable
        onPress={handleSend}
        style={({ pressed }) => [
          styles.sendButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <FontAwesome name="send" size={20} color="#7C4DFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    paddingBottom: 8,
    alignItems: 'flex-end',
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    color: '#2C3E50',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
