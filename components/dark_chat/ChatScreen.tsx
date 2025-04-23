import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import TypingIndicator from './TypingIndicator';
import db from '@/lib/instant';
import { id } from '@instantdb/react-native';
import { API_URL } from '@/lib/config';
import { ColorScheme, ColorSchemes, renderBackground, getBackgroundStyle } from '@/lib/theme';
const emptyStateImage = require('@/assets/images/empty-state.png');
const defaultBotImage = require('@/assets/images/icon.png');

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

function addToChat(content: string, role: "user" | "assistant", chatId: string, currentNumMessages: number) {
  const newMessage = { content, role, createdAt: new Date().toISOString() }
  const newMessageId = id()

  // persist the message
  db.transact([
    db.tx.conversations[chatId].merge({
      data: {
        lastMessage: newMessage,
        numMessages: currentNumMessages + 1
      }
    }),
    db.tx.messages[newMessageId].update(newMessage).link({ conversations: chatId })
  ]);

  return newMessageId
}

export default function DarkChatScreen({ chatId = '1' }: ChatScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const botId = params.id || chatId;

  // Add theme state
  const [currentTheme, setCurrentTheme] = useState<ColorScheme>(ColorSchemes.rose);

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
  // Memoize the messages array to prevent unnecessary re-renders
  const messages = useMemo(() => data?.conversations[0]?.messages || [], [data?.conversations[0]?.messages]);
  const botInfo = data?.conversations[0]?.data?.botInfo || {};
  const conversationName = data?.conversations[0]?.name || botInfo.name;
  // console.log("instant ok", chatId)
  // console.log("messages", messages)
  // console.log("botInfo", botInfo)
  if (error) {
    console.error("UH OH! Instant Error -- ", error.message + ". Look at the error for details", error);
  }

  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Bot data based on the ID
  const botData = {
    name: botInfo.name,
    image: botInfo.image || defaultBotImage,
  };

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
      <Text style={styles.emptyTitle}>Chat with {conversationName}</Text>
      <Text style={styles.emptyText}>
        Type a message to start your conversation!
      </Text>
    </View>
  );

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();

    // Insert user message into database
    addToChat(userMessage, "user", chatId, messages.length)

    setInputText('');
    setIsTyping(true);

    try {
      // Go back to using the internal API route to work around CORS/network issues
      // Call the Python backend directly to get an AI response
      // Change this URL to match your backend's address (use your IP or hostname instead of localhost when testing on device)
      const response = await fetch(`${API_URL}/threads/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      } else {
        console.log("response", await response.json())
      }

      // The backend will automatically add the AI response to the thread
      // No need to call addToChat here, since the messages will be loaded from the database
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Fallback to random responses if API fails
      const responseArray = personalityResponses[botId as keyof typeof personalityResponses] || personalityResponses['1'];
      const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

      // Insert fallback AI response into database
      addToChat(`${randomResponse} (API error fallback)`, "assistant", chatId, messages.length)
    } finally {
      setIsTyping(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSettings = () => {
    router.push(`/chat/${botId}/settings`);
  };

  // Properly memoize the bot image source
  const botImageSource = useMemo(() => botData.image, []);

  const MessageBubble = useCallback(({ message }: { message: Message }) => {
    const isUser = message.role === "user";
    const theme = isUser ? currentTheme.userBubble : currentTheme.assistantBubble;

    return (
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble
      ]}>
        {!isUser && (
          <Image
            source={botImageSource}
            style={styles.avatarImage}
            fadeDuration={0}
          />
        )}
        <View style={[
          styles.messageContent,
          isUser ? styles.userContent : styles.aiContent,
          {
            backgroundColor: theme?.background?.value.color || (isUser ? '#FF3366' : '#1A1A1A'),
          }
        ]}>
          <Text style={[styles.messageText, { color: theme?.foreground || '#FFFFFF' }]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  }, [botImageSource, currentTheme]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // TODO: for debug purposes
  const tagline = API_URL;

  const view = (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Chat Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.input?.background || '#222' }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="chevron-left" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{conversationName}</Text>
          <Text style={styles.headerSubtitle}>{tagline}</Text>
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
            removeClippedSubviews={false}
            initialNumToRender={20}
            maxToRenderPerBatch={10}
            windowSize={10}
            renderItem={({ item, index }) => (
              <View key={`msg-${item.id}`}>
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
                <Image
                  source={botImageSource}
                  style={styles.avatarImage}
                  fadeDuration={0}
                />
                <View style={[styles.typingBubble, {
                  backgroundColor: currentTheme.assistantBubble?.background?.value.color || '#1A1A1A'
                }]}>
                  <TypingIndicator />
                </View>
              </View>
            ) : null}
          />
        ) : (
          <EmptyChat />
        )}

        {/* Input Container */}
        <View style={[styles.inputContainer, {
          borderTopColor: currentTheme.input?.background || '#222',
          backgroundColor: currentTheme.input?.background || '#000'
        }]}>
          <TouchableOpacity style={styles.attachButton}>
            <FontAwesome name="plus" size={20} color={currentTheme.input?.foreground || '#888'} />
          </TouchableOpacity>

          <View style={[styles.textInputContainer, {
            backgroundColor: currentTheme.input?.background || '#1A1A1A'
          }]}>
            <TextInput
              style={[styles.textInput, {
                color: currentTheme.input?.foreground || '#FFF'
              }]}
              placeholder="Type a message..."
              placeholderTextColor={currentTheme.input?.foreground || '#888'}
              value={inputText}
              onChangeText={setInputText}
              multiline
              autoCapitalize="none"
              spellCheck={false}
              keyboardAppearance="dark"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
              { backgroundColor: inputText.trim() ? '#FF3366' : '#333' }
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <FontAwesome
              name="paper-plane"
              size={20}
              color={inputText.trim() ? "#FFF" : "#555"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return renderBackground(currentTheme.background, view);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
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
    padding: 12,
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
    maxWidth: '90%',
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
  },
  typingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  typingBubble: {
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