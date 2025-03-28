import React, { useState, useRef } from 'react';
import {
  View as RNView,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { impactLight } from '../../lib/haptics';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    impactLight();

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help! What would you like to discuss?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <View style={[
      styles.messageBubble,
      message.isUser ? styles.userBubble : styles.aiBubble
    ]}>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      
      {isTyping && (
        <BlurView intensity={50} style={styles.typingIndicator}>
          <Text style={styles.typingText}>AI is typing...</Text>
        </BlurView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message AI..."
          placeholderTextColor="#666"
          multiline
          maxLength={1000}
        />
        <Pressable 
          onPress={sendMessage}
          style={({ pressed }) => [
            styles.sendButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <FontAwesome name="send" size={20} color="#007AFF" />
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: 16
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 16,
    alignItems: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    backgroundColor: '#000',
  },
  input: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  typingIndicator: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    borderRadius: 16,
    padding: 8,
    paddingHorizontal: 12,
  },
  typingText: {
    color: '#fff',
    fontSize: 14,
  },
});
