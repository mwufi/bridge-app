import React, { useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { TabsFilter, TabType } from '@/components/TabsFilter';

// Mock data for conversations
const conversations = [
  { 
    id: '1', 
    botName: 'Ara', 
    lastMessage: 'I found some interesting articles about that topic. Would you like me to share them?', 
    time: '10:45 AM',
    unread: 2,
    image: require('@/assets/images/icon.png'),
  },
  { 
    id: '2', 
    botName: 'GenZ', 
    lastMessage: `No cap, that's so based! Frfr.`,
    time: 'Yesterday',
    unread: 0,
    image: require('@/assets/images/icon.png'),
  },
  { 
    id: '3', 
    botName: 'Poet', 
    lastMessage: 'Words dance upon the page, like stars upon the night sky...',
    time: 'Yesterday',
    unread: 1,
    image: require('@/assets/images/icon.png'),
  },
  { 
    id: '4', 
    botName: 'Chef', 
    lastMessage: 'Would you like me to suggest a recipe for dinner tonight?',
    time: 'Monday',
    unread: 0,
    image: require('@/assets/images/icon.png'),
  },
  { 
    id: '5', 
    botName: 'Friend', 
    lastMessage: 'How was your weekend? Did you get a chance to try that new restaurant?',
    time: 'Sunday',
    unread: 0,
    image: require('@/assets/images/icon.png'),
  },
];

export default function ChatInboxScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);

    // Filter conversations based on the selected tab
    if (tab === 'all') {
      setFilteredConversations(conversations);
    } else if (tab === 'new') {
      setFilteredConversations(conversations.filter(conv => conv.unread > 0));
    } else {
      // For demo purposes, just show a subset based on tab
      setFilteredConversations(conversations.filter((_, index) => index % 2 === (tab === 'groups' ? 0 : 1)));
    }
  };

  const handleConversationPress = (id: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id }
    });
  };

  const handleNewChatPress = () => {
    // Navigate to bot selection screen
    router.push('/chat/new');
  };

  const renderConversationItem = ({ item }: { item: typeof conversations[0] }) => (
    <TouchableOpacity 
      style={styles.conversationItem} 
      onPress={() => handleConversationPress(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.image} style={styles.avatar} />
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unread}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.botName}>{item.botName}</Text>
          <Text style={styles.timeStamp}>{item.time}</Text>
        </View>
        <Text 
          style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar style="light" />
      
      <View style={[styles.header, { marginTop: Math.max(insets.top, 10) }]}>
        <ThemedText style={styles.headerTitle}>Messages</ThemedText>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChatPress}>
          <FontAwesome name="pencil-square-o" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <TabsFilter activeTab={activeTab} onTabChange={handleTabChange} />

      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  newChatButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FF3366',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3366',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  timeStamp: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#AAA',
  },
  unreadMessage: {
    color: '#FFF',
    fontWeight: '500',
  },
});