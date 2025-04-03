import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import db from '@/lib/instant';
import { id } from '@instantdb/react-native';

const emptyStateImage = require('@/assets/images/empty-state.png');

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
};

// Sample predefined responses for different personalities
const personalityResponses = {
  '1': ["I'm here to help! What would you like to discuss?", "That's an interesting topic. Let me share some thoughts..."],
  '2': ["No cap fr fr, what's good?", "That's so based! I'm vibing with what you're saying."],
  '3': ["What words shall dance upon the page today?", "The universe speaks through us, a symphony of thought..."],
  '4': ["Would you like a recipe suggestion based on that?", "I know many delightful dishes that incorporate those ingredients."],
  '5': ["Let's explore that topic together. What aspect interests you most?", "I have several resources that might help with that question."],
};

type ChatScreenProps = {
  chatId?: string;
};

function addToChat(content: string, role: "user" | "assistant", chatId: string) {
  const newMessage = { content, role, createdAt: new Date().toISOString() }
  const newMessageId = id()

  // persist the message
  db.transact([
    db.tx.messages[newMessageId].update(newMessage).link({ conversations: chatId })
  ]);

  return newMessageId
}

export default function DarkChatScreen({ chatId = '1' }: ChatScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const botId = params.id || chatId;

  // fetch the conversation and its messages
  const { isLoading, error, data } = db.useQuery({
    conversations: {
      $: {
        where: {
          id: chatId
        }
      },
      messages: {}
    }
  });

  // these are messages from the database
  const messages = data?.conversations[0]?.messages || [];
  console.log("instant ok", chatId, messages)
  if (error) {
    console.error("UH OH! Instant Error -- ", error.message + ". Look at the error for details", error);
  }

  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Bot data based on the ID
  const botData = {
    name: getBotName(botId),
    image: require('@/assets/images/icon.png'),
  };

  function getBotName(id: string): string {
    switch (id) {
      case '1': return 'Ara';
      case '2': return 'GenZ';
      case '3': return 'Poet';
      case '4': return 'Chef';
      case '5': return 'Teacher';
      default: return 'Ara';
    }
  }

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  };

  // Effect to scroll when typing indicator appears
  useEffect(() => {
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
      <Text style={styles.emptyTitle}>Chat with {botData.name}</Text>
      <Text style={styles.emptyText}>
        Type a message to start your conversation!
      </Text>
    </View>
  );

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Insert user message into database
    addToChat(inputText.trim(), "user", chatId)

    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      // Get random response from the personality responses
      const responseArray = personalityResponses[botId as keyof typeof personalityResponses] || personalityResponses['1'];
      const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

      // Insert AI response into database
      addToChat(randomResponse, "assistant", chatId)

      setIsTyping(false);
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSettings = () => {
    router.push({
      pathname: '/chat/settings',
      params: { id: botId, name: botData.name }
    });
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <View style={[
      styles.messageBubble,
      message.role === "user" ? styles.userBubble : styles.aiBubble
    ]}>
      {message.role === "assistant" && (
        <Image source={botData.image} style={styles.avatarImage} />
      )}
      <View style={[
        styles.messageContent,
        message.role === "user" ? styles.userContent : styles.aiContent
      ]}>
        <Text style={styles.messageText}>{message.content}</Text>
      </View>
    </View>
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="chevron-left" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{botData.name}</Text>
          <Text style={styles.headerSubtitle}>AI Assistant</Text>
        </View>

        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <FontAwesome name="gear" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View>
                {(index === 0 ||
                  new Date(item.createdAt).toDateString() !==
                  new Date(messages[index - 1].createdAt).toDateString()) && (
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateText}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                <MessageBubble message={item} />
              </View>
            )}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={scrollToBottom}
            ListFooterComponent={isTyping ? (
              <View style={styles.typingContainer}>
                <Image source={botData.image} style={styles.typingAvatar} />
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, { animationDelay: '0.2s' }]} />
                    <View style={[styles.typingDot, { animationDelay: '0.4s' }]} />
                  </View>
                </View>
              </View>
            ) : null}
          />
        ) : (
          <EmptyChat />
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <FontAwesome name="plus" size={20} color="#888" />
          </TouchableOpacity>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <FontAwesome name="paper-plane" size={20} color={inputText.trim() ? "#FFF" : "#555"} />
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#AAA',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageBubble: {
    flexDirection: 'row',
    marginVertical: 8,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContent: {
    padding: 12,
    borderRadius: 20,
  },
  userContent: {
    backgroundColor: '#FF3366',
    borderBottomRightRadius: 4,
  },
  aiContent: {
    backgroundColor: '#1A1A1A',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#FFF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    width: 40,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginHorizontal: 2,
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyImage: {
    width: '60%',
    height: 150,
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#000',
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    maxHeight: 120,
  },
  textInput: {
    fontSize: 16,
    color: '#FFF',
    paddingVertical: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
});