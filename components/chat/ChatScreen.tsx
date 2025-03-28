import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { InputContainer } from '@/components/chat/InputContainer';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

const emptyStateImage = require('@/assets/images/empty-state.png');

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Effect to scroll when typing indicator appears
  React.useEffect(() => {
    if (isTyping) {
      // Small delay to ensure the footer is rendered
      setTimeout(scrollToBottom, 100);
    }
  }, [isTyping]);

  const EmptyChat = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={emptyStateImage}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>Start a Conversation</Text>
      <Text style={styles.emptyText}>
        Send a message to begin chatting with your AI assistant
      </Text>
    </View>
  );

  const handleSend = (content: { type: string; text?: string; file?: string }[]) => {
    const textContent = content.find(item => item.type === 'text');
    if (!textContent?.text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textContent.text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

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
      <Text style={[
        styles.messageText,
        { color: message.isUser ? '#FFFFFF' : '#2C3E50' }
      ]}>{message.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={scrollToBottom}
            ListFooterComponent={isTyping ? (
              <View style={styles.typingIndicator}>
                <TypingIndicator />
              </View>
            ) : null}
          />
        ) : (
          <EmptyChat />
        )}

        <InputContainer onSend={handleSend} setIsTyping={setIsTyping} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
    backgroundColor: '#7C4DFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    marginVertical: 12,
  },
  aiBubble: {
    backgroundColor: '#E8EAF6',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  typingIndicator: {
    maxWidth: '80%',
    marginTop: 4,
    marginBottom: 20,
    marginRight: 16,
    paddingVertical: 2,
    paddingHorizontal: 4,
    opacity: 0.7,
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#E8EAF6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyImage: {
    width: '80%',
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
});
