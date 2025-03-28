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
      <TextInput style={styles.input} value={inputText} onChangeText={handleChangeText} placeholder="Message AI..." placeholderTextColor="#666"
        multiline
        maxLength={1000} />
      <Pressable
        onPress={handleSend}
        style={({ pressed }) => [
          styles.sendButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <FontAwesome name="send" size={20} color="#007AFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 16,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    color: '#fff',
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
